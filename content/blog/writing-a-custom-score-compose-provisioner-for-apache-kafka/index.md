---
title: Writing a custom score-compose provisioner for Apache Kafka
date: 2024-06-10T00:00:00-00:00
draft: false
description: Interested in building a custom resource provisioner for your Score implementation? Learn step-by-step how to create a provisioner based on the example of Apache Kafka.
image: 6666f56e8f47adc749d74f38_Writing a custom score-compose provisioner for Apache Kafka-p-800.jpg
author: ben-meier
---

Score is a workload specification that allows developers to configure their application in a generic way without having to code for the specific deployment platform. We often use [score-compose](https://github.com/score-spec/score-compose) as the local development runtime to validate and test Score files. Score-compose provides a set of [default resource provisioners](https://github.com/score-spec/score-compose?tab=readme-ov-file#resource-support) for things like databases, redis, rabbitmq, etc, but at the time of writing doesn’t provide a Kafka resource! In this post I want to use this as an opportunity to show you how to write a custom resource provisioner, some guidelines to keep in mind, and some suggestion on how to write and test these.

## Setting the stage

Let’s start with our simple application we’re going to use to test with today. It will publish a periodic heartbeat event on a given Kafka topic. We’ll be building this into a little Docker image to run in score-compose.

{{< highlight go >}}
package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"os"
	"time"
	"github.com/segmentio/kafka-go"
)

func main() {
	host, port, topicName := os.Getenv("KAFKA_HOST"), os.Getenv("KAFKA_PORT"), os.Getenv("KAFKA_TOPIC")
	if host == "" {
		log.Fatal("KAFKA_HOST is empty or not set")
	} else if port == "" {
		log.Fatal("KAFKA_PORT is empty or not set")
	} else if topicName == "" {
		log.Fatal("KAFKA_TOPIC is empty or not set")
	}

	log.Printf("connecting to %s:%s/%s and sending 'ping' every 5s", host, port, topicName)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()
	conn, err := kafka.DialLeader(ctx, "tcp", fmt.Sprintf("%s:%s", host, port), topicName, 0)
	if err != nil {
		log.Fatalf("failed to dial to kafka: %v", err)
	}
	defer conn.Close()

	for {
		_ = conn.SetWriteDeadline(time.Now().Add(time.Second * 5))
		if r, err := conn.Write([]byte("ping")); err != nil {
			log.Printf("error: failed to ping: %v", err)
		} else {
			slog.Info("successfully sent message", slog.Int("#bytes", r))
		}
		time.Sleep(time.Second * 5)
	}
}
{{</ highlight >}}

**Dockerfile**
  
{{< highlight dockerfile >}}
FROM golang:1.22-alpine AS builder

WORKDIR /app
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GOWORK=off
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download
RUN --mount=target=. \
    --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -o /sample .


FROM gcr.io/distroless/static as final
COPY --from=builder /sample .
ENTRYPOINT ["/sample"]
{{</ highlight >}}

Easy enough! How about our target Score file:

**score.yaml**

{{< highlight javascript>}}
apiVersion: score.dev/v1b1
metadata:
  name: sample-app
  
containers:
  main:
    image: .
    variables:
      KAFKA_HOST: ${resources.bus.host}
      KAFKA_PORT: ${resources.bus.port}
      KAFKA_TOPIC: ${resources.bus.name}
      
resources:
  bus:
    type: kafka-topic
{{</ highlight >}}

Now if we run `score-compose init && score-compose generate score.yaml --build main=.` we get the expected error - Oh no!

{{< highlight shell >}}
Error: failed to provision: resource 'kafka-topic.default#sample-app.bus' is not supported by any provisioner
{{</ highlight >}}

## Laying the groundwork for the provisioner

Now that we have a `.score-compose` directory, we can start work on a custom provisioner file. I’ll work with `.score-compose/00-kafka-topic-provisioner.provisioners.yaml`. I’m going to make sure that’s excluded from our `gitignore` file.

{{< highlight shell >}}
echo '{}' > .score-compose/00-kafka-topic-provisioner.provisioners.yaml
echo '!.score-compose/00-kafka-topic-provisioner.provisioners.yaml' >> .gitignore
{{</ highlight >}}

> Q: Why the `00-` prefix?

> *A: Provisioner files are loaded in lexicographic order. I want this to take precedence over other provisioner files*.

