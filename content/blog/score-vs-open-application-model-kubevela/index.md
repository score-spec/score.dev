---
title: "How is Score different to the Open Application Model and Kubevela?"
date: 2022-12-23T00:00:00-00:00
draft: false
description: "Some of you have asked if Score takes a similar approach to the Open Application Model (OAM) and Kubevela. In this blog post we will try to shed some light on the similarities and differences."
image: 63a5d2a7a0422b5a0d896f23_Score vs. Kubevela-p-800.png
author: fernando-villalba
---

This article will explain some key differences between the Open Application Model (OAM) and Score to help you decide which will make more sense for you.

## Workload-centric vs. application-centric

Score was developed to provide a developer-centric and platform-agnostic workload specification to improve developer productivity and experience: It ensures consistent configurations between local and remote environments. Score is loved by developers because they can run the same workload on completely different technology stacks without needing to be an expert in any one of them.

After its launch, we received questions about how Score is different from the Open Application Model (OAM) and Kubevela. In this article, we will dive deeper into it.

Score is a [workload specification](https://docs.score.dev/docs/reference/score-spec-reference/) that can be translated to a number of container platforms (such as Kubernetes or Docker Compose) via Score Implementation CLIs (such as [score-helm](https://github.com/score-spec/score-helm) or [score-compose](https://github.com/score-spec/score-compose)). Score sees workloads and their resource dependencies as the fundamental deployment unit for developers.

Score does not describe how the workload is implemented by the destination platform, as it is declarative. This means it does not prescribe how resource dependencies are provisioned and configuration is retrieved in the target environment.

The OAM (Open Application Model) is a model focused on the concept of applications. These applications are composed of programmable modules, such as components, traits, policies, deployment workflows, etc. Each component corresponds to a workload or resource, depending on the type defined. OAM offers a few core workload definitions, or you can create your own with [CUE](https://cuelang.org/docs/tutorials/).

This makes OAM a lot more feature rich and extensible when it comes to describing particular types of applications, but it also makes it a requirement that Kubernetes is equipped with a Kubernetes CRD controller that can understand these custom resources.

## Local vs. remote development

Developers often use lightweight tooling such as Docker Compose for local development as it comes with little operational overhead. 

With Score, developers can translate their Score spec to Docker Compose for local development and to Kubernetes (Helm) or similar for remote production environments without risking configuration inconsistencies.

This is a use case that OAM doesn’t seem to support as it relies on Kubernetes. For your local environments, you would need to provision a local cluster with something like [Kind](https://kind.sigs.k8s.io/) and ensure all the components that are on the remote cluster are also found in your local environment.

## Workload management

Score is designed to [deploy individual workloads](https://score.dev/blog/workload-centric-over-infrastructure-centric-development). Dependencies between these workloads can be explicitly [defined as resources within the spec](https://docs.score.dev/docs/dependencies/), but the spec is not designed to describe and deploy multiple workloads in one spec.

Compared to this, OAM allows you to define multiple workloads in one spec, although it isn’t [recommended](https://kubevela.io/docs/getting-started/core-concept#an-abstraction-to-model-application-deployment-process) by Kubevela:

> *“As we will regard an application as a microservice unit, the best practice is to control one application only has one core service for frequent development, other components within this application can be dependencies such as database, cache or other middleware/cloud services, the maximum number of components within an application should under ~15.”*

In this sense, OAM gives you additional flexibility to define your applications while Score is opinionated to keep your workloads as simple as possible by defining a single workload and everything else as a dependent resource.

## OAM vs. Score implementation

Kubevela is the only OAM implementation at the writing of this article. It works in Kubernetes by installing a [Kubernetes CRD controller](https://kubevela.io/docs/platform-engineers/system-operation/high-availability#kubevela-core-controller) that enables you to define applications. 

Score, on the other hand, doesn’t need any component running in the destination platform, and it won’t create additional CRDs. Implementations of the Score spec are purely command line interfaces (CLI) that translate workloads to platform primitives (for example, deployments in Kubernetes via Helm or services in Docker Compose).

That’s not to say that future implementations will not also include CRDs that allow you to provision resources or configuration, that’s largely dependent on future community requirements. 

## Resource provisioning

With OAM, you can define resources as workload types and add them to your application as components. These resources are extensible via add-ons in Kubevela, and you can create your own. You can also define how these components will be deployed in the context of your application with policies.

Score allows you to declare resource dependencies, but it will not create these resources for you. It is up to the Score Implementation to resolve resource dependencies by name, type, or any other meta information available in the Score Specification file in a way that it can be consumed by the platform in the target environment.

## Simplicity vs. feature-rich

Kubevela and OAM is far more feature rich than Score as it covers an additional set of use cases. This is great if you are looking for a continuous deployment platform to render, orchestrate, deploy and manage your applications. From a developer's point of view, Score’s simplicity makes YAML files smaller and introduces only a minimal change to your existing setup.

## Personas

Both OAM and Score reflect a separation of concerns between platform engineers and developers (end users), but the scope of management varies. 

For example, with OAM you have to define within your application spec resource username and secrets, policies where your workloads will be deployed, deployment workflows, etc. It gives a lot more features for a developer to play on their end, but on the other hand, it also makes the YAML files more complex.

Score assumes that many of these decisions and implementations will be made by a platform team (or experienced developers within the team) and that they will be executed by the platform itself, not at the end of the developer’s workload spec. For example, even though you can define defaults for usernames and passwords for resources in Score, the destination platform can be configured to replace these for you based on the environment context.

## User base

OAM and Kubevela are far more mature than Score as it has been around for a few years now. It is predominantly created and [maintained](https://github.com/kubevela/kubevela/graphs/contributors) by Alibaba Cloud and it is a CNCF Sandbox project. Currently, most companies that have adopted Kubevela are [located in China](https://github.com/kubevela/community/blob/main/ADOPTERS.md).

Score is scarcely two months old as of the writing of this article but [gaining traction fast](https://score.dev/blog/score-hits-1000-stars), it has been open-sourced by a team around Humanitec.

## Conclusion

Score and the OAM/Kubevela have different focuses.

While Score aims to be a platform-agnostic workload spec to solve translation issues between different tech stacks and environments, especially local vs. remote, Kubevela/OAM aims to be a fully featured Continuous Deployment platform to render, orchestrate, deploy and manage cloud-native applications.

Do you want your teams focused on workloads and using a universal spec that can translate to both local and remote platforms like docker-compose and Helm? Then perhaps Score is your best bet.

Do you want to be able to have flexible cloud-native application definitions, are looking for a place to define application policies and CD pipeline workflows, and are willing to install a Kubernetes CRD controller to make that happen? Then perhaps OAM/Kubevela is the better choice for you.

### Contribute

Score is open source and we would welcome all contributions. You can create implementations for other platforms, contribute to the spec, or even just help us with documenting and providing additional examples. Take a look at our [repositories](https://github.com/score-spec) and get involved!

> ## The team behind Score
> The idea for Score organically formed from looking at hundreds of delivery setups, across engineering orgs of all sizes (from startups to Fortune 100). We have all been involved in platform engineering and developer tooling for the past decade, in one way or another.Some of us built Internal Developer Platforms at the likes of Google, Apple or IBM, some come from the IaC side of things and played leading roles at companies like Hashicorp. <br><br>
> We all share the vision of developer and workload-centric development. We want to reduce cognitive load on developers and make sure engineers can spend their time coding and shipping features, instead of fighting config files.