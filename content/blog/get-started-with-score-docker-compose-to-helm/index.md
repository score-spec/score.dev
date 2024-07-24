---
title: "Get started with Score: Docker Compose to Helm"
date: 2022-11-16T00:00:00-00:00
draft: false
description: In this tutorial you will learn how to get started with Score, a platform-agnostic, container-based workload specification. We will cover the creation of two Score Specification YAML files and how we can translate them to Helm values files and Docker Compose.
image: 637b58c20376a8269ba4d8e6_Tutorial_ Getting started with Score-p-800.png
author: fernando-villalba
---

## Introduction

Score is an open source, platform-agnostic, container-based workload specification. This means you can define your workload once with the Score Specification and then use a Score Implementation CLI to translate it to multiple platforms, such as Kubernetes (as a Helm values file), Google Cloud Run, or Docker Compose. The aim of this project is to reduce toil and cognitive load of developers by only having to define a single YAML that works across multiple platforms.

Score does not intend to be a fully featured YAML replacement for those platforms, it only aims to define workloads that can be combined with more advanced YAML configurations that an infrastructure team would provide to developers in an organization.

## Overview

This tutorial will cover the creation of two Score Specification YAML files and how we can translate them to Helm values files and Docker Compose.

## Prerequisities

This tutorial requires you to have the following tools installed:

