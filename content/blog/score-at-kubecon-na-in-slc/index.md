---
title: Score at KubeCon NA 2024 in Salt Lake City
date: 2024-11-04T00:00:00-00:00
draft: false
description: Explore Score's recent updates, industry recognitions, and top community contributions. Join us at KubeCon NA in Salt Lake City to see what’s new and meet the Score team!
image: score-at-kubecon-na-in-slc.png
author: mathieu-benoit
---
As a [CNCF Sandbox project](https://www.cncf.io/projects/score/), Score is thrilled to join KubeCon North America 2024 in Salt Lake City. This year’s updates and community achievements mark an exciting milestone, and we’re eager to connect with the cloud-native community to showcase how Score is evolving. Here’s everything you can expect from Score at this year’s KubeCon NA!

## What’s new with Score?

[Since becoming a CNCF Sandbox project](https://score.dev/blog/score-joins-the-cncf-as-a-sandbox-project/), the Score community has been hard at work introducing new functionalities and improvements across our core tools such as, **`score-go`**, **`score-compose`** and **`score-k8s`**. Here’s a summary of some of the standout updates:
- Import external provisioners files (git, http(s) and OCI image) with the new `--provisioners` flag for both **`score-compose`** and **`score-k8s`**. This makes it easy to author and share Score provisioning templates amongst your teams.

- Alongside some improvements with latest container images versions and stronger security context enforcement in some provisioners, new resource types were added in the default provisioners: `mssql`, `amqp`, `mongodb`. See the complete list [here](https://docs.score.dev/docs/score-implementation/score-compose/resources-provisioners/) and [here](https://docs.score.dev/docs/score-implementation/score-k8s/resources-provisioners/). Do you want to write your own provisioners, check out our [blog post showing you how to write your own provisioner](https://score.dev/blog/writing-a-custom-score-compose-provisioner-for-apache-kafka/).
- Based on the feedback from end users, **`score-compose`** got more updates like subpath support for Docker Volumes, improvement of healthcheck retries, better dependency handling `--depends-on` and the new `--publish port` option.
- More consistency between the two projects: **`score-compose`** and **`score-k8s`**: CLI commands validation enhancements, more content in [docs.score.dev](https://docs.score.dev/) and improvements in CI tests to embrace more contributions.

In addition to **`score-compose`** and **`score-k8s`**, do you want to write your own Score implementation? We got you covered with this recent addition of the [Score Sample implementation project](https://github.com/score-spec/score-implementation-sample) that you can use as a template to get started!

These improvements align with Score’s mission to streamline the application lifecycle and optimize the cloud-native experience. Check out the detailed release notes on GitHub: [**`score-compose`**](https://github.com/score-spec/score-compose) and [**`score-k8s`**](https://github.com/score-spec/score-k8s) for more on each update.

## Recognition in Thoughtworks Technology Radar

Score’s continued growth and impact on the cloud-native space were recognized in the latest [Thoughtworks Technology Radar](https://www.thoughtworks.com/en-de/radar/languages-and-frameworks/score), highlighting Score as a valuable tool for cloud-native development. This mention underscores Score’s role in simplifying complex workflows and fostering efficient collaboration between developers and platform teams.

## Community highlights and contributor spotlights

Our community’s contributions are the heartbeat of Score’s development. In just three months the different [Score repositories in GitHub](https://github.com/score-spec) got [12 new contributors](https://score.devstats.cncf.io/d/52/new-contributors-table?orgId=1). These contributors make up our thriving Score community. We appreciate their dedication and are always welcoming new members to the team.

Here are some of the incredible achievements from our new contributors that are helping to drive Score forward.

- The [new OCI image import support for provisioners](https://github.com/score-spec/score-compose/issues/178) implemented in **`score-go`** ([score-go#48](https://github.com/score-spec/score-go/pull/48) and [score-go#59](https://github.com/score-spec/score-go/pull/59)), is now available in both **`score-compose`** and **`score-k8s`**. This allows to import complementary provisioners in addition to the default ones with the init command:

{{< highlight yaml >}}
score-compose init --provisioners oci://ghcr.io/score-spec/score-compose-community-provisioners:v0.1.0#00-redis-dapr-state-store.provisioners.yaml

score-k8s init --provisioners oci://ghcr.io/score-spec/score-k8s-community-provisioners:v0.1.0#00-redis-dapr-state-store.provisioners.yaml
{{</ highlight >}}

Score is now a [proud ORAS adopter](https://oras.land/adopters/).

- With the addition of the `mongodb` ([score-k8s#23](https://github.com/score-spec/score-k8s/pull/23)), `mssql` ([score-k8s#73](https://github.com/score-spec/score-k8s/pull/73)), `amqp` ([score-k8s#28](https://github.com/score-spec/score-k8s/pull/28)) and `service-port` ([score-k8s#70](https://github.com/score-spec/score-k8s/pull/70)) resource types in the default provisioners, the following Score file can now be used out of the box with both `score-compose generate` and `score-k8s generate`.

{{< highlight yaml >}}
apiVersion: score.dev/v1b1
metadata:
  name: makeline-service
containers:
  makeline-service:
    image: ghcr.io/azure-samples/aks-store-demo/makeline-service:1.5.2
    variables:
      ORDER_QUEUE_URI: "amqp://${resources.orders-queue.host}:${resources.orders-queue.port}"
      ORDER_QUEUE_USERNAME: "${resources.orders-queue.username}"
      ORDER_QUEUE_PASSWORD: "${resources.orders-queue.password}"
      ORDER_QUEUE_NAME: "orders"
      ORDER_DB_URI: "${resources.orders-database.connection}"
      ORDER_DB_NAME: "orderdb"
      ORDER_DB_COLLECTION_NAME: "orders"
service:
  ports:
    http:
      port: 3001
      targetPort: 3001
resources:
  orders-queue:
    type: amqp
    id: orders-queue # This is shared with the other workloads.
  orders-database:
    type: mongodb
{{</ highlight >}}

_This Score file is illustrated as part of [this blog post](https://itnext.io/what-if-the-azure-samples-aks-store-demo-was-using-score-655c55f1c3dd) to see this in action._

Interested in contributing and being part of the Score community as a contributor? Check out the list of [good first issues on GitHub](https://clotributor.dev/search?foundation=cncf&project=score) to get started!

## Additional resources from the community

Score’s influence extends beyond code contributions. Here are some resources created by our community members:
- **Blog Post**: [What if the Azure-Samples/AKS-Store-Demo was Using Score?](https://itnext.io/what-if-the-azure-samples-aks-store-demo-was-using-score-655c55f1c3dd) This article demonstrates how Score can be used by this popular microservices sample project.
- **YouTube**: [Check out ChatLoopBackOff - Episode 23](https://www.youtube.com/watch?v=BRiZ0t6MYNo&list=PLj6h78yzYM2PnyOsrsCbR_kqjCKfPObHK&index=22), featuring a deep dive into Score and its use cases.
- **Microsoft Learn**: [Improve the Developer Experience from Your Platform with Score](https://learn.microsoft.com/en-us/shows/open-at-microsoft/improve-the-developers-experience-from-your-platform-with-score), a guide on enhancing developer productivity with Score in platform engineering.

## Join Us at KubeCon NA 2024 in Salt Lake City!

KubeCon is a unique opportunity to connect with the Score team, and we invite you to visit the Humanitec booth #S36 to see demos, brainstorm ideas, and ask questions. 

I will also be presenting at [**Cloud Native Rejekts**](https://cfp.cloud-native.rejekts.io/cloud-native-rejekts-na-salt-lake-city-2024/schedule/) on November 11th with his talk, [You Can Score It! Shift Down to the Platform. Do Not Shift Left to the Developers](https://cfp.cloud-native.rejekts.io/cloud-native-rejekts-na-salt-lake-city-2024/talk/WHR8SY/). This talk will cover how platform engineering can leverage Score to streamline responsibilities, focusing on shifting down to platform teams rather than shifting left to developers.

For those looking to dive deeper into Score, our CNCF Slack channel and our monthly **Community Calls** offer a collaborative space to explore the latest updates, discuss challenges, and connect with other users. Stay informed by [visiting our community page](https://docs.score.dev/docs/community/) and signing up for the calls.

## Stay connected with Score

Keep up with all things Score on our [official blog](https://score.dev/blog/), where we share project updates, tips, and success stories. Don’t miss out on the latest community insights and meetups, and be sure to stop by our booth #S36 at KubeCon NA in Salt Lake City!