Now we can get started modifying this file. It’s good to first decide what outputs the provisioner will have. This usually depends on the resource type you’re using and what conventions exist for it. Since we’re building a `kafka-topic` here, we’re going to output `host`, `port`, and `name` (the topic name). These match the Humanitec resource type of the same name. If we make them compatible, then we allow folks to deploy the same Score workload to Humanitec. We start with an initial provisioner declaration with fake outputs to see what it does to our workload.

{{< highlight shell >}}
--- a/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
+++ b/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
@@ -1 +1,6 @@
-{}
+- uri: template://custom-provisioners/kafka-topic
+  type: kafka-topic
+  outputs: |
+    host: unknown
+    port: "9092"
+    name: unknown
{{</ highlight >}}

If we re-run `generate` now, we don’t have an error.

{{< highlight shell >}}
$ score-compose generate score.yaml --build=main=.
INFO: Loaded state directory with docker compose project 'score-eg-kafka-provisioner'
INFO: Validated workload 'sample-app'
INFO: Successfully loaded 11 resource provisioners
INFO: Provisioned 1 resources
INFO: Converting workload 'sample-app' to Docker compose
INFO: containers.main: overriding container build config to context=.
{{</ highlight >}}

But when we run `docker compose up` we get an error.

{{< highlight shell >}}
$ docker compose up
[+] Running 1/0
 ✔ Container score-eg-kafka-provisioner-sample-app-main-1  Created                                                                                                                                           0.0s 
Attaching to sample-app-main-1
sample-app-main-1  | 2024/06/05 13:31:48 connecting to unknown:9092/unknown and sending 'ping' every 5s
sample-app-main-1  | 2024/06/05 13:31:48 failed to dial to kafka: failed to dial: failed to open connection to unknown:9092: dial tcp: lookup unknown on 127.0.0.11:53: no such host
sample-app-main-1 exited with code 1
{{</ highlight >}}

Which is totally not surprising!

## Diving into the Kafka implementation

