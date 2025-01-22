---
title: "Community spotlight on score-flyio"
date: 2025-01-21T00:00:00-00:00
draft: false
description: "Learn about a new Score implementation developed by the community that deploys to the Fly.io container platform. This is the first cloud-based runtime with stateful resource provisioning and is a great example for other platforms."
image: title-image-with-text.jpeg
author: ben-meier
---

The Score workload specification provides value by allowing cloud-native developers to define their applications using a simplified workload configuration and use a variety of Score implementations to deploy the application to a target environment without needing full understanding of the runtime themselves. Each Score implementation provides a mechanism for converting the workload specification into their target structure and provisioning outputs for each resource consumed by the workload. [Fly.io](https://fly.io/) is the latest container platform to have a brand new community-provided Score implementation in [astromechza/score-flyio](https://github.com/astromechza/score-flyio)!

In this post, we'll demonstrate how to deploy with `score-flyio` without needing to understand the ins and outs of Fly.

## Intro to Fly.io

[Fly.io](https://fly.io/) is a lightweight container application platform that provides hardware-virtualized containers on a fast and modern Fly Machines API. Fly applications (apps) are deployed using the `fly` command line interface (CLI) which converts a local Toml file into running Fly Machines. The syntax is defined [here](https://fly.io/docs/reference/configuration/) and defines the core features of a container workload:

- A Docker image repo and tag or a local Dockerfile that will be built at deploy time
- Optional overrides for the container entrypoint and command
- Environment variables to expose to the running image
- A definition of TCP, UDP, or HTTP ports to map and expose on the app network
- Health checks
- CPU and memory, mounted volumes, mounted files etc.
- Application-scoped secrets

Notable, Fly also supports managed and semi-managed cloud services that we can take advantage of in resource provisioners: self-managed Postgres app templates, managed Postgres by Supabase, managed Object Storage, etc.

This is ideal for a Score implementation! Notably there are also some parts of the Score implementation that Fly cannot support just yet, for example multiple containers, but as long as we receive appropriate error messages for these cases, that's ok. `score-flyio` works by converting each Score workload file into a Toml file, provisioning resources using either `cmd` or `http` provisioners, and exporting any secrets into the Fly app.

![a flow diagram showing the interactions of score-flyio](score-flyio-flow.svg)

## Setting up a new project

First, we need a Fly.io account to deploy against. We can sign up and use the personal organization with a Pay-as-you-go-plan.

Then, we can install the `score-flyio` CLI from the [latest release](https://github.com/astromechza/score-flyio) on GitHub. For this demo, we'll extract the `score-flyio` binary from `score-flyio_1.2.1_darwin_arm64.tar.gz` and move it to `/usr/local/bin/`.

{{< highlight shell >}}
$ score-flyio --version
score-flyio version 1.2.1
{{</ highlight >}}

We'll then setup a default Fly region and an API token for our project to use. In this case, we'll deploy to the London region, and use an short lived API token for our personal org. We need an organization scoped token, because we may use resource provisioners that deploy their own Fly apps.

{{< highlight shell >}}
$ export FLY_REGION_NAME=lhr
$ export FLY_API_TOKEN=$(fly tokens create org -x '24h' -o personal)
{{</ highlight >}}

We start our project with the `init` command and namespace our apps under a demo prefix since Fly apps must be globally unique:

{{< highlight shell >}}
$ score-flyio init --fly-app-prefix "score-blog-"
{{</ highlight >}}

## The Score file

We'll be deploying a simple [demo application](https://github.com/astromechza/demo-app) consisting of a webserver that shows various properties of the requests it receives and connects to a Postgres database to demonstrate that it can.

This the content of our `score.yaml` file:

{{< highlight yaml >}}
apiVersion: score.dev/v1b1
metadata:
  name: demo-app
  annotations:
    score-flyio.astromechza.github.com/service-web-handlers: "tls,http"
containers:
  main:
    image: ghcr.io/astromechza/demo-app:latest
    variables:
      OVERRIDE_POSTGRES: postgres://${resources.db.username}:${resources.db.password}@${resources.db.host}:${resources.db.port}/${resources.db.database}
    resources:
      requests:
        cpu: "1"
        memory: "128M"
service:
  ports:
    web:
      port: 443
      targetPort: 8080
resources:
  db:
    type: postgres
{{</ highlight >}}
 
Notice the `score-flyio` specific annotation we've added to the workload. Fly can load balance and provide TLS for us in the Fly Proxy layer in front of our app, and this annotation helps relay the handlers configuration through to the final manifest.

We can add this to our project in the usual way:

{{< highlight shell >}}
$ score-flyio generate score.yaml
2025-01-21 12:49:43 INFO Added score file to project file="score.yaml"
2025-01-21 12:49:43 INFO Primed resources #workloads="1" #resources="1"
2025-01-21 12:49:43 INFO Persisted state file
Error: failed to provision resources: failed to find a provisioner for 'postgres.default#demo-app.db'
{{</ highlight >}}

## Provisioning Postgres

Unfortunately, we got an expected error indicating that there's no provisioner configured for the `postgres` resource type. `score-flyio` doesn't install any provisioners by default, and you can confirm this with a subcommand:

{{< highlight shell >}}
$ score-flyio provisioners list
<nothing>
{{</ highlight >}}

We have some choices here, we could setup a Postgres manually and set up the outputs as a "static" json provisioner, we could write a script and set it as a "cmd" provisioners, but in this case we're going to use a Postgres provisioner that is built into `score-flyio` itself!

{{< highlight shell >}}
$ score-flyio provisioners add flypg postgres \
    --cmd-binary=score-flyio \
    --cmd-args='builtin-provisioners,postgres,$SCORE_PROVISIONER_MODE'
{{</ highlight >}}

This defines a "cmd" provisioner named "flypg" for resource type "postgres" that calls the `score-flyio` binary with the arguments `builtin-provisioners postgres (provision|deprovision)`.

This provisioner will use our `FLY_REGION_NAME` and `FLY_API_TOKEN` variables to launch a [self-managed Postgres](https://fly.io/docs/postgres/).

We can run `generate` again, and the logs will confirm that a Postgres app has been set up.

{{< highlight shell >}}
$ score-flyio generate score.yaml
...
2025-01-21 12:59:33 INFO [demo-app.db] Provisioning new postgres app app="score-blog-pg-20250121125928"
automatically selected personal organization: Ben
Creating postgres cluster in organization personal
...
Machine 68306e7c7527e8 is created
...
Postgres cluster score-blog-pg-20250121125928 created
...
  Connection string: postgres://postgres:095fe1b3d616a8062b30@score-blog-pg-20250121125928.flycast:5432
...
2025-01-21 13:00:11 INFO Provisioned resource uid="postgres.default#demo-app.db"
...
2025-01-21 13:00:11 WARN App contains secrets which must be imported before deployment. Either specify --deploy to have score-flyio do this for you, or use --secrets-file to output the secrets app="score-blog-demo-app" #secrets="1
{{</ highlight >}}

So in about 28 seconds, we got a new single-node Postgres instance with a database for our app. We can see this running in the Fly user interface:

![screenshot of Fly console showing a single app named score-blog-pg-20250121125928 with a Postgres logo](fly-pg-app.png)

The secrets, in this case the Postgres instance and database passwords, have been stored in the `.score-flyio/state.yaml` file locally which should be backed up and restored for any serious CI pipeline. As the warning suggests, the secret environment variables for the app must be imported into Fly for deployment. We'll use the `--deploy` flag in the next step.

## Deploying our app

We can see how the Score workload has been converted into a Toml file:

{{< highlight toml >}}
app = "score-blog-demo-app"

[build]
  image = "ghcr.io/astromechza/demo-app:latest"

[[services]]
  internal_port = 8080
  min_machines_running = 0
  protocol = "tcp"

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

[vm]
  cpus = 1
  memory = "256MB"
{{</ highlight >}}

Note that Fly only allocates unit CPUs and memory in chunks of 256MB, so our memory request has been rounded up. Also note that the `OVERRIDE_POSTGRES` variable is not in this manifest, since we will be installing it as an application secret during deploy.

We can deploy our app using the Fly CLI or by using the `--deploy` flag after `generate`. This will call the `fly` CLI behavior and automatically allocate a shared public IPv4 address, DNS, and two Machines running the container.

{{< highlight shell >}}
$ score-flyio generate score.yaml --deploy
...
Provisioning ips for score-blog-demo-app
  Dedicated ipv6: 2a09:8280:1::60:b993:0
  Shared ipv4: 66.241.125.123
 ...
No machines in group app, launching a new machine
Creating a second machine to increase service availability
Finished launching new machines
...
Visit your newly deployed app at https://score-blog-demo-app.fly.dev/
...
{{</ highlight >}}

Now we can view the running app in the browser, complete with TLS, DNS, routing and all!

![screenshot of demo-app web page](web-browser.png)

Notice how the "Database table count result" shows a successful value of `0`. This is correct since our Postgres database was just created and is empty! If we watch the page for a few seconds, we can see the background colour change as it refreshes and sends the request to the other replica Machine which has chosen a different random background colour.

Expanding "Show details" shows more aspects of the request, response, and runtime environment of the container. We can see our `OVERRIDE_POSTGRES` environment variable, along with the `FLY_*` variables, and confirmation that we're running with 1 CPU and 256MB memory.

The Fly console also shows us the two Machines running our container and we can view the metrics of the running app.

![screenshot of Fly console showing two Machines](fly-machines.png)

We can view the imported secrets too:

![screenshot of Fly console showing a pending app with a single OVERRIDE_POSTGRES secret](fly-app-secrets.png)

## Onwards and upwards

We can do a number of things now to improve our Fly-deployed Score workload:

- Add Score `readinessProbes` to the container. These will be converted into Fly [checks](https://fly.io/docs/reference/configuration/#http_service-checks) to help route traffic towards and away from failing replicas.
- Use the Fly CLI to scale the app into other regions and avoid downtime when the `lhr` region is down using `fly scale count 1 --region ord --app score-blog-demo-app`.
- Enable auto-stop and auto-start on the web app. We can do this by adding the `score-flyio.astromechza.github.com/service-web-auto-stop: "stop"` annotation to the Score workload before conversion. This will enable auto-start and auto-stop.
- Connect to, backup, or perform other administration on the Postgres instance with `fly postgres --app score-blog-pg-20250121125928`.

Once we're done with the Postgres database and demo app, we can deprovision the resource...

{{< highlight shell >}}
$ score-flyio resources list
uid                          source_workload provisioner
postgres.default#demo-app.db demo-app        flypg

$ score-flyio resources deprovision postgres.default#demo-app.db
time=2025-01-21T14:38:20.026Z level=INFO msg="Deprovisioning postgres since this was the last database"
{{</ highlight >}}

And then delete the demo app:

{{< highlight shell >}}
$ fly apps list
NAME               	OWNER   	STATUS  	LATEST DEPLOY
score-blog-demo-app	personal	deployed	25m47s ago

$  fly apps destroy score-blog-demo-app
Destroyed app score-blog-demo-app
{{</ highlight >}}

## Onwards

In this post we successfully demonstrated how to convert a Score workload into a Fly web app that can be deployed and accessed over the internet. We showed how `score-flyio` provisions real infrastructure to satisfy the `postgres` resource type. And we've shown how to enhance and expand the application after deployment. We've also shown how the application developer themselves did not need to read or understand how the Fly platform works itself or how to configure the app or database, but could stick to the standard Score workload specification for testing and deployment.

Try out [`score-flyio`](https://github.com/astromechza/score-flyio) for yourself. For those already familiar with Score, we hope this provides some inspiration for what can be accomplished with community driven Score implementations or even bespoke tools in your own platform. If you're interested in building a new implementation, check out the new template repository for Go: [/github.com/score-spec/score-implementation-sample](https://github.com/score-spec/score-implementation-sample).

For everything else—see you in the #score channel on [CNCF Slack](https://communityinviter.com/apps/cloud-native/cncf)!
