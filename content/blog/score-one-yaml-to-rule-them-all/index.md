---
title: Score - One YAML to rule them all
date: 2022-11-08T00:00:00-00:00
draft: false
description: The Score Specification enables developers to run their workloads across different technology stacks without risking configuration inconsistencies. As a platform-agnostic declaration file, score.yaml presents the single source of truth on how to run a workload and works to utilise any container orchestration platform and tool - be it Docker Compose or Kubernetes.
image: 637b58d54f76a770b1bd4733_Score - One YAML to rule them all-p-800.png
author: susa-tunker
---

A Score sheet is a musical notation that describes notes that are played by a musician for their instrument. It is used by a conductor to see at a glance what each performer should be playing and what the ensemble sound should be. In the same way does the `score.yaml` specification make developers the conductor of a workload that is being run across a symphony orchestra of technology and tooling.

### The problem of configuration mismatch in application development

In modern software development workloads are typically deployed as microservices, each component packaged into its own container. Running containerised workloads allows teams to run their code across different environments without a single worry on their mind. Wishful thinking meets reality once containers need to be managed at scale and teams start making use of container orchestration platforms including [a wide range of tooling](https://landscape.cncf.io/) that support application development. Suddenly there’s a lot more to consider as a developer when preparing your workload for its journey towards production. The variety of tooling involved to successfully deploy code brings developers back to the “but it works on my machine” problem.

As a developer you might be using Docker Compose for local development and deploy to remote environments that are based on systems such as Kubernetes, Google Cloud Run, Amazon ECS or HashiCorp Nomad. To successfully develop, test, deploy and run a workload, you not only have to be familiar with the platform and related tooling your team makes use of, but also keep each workload’s specification in sync. If entities are configured differently across platforms, teams risk configuration inconsistencies. For example: A workload with a dependancy on a database might point to a postgres image or mock server in lower environments. On its way to production however, a database has to be provisioned and allocated via Terraform. Such ‘translation gaps’ between environments exist for all kinds of items - volumes, external services (e.g. Vault or RabbitMQ), ports, DNS records or routes etc.

From a developer’s point of view, you successfully test and run a workload locally and even pass the isolated tests embedded into your CI pipeline. The question of how things are now appropriately reflected in the next environment - which might be running on Kubernetes and is managed via helm charts -  is answered differently in every team and depends on the complexity of the task at hand. A variable change is easier to keep in sync than declaring a dependancy on a database across different platforms.

In practice, an ops engineer might jump in to review configurational changes. You might compare the workload specification for each platform yourself. A colleague might be working on a policy definition for yaml files. Either way, if a property is overseen or has accidentally been wrongly specified, the team will end up with a failed deployment or a workload that is running in a way that it’s not intended to.

### Score’s approach

To address this problem, we created a tool that simplifies application development for developers and ensures a standardised, consistent and transparent approach to configuration management for teams.

{{< figure src="637217b89ebb811f4012bd40_how-score-works.png" alt="The 3 core components of Score" >}}

As shown in the graphic above, are there 3 core components to consider in the context of Score:

* The **Score Specification**: A developer-centric workload definition that describes how to run a workload. As a platform-agnostic declaration file, `score.yaml` presents the single source of truth on a workloads profile of requirements and works to utilise any container orchestration platform and tool.
* A **Score Implementation**: A CLI tool which the Score Specification can be executed against. It is tied to a platform such as Docker Compose ([score-compose](https://github.com/score-spec/score-compose)), Helm ([score-helm](https://github.com/score-spec/score-helm)) or Humanitec ([score-humanitec](https://github.com/score-spec/score-humanitec)) and will take care of generating a platform-specific configuration file (such as `docker-compose.yaml`, `chart.yaml`) from the Score spec.
* A **platform specific configuration file**: By running the Score Specification against a Score Implementation such as [score-compose](https://github.com/score-spec/score-compose), a platform specific configuration file, such as `docker-compose.yaml` can be generated. This file can then be combined with environment specific parameters to run the workload in the target environment.

With Score the same workload can be run on completely different technology stacks without the developer needing to be an expert in any of them. For example, the same Score Specification can be used to generate a docker-compose file for local development, Kubernetes manifests for deployment to a shared development environment and to a serverless platform such as Google Cloud Run for integration tests.

### The Score Specification

The Score specification allows you to specify which containers to use, whether resource or service dependencies exist, if ports are to be opened or what data volumes to reference - whatever it is that a workload requires you to run, it is captured in `score.yaml`. Structurally, the specification consists of 3 top level items:

* **containers**: defines how the workload’s tasks are executed.
* **resources**: defines dependencies needed by the workload.
* **service**: defines how a workload can expose its resources when executed.

The `example-service` workload defined in the `score.yaml` file below is comprised of one `busybox` container, has a dependancy on a `postgres` database and advertises two public ports `80` and `8080`:

{{< highlight yaml >}}
apiVersion: score.dev/v1b1

metadata:
  name: example-service

containers:
  container-id:
    image: busybox
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo Hello $${FRIEND}!; sleep 5; done"]
    variables:
        CONNECTION_STRING: postgresql://${resources.db.username}:${resources.db.password}@${resources.db.host}:${resources.db.port}/${resources.db.name}

resources:
  db:
    type: postgres

service:
  ports:
    www:
      port: 80
      targetPort: 8080
    admin:
      port: 8080
      protocol: UDP
{{</ highlight >}}

Explore the Score Specification reference in full detail on docs.score.dev.
An example

In this example we are working with a simple Docker Compose service that is based on a busybox image. The `score.yaml` we created for it looks as follows:

{{< highlight yaml >}}
apiVersion: score.dev/v1b1
metadata:
  name: hello-world
containers:
  hello:
    image: busybox
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo Hello World!; sleep 5; done"]
{{</ highlight >}}

To convert the `score.yaml` file into an executable `compose.yaml` file, we simply need to run the `score-compose` CLI tool:

{{< highlight bash >}}
$ score-compose run -f ./score.yaml -o ./compose.yaml
{{</ highlight >}}

The generated `compose.yaml` will contain a single service definition:

{{< highlight yaml >}}
services:
  hello-world:
    command:
      - -c
      - 'while true; do echo Hello World!; sleep 5; done'entrypoint:
      - /bin/sh
    image: busybox
{{</ highlight >}}

The service can now be run with `docker-compose` as usual:

{{< highlight bash >}}
$ docker-compose -f ./compose.yaml up hello-world

[+] Running 2/2
 ⠿ Network compose_default          Created                                                                                                                                               0.0s
 ⠿ Container compose-hello-world-1  Created                                                                                                                                               0.1s
Attaching to compose-hello-world-1
compose-hello-world-1  | Hello World!
compose-hello-world-1  | Hello World!
{{</ highlight >}}

The same `score.yaml` can be run with any other Score Implementation CLI. Working with Helm? Check out [score-helm](https://github.com/score-spec/score-helm) next.

With all platform configuration files being generated from the same Specification, the risk of configuration inconsistencies between environments significantly decreases. A change to `score.yaml` will automatically be reflected in all environments, without the developer needing to manually intervene.

### Get involved

With the Score Specification we’re not only aiming to speed up and advance application development for engineering teams but also foster [focus, flow and joy](https://itrevolution.com/articles/five-ideals-of-devops/) for developers in their day to day work.

If you want a world with lower cognitive load on developers, less config drift or mismanagement, and frankly just more productive, happier days for all of us, go [check out the repo](https://github.com/score-spec/spec), contribute, reach out. This is just the beginning — we’d love to build the future of development together.

### Reference

[https://docs.score.dev/docs/concepts/configuration-mismanagement/](https://docs.score.dev/docs/concepts/configuration-mismanagement/)

[https://docs.score.dev/docs/reference/score-spec-reference/](https://docs.score.dev/docs/reference/score-spec-reference/)

[https://github.com/score-spec/score-compose/tree/main/examples/01-hello](https://github.com/score-spec/score-compose/tree/main/examples/01-hello)