Now we need a Kafka implementation. There’s a well-documented one here in Dockerhub: [https://hub.docker.com/r/bitnami/kafka](https://hub.docker.com/r/bitnami/kafka).  It can be configured in all sorts of ways, but we’re going to focus on the most basic single-node, non-zk, plaintext security setup.

One thing to think about is what we want to do when multiple kafka-topics are provisioned. The simplest provisioners will produce an entire new container copy when another instance of the same resource type is requested. This may be fine for simple applications, but most datastore’s support a shared “instance” with multiple individual datastores hosted on it. Kafka is no different here: a single Kafka instance can and should support multiple kafka topics. This is much better for efficiency - even on a local desktop testing environment.

This means that we’re going to be making use of the `shared` section of the provisioner, which produces shared state that can be shared between multiple instances of the same resource.

Looking at the Kafka docker image, we can identify some useful environment variables we want to use:

* `KAFKA_CFG_NODE_ID` - sets the node id so we can set the cluster voters layout
* `KAFKA_CFG_PROCESS_ROLES` - this node must run as both controller and broker with KRaft mode - no Zookeeper
* `KAFKA_CFG_LISTENERS` - set the ports
* `KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP` - set plaintext auth
* `KAFKA_CFG_CONTROLLER_QUORUM_VOTERS` - to set the KRaft layout
* `KAFKA_CFG_CONTROLLER_LISTENER_NAMES` - set the listener name
* `KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE` - we could use this automatically create the partitions as they are requested. HOWEVER, it’s better practise to enforce that the workloads use the real topic names that we will generate and don’t use hardcoded values.

Let’s get started by creating the kafka container. We’re going to follow the same pattern as the Postgres default provisioner which has a similar layout:

1. In the `shared` section we determine a stable service and hostname for our kafka instance, or use one if it’s already set from a previous `generate` call.
2. In the `state` section we determine a stable topic name for our kafka-topic instance.
3. In the `services`, we output a service with out variables set.
4. In the `outputs` we replace “unknown” with the real generated values.


{{< highlight shell >}}
--- a/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
+++ b/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
@@ -1,6 +1,22 @@
 - uri: template://custom-provisioners/kafka-topic
   type: kafka-topic
+  state: |
+    topic: {{ dig "topic" (print "topic-" (randAlphaNum 6)) .State | quote }}
+  shared: |
+    shared_kafka_instance_name: {{ dig "shared_kafka_instance_name" (print "kafka-" (randAlphaNum 6)) .Shared | quote }}
+  services: |
+    {{ .Shared.shared_kafka_instance_name }}:
+      image: bitnami/kafka:latest
+      restart: always
+      environment:
+        KAFKA_CFG_NODE_ID: "0"
+        KAFKA_CFG_PROCESS_ROLES: controller,broker
+        KAFKA_CFG_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
+        KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
+        KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: "0@{{ .Shared.shared_kafka_instance_name }}:9093"
+        KAFKA_CFG_CONTROLLER_LISTENER_NAMES: CONTROLLER
+        KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE: "false"
   outputs: |
-    host: unknown
+    host: {{ .Shared.shared_kafka_instance_name }}
     port: "9092"
-    name: unknown
+    name: {{ .State.topic }}
+    num_partitions: 3
{{</ highlight >}}

Let’s see what happens if we `score-compose generate` and `docker compose up` again. For one: we see that the kafka instance starts properly.

{{< highlight shell >}}
...
kafka-inT7pD-1        | [2024-06-05 14:17:35,680] INFO [KafkaRaftServer nodeId=0] Kafka Server started (kafka.server.KafkaRaftServer)
{{</ highlight >}}

**However**, our little Go program started first, and crashed!

{{< highlight shell >}}
sample-app-main-1     | 2024/06/05 14:17:31 connecting to kafka-inT7pD:9092/topic-LVJVOX and sending 'ping' every 5s
sample-app-main-1     | 2024/06/05 14:17:31 failed to dial to kafka: failed to dial: failed to open connection to kafka-inT7pD:9092: dial tcp 192.168.224.2:9092: connect: connection refused
sample-app-main-1 exited with code 1
{{</ highlight >}}

## Adding a health check to the Kafka process

To fix the start order, we need to add a health check to the Kafka process, so that we know when it is healthy and we can start the workloads:

{{< highlight shell >}}
--- a/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
+++ b/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
@@ -16,6 +16,11 @@
         KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: "0@{{ .Shared.shared_kafka_instance_name }}:9093"
         KAFKA_CFG_CONTROLLER_LISTENER_NAMES: CONTROLLER
         KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE: "false"
+      healthcheck:
+        test: ["CMD", "kafka-topics.sh", "--list", "--bootstrap-server=localhost:9092"]
+        interval: 2s
+        timeout: 2s
+        retries: 10
   outputs: |
{{</ highlight >}}

Now if we re-generate and start, we see the Kafka server start first, and then our Go program.

{{< highlight shell >}}
kafka-inT7pD-1        | [2024-06-05 14:20:33,007] INFO [KafkaRaftServer nodeId=0] Kafka Server started (kafka.server.KafkaRaftServer)
wait-for-resources-1  | 
wait-for-resources-1 exited with code 0
sample-app-main-1     | 2024/06/05 14:20:35 connecting to kafka-inT7pD:9092/topic-LVJVOX and sending 'ping' every 5s
sample-app-main-1     | 2024/06/05 14:20:40 failed to dial to kafka: context deadline exceeded
sample-app-main-1 exited with code 1
{{</ highlight >}}

But it still failed - this time with a timeout. This is because we disabled `KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE`, and the broker failed to route our message to an available topic partition.

## Setting up an init container to create a Kafka topic

Our next requirement is to setup an init container that can create our topic on start. For now we’re going to hard code the number of partitions as 3, the application can decide whether it wants to target a single partition or distribute across them. We add a new init container to the provisioner to call the [kafka-topics.sh](http://kafka-topics.sh/) script:

{{< highlight shell >}}
--- a/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
+++ b/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
@@ -21,6 +21,17 @@
         interval: 2s
         timeout: 2s
         retries: 10
+    {{ .State.topic }}-init:
+      image: bitnami/kafka:latest
+      entrypoint: ["/bin/sh"]
+      command: ["-c", "kafka-topics.sh --topic={{.State.topic}} --bootstrap-server=localhost:9092 --describe || kafka-topics.sh --topic={{.State.topic}} --bootstrap-server=localhost:9092 --create --partitions=3"]
+      network_mode: "service:{{ .Shared.shared_kafka_instance_name }}"
+      labels:
+        dev.score.compose.labels.is-init-container: "true"
+      depends_on:
+        {{ .Shared.shared_kafka_instance_name }}:
+          condition: service_healthy
+          restart: true
   outputs: |
{{</ highlight >}}

The command checks if the topic exists, and creates it if it does not. The `depends_on` section ensures this starts after Kafka. While the `dev.score.compose.labels.is-init-container` label ensures this service is included in the `wait-for-resources dependencies before the Workloads start`.

Now we re-generate and start and things look much better! Firstly our `topic-LVJVOX-init-1` ran successfully:

{{< highlight shell >}}
topic-cKgEgC-init-1  | Error while executing topic command : Topic 'topic-LVJVOX' does not exist as expected
topic-cKgEgC-init-1  | [2024-06-05 14:34:27,320] ERROR java.lang.IllegalArgumentException: Topic 'topic-LVJVOX' does not exist as expected
topic-cKgEgC-init-1  |  at org.apache.kafka.tools.TopicCommand.ensureTopicExists(TopicCommand.java:215)
topic-cKgEgC-init-1  |  at org.apache.kafka.tools.TopicCommand.access$700(TopicCommand.java:78)
topic-cKgEgC-init-1  |  at org.apache.kafka.tools.TopicCommand$TopicService.describeTopic(TopicCommand.java:559)
topic-cKgEgC-init-1  |  at org.apache.kafka.tools.TopicCommand.execute(TopicCommand.java:108)
topic-cKgEgC-init-1  |  at org.apache.kafka.tools.TopicCommand.mainNoExit(TopicCommand.java:87)
topic-cKgEgC-init-1  |  at org.apache.kafka.tools.TopicCommand.main(TopicCommand.java:82)
topic-cKgEgC-init-1  |  (org.apache.kafka.tools.TopicCommand)
topic-cKgEgC-init-1  | Created topic topic-LVJVOX.
{{</ highlight >}}

And our sample app is successfully writing messages!

{{< highlight shell >}}
sample-app-main-1     | 2024/06/05 14:34:29 connecting to kafka-inT7pD:9092/topic-LVJVOX and sending 'ping' every 5s
sample-app-main-1     | 2024/06/05 14:34:29 INFO successfully sent message #bytes=4
sample-app-main-1     | 2024/06/05 14:34:34 INFO successfully sent message #bytes=4
sample-app-main-1     | 2024/06/05 14:34:39 INFO successfully sent message #bytes=4
sample-app-main-1     | 2024/06/05 14:34:44 INFO successfully sent message #bytes=4
sample-app-main-1     | 2024/06/05 14:34:49 INFO successfully sent message #bytes=4
sample-app-main-1     | 2024/06/05 14:34:54 INFO successfully sent message #bytes=4
sample-app-main-1     | 2024/06/05 14:34:59 INFO successfully sent message #bytes=4
sample-app-main-1     | 2024/06/05 14:35:04 INFO successfully sent message #bytes=4
sample-app-main-1     | 2024/06/05 14:35:09 INFO successfully sent message #bytes=4
{{</ highlight >}}

## Inspecting the Kafka topic using a console

We can run a Kafka console like the [https://github.com/redpanda-data/console](https://github.com/redpanda-data/console) and view our topic and the messages being produced.

We can find the Docker network with a docker compose command:

{{< highlight shell >}}
$ echo $(docker compose ls -q)_default
score-eg-kafka-provisioner_default
{{</ highlight >}}

And the credentials with score-compose:

{{< highlight shell >}}
$ score-compose resources get-outputs 'kafka-topic.default#sample-app.bus' --format '{{.host}}:{{.port}}'
kafka-inT7pD:9092
{{</ highlight >}}

Putting it together we can attach a console:

{{< highlight shell >}}
$ docker run -p 8080:8080 --network $(docker compose ls -q)_default -e KAFKA_BROKERS=$(score-compose resources get-outputs 'kafka-topic.default#sample-app.bus' --format '{{.host}}:{{.port}}') docker.redpanda.com/redpandadata/console:latest
{{</ highlight >}}

{{< figure src="6666f4574dab27eec59a4642_Screenshot 2024-06-06 at 10.39.53.png" >}}

## Adding a persistent volume to store data

The other thing that’s recommended is to explicitly add a persistent volume so that the data is stored in a predictable Docker volume.

{{< highlight shell >}}
--- a/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
+++ b/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
@@ -21,6 +21,10 @@
         interval: 2s
         timeout: 2s
         retries: 10
+      volumes:
+      - type: volume
+        source: {{ .Shared.shared_kafka_instance_name }}-data
+        target: /bitnami/kafka
     {{ .State.topic }}-init:
       image: bitnami/kafka:latest
       entrypoint: ["/bin/sh"]
@@ -32,6 +36,9 @@
         {{ .Shared.shared_kafka_instance_name }}:
           condition: service_healthy
           restart: true
+  volumes: |
+    {{ .Shared.shared_kafka_instance_name }}-data:
+      driver: local
   outputs: |
{{</ highlight >}}

When starting, we’ll see a volume being created:

{{< highlight shell >}}
[+] Running 6/6
 ✔ Network score-eg-kafka-provisioner_default                 Created
 ✔ Volume "score-eg-kafka-provisioner_kafka-inT7pD-data"      Created    <--
 ✔ Container score-eg-kafka-provisioner-kafka-inT7pD-1        Healthy
 ✔ Container score-eg-kafka-provisioner-topic-LVJVOX-init-1   Exited
 ✔ Container score-eg-kafka-provisioner-wait-for-resources-1  Started
 ✔ Container score-eg-kafka-provisioner-sample-app-main-1     Started
{{</ highlight >}}

## Adding an annotation to expose Kafka ports

Finally, it’s a good idea to support an annotation which allows us to expose the Kafka ports so that other processes or tests can be run against it from outside Docker. We do this for things like the RabbitMQ provisioner as well.

{{< highlight shell >}}
--- a/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
+++ b/.score-compose/00-kafka-topic-provisioner.provisioners.yaml
@@ -21,6 +21,12 @@
         interval: 2s
         timeout: 2s
         retries: 10
+      {{ $publishPort := (dig "annotations" "compose.score.dev/publish-port" "0" .Metadata | atoi) }}
+      {{ if ne $publishPort 0 }}
+      ports:
+      - target: 9092
+        published: {{ $publishPort }}
+      {{ end }}
       volumes:
{{</ highlight >}}

Now if we add that annotation to the kafka-topic resource in our Score file, we’ll see the port exposed:

{{< highlight shell >}}
score-eg-kafka-provisioner-kafka-inT7pD-1      bitnami/kafka:latest                         "/opt/bitnami/script…"   kafka-inT7pD      27 seconds ago   Up 26 seconds (healthy)   127.0.0.1:55002->9092/tcp
{{</ highlight >}}

## Verifying our setup

To be doubly sure we’ve done the right thing, let’s provision another kafka topic in our Score file, and validate that it produces 2 separate topics, but on the same Kafka process.

2 init containers, with 2 different topic names:

{{< highlight shell >}}
 ✔ Container score-eg-kafka-provisioner-kafka-inT7pD-1        Healthy
 ✔ Container score-eg-kafka-provisioner-topic-LVJVOX-init-1   Exited
 ✔ Container score-eg-kafka-provisioner-topic-gDyZ62-init-1   Exited
 ✔ Container score-eg-kafka-provisioner-wait-for-resources-1  Started
 ✔ Container score-eg-kafka-provisioner-sample-app-main-1     Started
{{</ highlight >}}

And the console shows both topics created:

{{< figure src="6666f51b3736268948c9eec6_Screenshot 2024-06-06 at 10.37.52.png" >}}

Great! Now I could keep this to myself and use it in my projects, or internally in my own team. But really I want to contribute it up to the score-compose project so that others can use it. So with some final polishing, a PR is up here: [https://github.com/score-spec/score-compose/pull/150](https://github.com/score-spec/score-compose/pull/150).

🎉 And there we have it, a brand new score-compose provisioner for a Kafka topic. Complete with multi-topic support and a random service and topic name. I hope this helps other folks going through a similar process in the future and contributing to either score-compose or score-k8s.

## FAQ

### Why don’t we include a username or password in the outputs?

Kafka has many different authentication mechanisms, including mutual TLS, basic username and password, no auth (like we used today), etc. Since there is no standard authentication mechanism, we suggest this is handled using a different resource type. For example, a `kafka-auth-password` or something like that. This would then be provisioned on the shared Kafka instance.

### Why not clustering or more complex layouts?

The point of the resource-types in docker compose are to provision the most simple implementation that meets the specification. If a user needs a more sophisticated configuration, they should copy the provisioner into their own custom provisioners file, and change it to their liking.

### What’s the difference between score-compose and score-k8s provisioners?

They will look very similar, because `score-k8s` copied the template mechanism from `score-compose`. However, instead of producing services, networks, and volumes, the `score-k8s` provisioners create Kubernetes manifests in the `manifests` section. Other than this, they are quite similar.