---
title: How is Score different from other tools?
date: 2022-12-16T00:00:00-00:00
draft: false
description: In this article, we answer your questions about how Score compares to other tools in the space, specifically Kompose, HashiCorp Waypoint and Kubevela.
image: 639c35ad31267de2a963e2a2_How is Score different from other tools_-p-800.png
author: susa-tunker
---

After the release of Score in early November 2022, we received a lot of questions, feedback and ideas from you: the continuously growing Score community! We’re excited to keep the discussion going and are looking forward to collecting further insights and user feedback.

In this article, we answer your questions about how Score compares to other tools in the space, specifically Kompose, HashiCorp Waypoint and [Kubevela](https://platformengineering.org/platform-tooling/kubevela).

Before we dive in, let’s set the scene: We’ve already shared [what Score is](https://score.dev/blog/score-one-yaml-to-rule-them-all) and [examples of how it works](https://score.dev/blog/get-started-with-score-docker-compose-to-helm). Now, to understand how it compares to other tools and allow you to paint the full picture here, it might be helpful to first understand what Score is not.

## What Score is not

Score is a declarative workload specification. It is not a:

* **Configuration management tool for environments**: It is not recommended to store configuration values and secrets directly in `score.yaml`. Instead, items such as configuration maps or secrets and vaults are declared as a [workload dependency](https://docs.score.dev/docs/dependencies/) in your Score file. These can then be resolved by means of the target runtime.
* **Resource and environment management tool**: Score won’t manage your resources and environments as it is the case for tools such as Terraform or Internal Developer Platforms built around a [Platform Orchestrator](https://humanitec.com/blog/what-is-a-platform-orchestrator) like Humanitec. It won’t spin up or purge physical resources or services defined in `score.yaml`.
* **Deployment tool**: It does not support you with deploying or promoting workloads across environments.

Score will seamlessly integrate with the tech and tools you already have in place for configuration, resource, environment and deployment management. It does not intend to replace any part of your tech stack but instead allows developers to feed in required workload configuration parameters via Score Implementation CLIs in an automated and accessible way.

## Tooling comparison

Below we provide a high level overview of how Score compares to conversion tools such as [Kompose](https://kompose.io/) as well as CD platforms such as [HashiCorp Waypoint](https://www.waypointproject.io/) and [Kubevela](https://kubevela.io/).

### How is Score different from Kompose?

With [Kompose](https://kompose.io/), developers translate their Docker Compose files into Kubernetes, Helm or OpenShift resources. While the tool shares its translation element with Score, there are some differences to point out:

* **Use case**: Kompose provides you with an initial skeleton, a foundation, to explore and iterate from. Score on the other hand assumes you already established a build and deployment workflow. For example: Kompose allows you to generate a Helm chart from your Docker Compose file. Score expects that chart to already be set up and maintained by an ops engineer or team. This is why the [score-helm](https://github.com/score-spec/score-helm) implementation simply generates a `values.yaml` file that can be passed into an existing chart. While Kompose is focused on helping teams get started when migrating to Kubernetes, Helm or OpenShift, Score is the foundation of a scalable approach to configuration management including a clear separation of concerns when it comes to ops owned configuration (i.e. Helm charts) and developer owned configuration (i.e. `values.yaml` for their workload).‍
* **Scope**: Kompose aims to generate as complete and deployment-ready resources as possible. For Docker Compose properties that can’t be mapped to Kubernetes artefacts, Kompose offers custom labels to get you as close as possible to a complete manifest file. In contrast, Score does not aim to be a fully featured YAML replacement for the target runtime's configuration format. Instead, it enables developers to merge their workload configuration into existing platform- and infrastructure set ups in an automated and accessible way (via Score Implementation CLIs).‍
* **Approach**: The Score Specification is platform-agnostic, meaning it lives above the tech and tools that a workload eventually runs on. It is not tied to a platform such as Docker or Kubernetes - as is the case for Kompose. With Score, you can freely migrate between tech stacks. Due to its platform agnosticism does `score.yaml` also establish a single source of truth on a workloads runtime requirements, a shared point of reference for all developer personas in a team (Dev, Ops, QA, SRE etc.) when it comes to managing a workload’s configuration that doesn’t require any platform- or tooling specific expertise.

### How is Score different from HashiCorp Waypoint?

Waypoint, similarly to Score, enables developers to publish any application to any platform with a single declarative file (`waypoint.hcl`). Looking at its use case, scope and approach, there are some differences to take into account when trying to understand which tool fits your use case best:

* **Use Case**: Waypoint is an application release orchestrator, a tool for continuous delivery that allows you to define end to end workflows, including build, deploy and release steps for your application. This includes features for team collaboration, operation history and deployment logs for example. Waypoint aims to provide a PaaS-like experience and thereby differs in scope compared to Score. Score simply provides a workload spec. It’s uninvolved in the applications build, deploy or release process and assumes that you already have existing tooling in place for that.
* **Scope**: The plugins provided by Waypoint take care of deploying whatever is specified in the `waypoint.hcl` file to the desired target platform. To deploy your application to Kubernetes for example, Waypoint will create a build from the supplied image, deploy to Kubernetes and expose it on a specified port. If your use case requires more than a `deployment.yaml` and `service.yaml` file, additional properties can be defined as part of the spec or the generated manifest file can be modified before deployment. On the other hand, Score takes your existing set up into account. It assumes you have advanced infrastructure configuration in place, which the developers workload configuration (generated by Score) can be combined with. Compared to Waypoint, Score does not necessarily aim to provide deployment ready configuration files as explained.
* **Approach**: Waypoint offers a variety of plugins (e.g. Kubernetes, Helm, ECS, Nomad) which can be referenced in the `waypoint.hcl` spec. For example, to deploy to Docker, you would have to specify something like `use:Docker` and similarly for Kubernetes `use:Kubernetes` (including a few properties such as load balancer and port). Score follows a different approach: The same `score.yaml` file can be reused by multiple Score implementation CLIs ([score-compose](https://github.com/score-spec/score-compose), [score-helm](https://github.com/score-spec/score-helm), score-…) without the developer having to make any adjustments to it. This is because not all properties defined in the Score spec are necessarily picked up by all implementations. Each CLI only processes the items relevant in its context.

That being said, there are a couple of open questions such as: How does Waypoint deal with configuration management across environments? How does it manage resource and service dependencies? How suitable is Waypoint for production environments? We’ll be exploring these questions as part of a separate blog post soon. Stay tuned!

### How is Score different from the Open Application Model (OAM) and Kubevela?

The [Open Application Model (OAM)](https://oam.dev/) and Score share a similar philosophy. Both advocate for developer-focused and application-centric development. Similar to Score, OAM enables cloud native developers to describe their applications using a single, easy-to-understand and portable specification file. Differences lie in use case and approach. Looking at Kubevela (the implementation of OAM) this becomes evident:

* **Use Case**: Kubevela is a continuous delivery tool that provides full application deployment and management capabilities with a PaaS like experience. Its spec describes applications components, policies, workflow steps and more. Score on the other hand only describes your workload. It assumes you already have tools for rendering, orchestrating and managing your applications in place.
* **Approach**: Score leaves it up to the platform (team) on how the workload's runtime requirements described in `score.yaml` are resolved in the target environment. Taking the example of a postgres database dependency: You might have a mock server, a Terraform script, an internal developer platform or even a manual workflow in place to provision and allocate the required resource. While certain approaches are more recommendable than others, Score is uninvolved in this part of the delivery cycle. Kubevela on the other hand includes the platform side of things in the form of OAM definitions. These are types of applications (e.g. web service) that ops defines and developers can reference in their spec. If selected, the definition expands into all the resources that are required for the type of application and Kubevela automatically creates the according deployment.

We’re currently working on a blog article that explores the tools differences in more detail to help you understand which one is more suitable for your use case. Watch the [Score Blog](https://score.dev/blog) for updates.

We hope this was helpful and answered your questions! If you would like to comment on any of the above named items or suggest a tool you’d like us to explore in comparison to Score, let us know via our [community Slack](https://join.slack.com/t/scorecommunity/shared_invite/zt-1i2glkqkl-EnjSWSCgYUyaEGwmDYBZZQ) or create a topic in our recently launched [discussion forum](https://github.com/score-spec/spec/discussions).