1. [Helm](https://helm.sh/docs/intro/install/)
2. [Docker Compose](https://docs.docker.com/compose/install/)
3. A Kubernetes cluster to experiment on. If you want to do this locally we recommend [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/)
4. [Docker](https://www.docker.com/products/docker-desktop/)
5. [kubectl](https://kubernetes.io/docs/reference/kubectl/) connected to your Kubernetes cluster of choice
6. Install [score-helm and score-compose](https://docs.score.dev/docs/get-started/install/)

## Two Workloads with Score Spec

In this scenario, we will be first donning our developer hat and creating two Score spec YAML files for the following workloads:

* A mock `backend workload` with `postgres:alpine` image that connects to a `database resource` and to a `frontend workload`.
* A mock `frontend workload` with `nginx:alpine image`.

We will then don our infrastructure engineer hat and create the following resource:

* A `db resource` compose file and Helm values file with `postgres:alpine` to mimic a database.

### score-compose

Don’t forget to ensure you have all the pre-requisites before you follow these steps.

#### 1. Create a folder

{{< highlight bash >}}
mkdir ~/score-getting-started ; cd ~/score-getting-started
{{</ highlight >}}

#### 2. Create `backend.score.yaml`

{{< highlight yaml >}}
cat <<- "EOF" > backend.score.yaml
apiVersion: score.dev/v1b1
metadata:
  name: backend
containers:
  backend:
    image: postgres:alpine
    command: ["/bin/sh"]
    args: ["-c", "sleep 5; while nc -z -v -w30 $${FRONTEND_HOST} 80 && psql $$CONNECTION_STRING -c \"SELECT version()\"; do echo : Hey $${GREETING_NAME}, connecting to DB $${CONNECTION_STRING} and $${FRONTEND_HOST} was successful!; sleep 10; done"]
    variables:
      CONNECTION_STRING: postgresql://${resources.db.user}:${resources.db.password}@${resources.db.host}:${resources.db.port}/${resources.db.name}
      FRONTEND_HOST: ${resources.frontend.host}
      GREETING_NAME: ${resources.env.name} 
resources:
  env:
    type: environment
  db:
    type: postgres    
  frontend:
    type: workload
EOF
{{</ highlight >}}

* This is a mock `backend` with image `postgres:alpine` that connects to the database resource and a frontend workload to demonstrate connectivity and dependency of resources.
* The variable values are mostly derived from placeholders that refer to resource data. Resources also explicitly define your workload dependencies, but they can also be used to define environment variable values as shown by the `GREETING_NAME` variable. 

You may be thinking, why should I go this long winded way to provide values to my environment variables via resource placeholders? Why don’t I just do it directly? The answer is that Score is designed with dynamic configuration management in mind, meaning that values can be injected in the target environment without needing to change your Score file for every environment.

#### 3. Create file `frontend.score.yaml`

{{< highlight yaml >}}
cat <<- "EOF" > frontend.score.yaml
apiVersion: score.dev/v1b1
metadata:
  name: frontend
containers:
  frontend:
    image: nginx:alpine
service:
  ports:
    www:
      port: 80
      targetPort: 80
EOF
{{</ highlight >}}

#### 4. Donning the infrastructure engineer hat, create the `db.compose.yaml` - this is a compose YAML, not Score!

{{< highlight yaml >}}
cat <<- "EOF" > db.compose.yaml
services:
  db:
    image: postgres:alpine
    restart: always
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
      - CONNECTION_STRING=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST-db}:${DB_PORT-5432}/${DB_NAME-cooldb}
    ports:
      - '5432:5432'
    volumes: 
      - db:/var/lib/postgresql/data
volumes:
  db:
    driver: local
EOF
{{</ highlight >}}


Technically, we could also define this in Score as it is a simple workload with a volume to mimic our database infrastructure, but we wanted to highlight here that Score is only to be used with microservice workloads that are typically the purview of developer activities. Infrastructure engineers would define and/or provision any other infrastructure that’s required, whether with Compose files, Terraform or whatever.

Therefore, Score is not intended to be a full feature replacement of using Compose or Helm directly, just a way for developers to define their workload specifications and be able to translate that to multiple platforms.

#### 5. Translate Score files to Compose files

{{< highlight bash >}}
score-compose run -f frontend.score.yaml -o frontend.compose.yaml
score-compose run -f backend.score.yaml -o backend.compose.yaml --env-file .env
{{</ highlight >}}

This command will translate your Score files and write the resulting output to Compose files. The `--env-file` flag is used to write a `.env` file that can be used by `docker-compose`.

Let’s look at the resulting files and explain them a little bit:

`frontend.compose.yaml`

{{< highlight yaml >}}
services:
  frontend:
    image: nginx:alpine
    ports:
      - target: 80
        published: "80"
{{</ highlight >}}

`backend.compose.yaml`

{{< highlight yaml >}}
services:
  backend:
    command:
      - -c
      - 'sleep 5; while nc -z -v -w30 $${FRONTEND_HOST} 80 && psql $$CONNECTION_STRING -c "SELECT version()"; do echo : Hey $${GREETING_NAME}, connecting to DB $${CONNECTION_STRING} and $${FRONTEND_HOST} was successful!; sleep 10; done'
    depends_on:
      db:
        condition: service_started
      frontend:
        condition: service_started
    entrypoint:
      - /bin/sh
    environment:
      CONNECTION_STRING: postgresql://${DB_USER-jimmy}:${DB_PASSWORD-defaultpass}@${DB_HOST-db}:${DB_PORT-5432}/${DB_NAME-cooldb}
      FRONTEND_HOST: ${FRONTEND_HOST-frontend}
      GREETING_NAME: ${GREETING_NAME-Jimmy}
    image: postgres:alpine
{{</ highlight >}}

The environment variables have been defaulted to the values you defined in your services earlier, but they also have been written to an `.env` file below. A developer could edit the variables in the `.env` file and add that to `.gitignore` so passwords and other variables don’t get written to the repository.

{{< highlight bash >}}
DB_HOST=db
DB_PORT=5432
DB_NAME=cooldb
FRONTEND_HOST=frontend
GREETING_NAME=Jimmy
DB_USER=jimmy
DB_PASSWORD=defaultpass
{{</ highlight >}}

#### 6. Now that everything is in place, we can simply start our workloads like so:

{{< highlight bash >}}
docker-compose -f db.compose.yaml -f backend.compose.yaml -f frontend.compose.yaml --env-file .env up
{{</ highlight >}}

We should get this output:

{{< highlight bash >}}
score-getting-started-backend-1   | frontend (172.20.0.3:80) open
score-getting-started-backend-1   |                                                       version
score-getting-started-backend-1   | --------------------------------------------------------------------------------------------------------------------
score-getting-started-backend-1   |  PostgreSQL 15.0 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 11.2.1_git20220219) 11.2.1 20220219, 64-bit
score-getting-started-backend-1   | (1 row)
score-getting-started-backend-1   |
score-getting-started-backend-1   | : Hey Jimmy, connecting to DB postgresql://jimmy:defaultpass@db:5432/cooldb and frontend was successful!
{{</ highlight >}}

#### Clean up

You can now control+c out of docker-compose and then clean up the volume and network with the following command:

{{< highlight bash >}}
docker-compose -f db.compose.yaml -f backend.compose.yaml -f frontend.compose.yaml --env-file .env down --volume
{{</ highlight >}}

### Helm

We will be using the same Score files we created in the previous section to deploy our workload via Helm. Make sure you are still in the `~/score-getting-started` folder.

If you did not do the score-compose section before this, you will need to at least set up your frontend and backend Score YAML files as described in step 2 and 3.

We will be assuming you already have `kubectl` configured with a cluster. If not, you can use something like [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/) to easily set one up, see pre-requisites above.

The `score-helm` implementation outputs a values.yaml file to be used with Helm. It does not create a chart.

#### 1. Create the helm values file that will be used by our db (infrastructure engineer persona)

{{< highlight yaml >}}
cat <<- "EOF" > db-values.yaml
containers:
  backend:
    env:
      - name: POSTGRES_USER
        value: jimmy
      - name: POSTGRES_PASSWORD
        value: defaultpass
      - name: POSTGRES_DB
        value: cooldb
      - name: CONNECTION_STRING
        value: postgresql://jimmy:defaultpass@db:5432/cooldb
    image:
      name: postgres:alpine

service:
  ports:
    - name: pg
      port: 5432
      protocol: TCP
      targetPort: 5432
  type: ClusterIP
EOF
{{</ highlight >}}

#### 2. Translate the Score files to Helm values files:

{{< highlight bash >}}
score-helm run -f frontend.score.yaml -o frontend-values.yaml
score-helm run -f backend.score.yaml -o backend-values.yaml
{{</ highlight >}}

The above will create the following Helm values files: `frontend-values.yaml`

{{< highlight yaml >}}
containers:
  frontend:
    image:
      name: nginx:alpine
service:
  ports:
    - name: www
      port: 80
      targetPort: 80
  type: ClusterIP
{{</ highlight >}}

`backend-values.yaml`
  
{{< highlight yaml >}}
containers:
  backend:
    args:
      - -c
      - 'sleep 5; while nc -z -v -w30 $${FRONTEND_HOST} 80 && psql $$CONNECTION_STRING -c "SELECT version()"; do echo : Hey $${GREETING_NAME}, connecting to DB $${CONNECTION_STRING} and $${FRONTEND_HOST} was successful!; sleep 10; done'
    command:
      - /bin/sh
    env:
      - name: CONNECTION_STRING
        value: postgresql://jimmy:defaultpass@db:5432/cooldb
      - name: FRONTEND_HOST
        value: frontend
      - name: GREETING_NAME
        value: Jimmy
    image:
      name: postgres:alpine
{{</ highlight >}}

#### 3. Add the workload Helm repo

{{< highlight bash >}}
helm repo add score-helm-charts https://score-spec.github.io/score-helm-charts
{{</ highlight >}}

This Helm chart is a workload reference chart that can be adapted for any use case, find the source code here:

[https://github.com/score-spec/score-helm-charts](https://github.com/score-spec/score-helm-charts)

#### 4. Install the three workloads using our three value files

{{< highlight bash >}}
helm install db score-helm-charts/workload --values db-values.yaml
helm install frontend score-helm-charts/workload --values frontend-values.yaml
helm install backend score-helm-charts/workload --values backend-values.yaml
{{</ highlight >}}

#### 5. Verify the installation

{{< highlight bash >}}
(clear
echo ------- Deployments ----------
kubectl get deploy
echo
echo --------- Services -----------
kubectl get svc
echo
echo --------- Pods ---------------
kubectl get pods
echo
echo --------- Backend Pod Logs ----------
echo If you dont see any logs, run this command again
kubectl logs -l app.kubernetes.io/name=backend --tail=4)
{{</ highlight >}}

Your output should be similar to this:

{{< highlight bash >}}
------- Deployments ----------
NAME       READY   UP-TO-DATE   AVAILABLE   AGE
backend    1/1     1            1           13s
db         1/1     1            1           14s
frontend   1/1     1            1           13s

--------- Services -----------
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
db           ClusterIP   10.96.132.65   none        5432/TCP   14s
frontend     ClusterIP   10.96.144.86   none        80/TCP     13s
kubernetes   ClusterIP   10.96.0.1      none        443/TCP    32d

--------- Pods ---------------
NAME                        READY   STATUS    RESTARTS   AGE
backend-7bd7ccbf99-8jmzf    1/1     Running   0          13s
db-5cf86d46d4-9tm6v         1/1     Running   0          14s
frontend-7555cff55f-nk254   1/1     Running   0          13s

--------- Backend Pod Logs ----------
If you dont see any logs, run this command again
 PostgreSQL 15.0 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 11.2.1_git20220219) 11.2.1 20220219, 64-bit
(1 row)

: Hey Jimmy, connecting to DB postgresql://jimmy:defaultpass@db:5432/cooldb and frontend was successful!
{{</ highlight >}}

#### Clean up

{{< highlight bash >}}
helm uninstall backend db frontend
{{</ highlight >}}

## Conclusion

That’s it! In this tutorial you have successfully:

* Defined a frontend and backend workload with Score as a developer using a single specification
* Defined a DB resource for both Helm and Compose as an infrastructure engineer
* Translated both workload Score specs to Helm and Compose
* Deployed all your workloads and infrastructure with both Compose and Helm

It is very important to understand that even though we have been using Score to translate YAML files to other YAML files we don’t just see it as a translation tool, we are well aware that there are tools for this already like [Kompose](https://kompose.io/) that are far more fully featured.

You should look at Score as a way to define workloads, a spec that developers will use so that they don’t need to be concerned with all the nuts and bolts of infrastructure and can fully focus on development.

## Help make Score a new standard

With Score, we’re not only aiming to speed up and advance application development for engineering teams but also foster [focus, flow and joy](https://itrevolution.com/articles/five-ideals-of-devops/) for developers in their day to day work.

But we are still early. There’s a lot more work to be done both on the [Score spec](https://docs.score.dev/docs/reference/score-spec-reference/) and especially the CLI implementations. So far, we released [score-compose](https://github.com/score-spec/score-compose) (Docker Compose) and [score-helm](https://github.com/score-spec/score-helm) (Helm), among others.

If you want a world with lower cognitive load on developers, less config drift or mismanagement, [check out the repo](https://github.com/score-spec/spec), contribute and reach out. This is just the beginning — let’s build the future of development together.