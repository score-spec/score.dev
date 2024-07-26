---
title: Why we advocate for workload-centric over infrastructure-centric development
date: 2022-11-22T00:00:00-00:00
draft: false
description: Score envisions a developer and workload-centric approach to improve developer productivity and experience. In this article, we take a deeper look at the “why” and see this as a starting point to discuss and shape a product vision we can work towards as a community.
image: 637c87d258294866631dd42b_Why we advocate for workload-centric over infrastructure-centric development_1-p-800.png
author: susa-tunker
---

This article is meant to be a starting point for sharing observations, experiences and ideas to begin and build a conversation, exchange experiences, discuss and shape a product vision we can work towards as a community.

Our initial product vision and definition reads as follows:

> *“Score is an open source project that provides a developer-centric and platform-agnostic workload specification to improve developer productivity and experience. It eliminates configuration inconsistencies between local and remote environments.”*

A lot of words, I know - stick with me now as we take a step back to understand why and how we got here. We’ll keep referring to the terms I just mentioned, so that at the end you’ll be able to paint the full picture and we can understand what Score stands for together.

## Infrastructure centric development: the enemy is complexity

Above we talk about *“configuration inconsistencies between local and remote environments”*. To understand what we mean by that do we have to understand infrastructure centric development - The source of all evil.

In an infrastructure centric workflow, developers are concerned with the platforms and tooling their workloads run on. Locally, this will be a light weight tool such as Docker Compose. So far so good. Remotely however, you’ll likely be confronted with tooling such as Helm, Kustomize, Terraform, Argo CD [or similar](https://landscape.cncf.io/). Developers having to promote their workload from their local set up to production environments that rely on a different set of tech and tools will run into issues surrounding:

* Environment specific configuration: your workload might have many environment variables configured - some of which are environment specific, others or which should remain unchanged. For complex applications it is often not clear if `CPX_API_KEY` or `SRD_MEM_CAP` should be updated for the test environment. What if you miss the update of `DBURL` and it is pointing at the development database?
* Platform specific configuration: a workload with a dependency on a database might point to a postgres Docker image or mock server in lower environments. On its way to production however, a database has to be provisioned and allocated via Terraform. How to you ensure that everything is configured and provisioned correctly?

The fact that production environments require specialised knowledge and operational expertise increases the risk of wrongly specified or inconsistent configuration. The question of how things are reflected appropriately between environments is answered differently in teams: There might be a few super helpful people that end up being the “go-to people” for helping others get unstuck. There might be a page on the internal wiki site explaining how to get help or a full blown ticketing system to track and route requests. The course of action also depends on the complexity of the task at hand. A variable change is easier to manage than satisfying a dependency on a database across various environments.

## Workload centric development: compartmentalizing complexity

Above we say that Score attempts to *“improve developer productivity and experience.”* To understand what we mean by that do we have to understand workload centric development - The solution to all of your problems.

By embracing a workload centric approach to software development, developers no longer have to worry about environment specific implementation details when promoting their workloads towards production. In a workload centric world, developers declare what their workload requires to run successfully, independently of platform or environment. For example: “My workload has one container, should be made available on a TCP port and relies on a postgres database”. The image pull secret? The TCP port number? The exact number of replicas? The provisioning and allocation of the database? The platform in the target environment is responsible for answering these questions and ensuring that everything is configured and injected accordingly. This offers the potential of a reality in which developers can focus on local development without having to worry about different configuration constructs, rules and values in remote environments.

Workload centric development allows developers to focus on their workload’s architecture rather than the tech stack in the target environment. It establishes a clear contract between dev and ops: The operations team is provided with a comprehensive set of configurational requirements, which - if met - ensure that the workload runs as intended. Code is passed through the fence, rather than being thrown over it.

## Score principles

Quick recap. So far, we talked about the issue of developers struggling with *“configuration inconsistencies between local and remote environments.”* and how *“to improve developer productivity and experience”* in this context. We’ll now look at how Score attempts to put this into practice by providing *“a developer-centric and platform-agnostic workload specification”.*

A while ago, the team behind Score sat together and formulated a set of workload centric development principles based on which the Score specification was eventually developed:

* Establish a single source of truth for workload configuration that served as a main point of reference for development teams when wanting to understand a workloads runtime requirement and allows to apply changes in a one directional and standardised manner. To qualify as a SSOT, it has to be platform agnostic - meaning it’s not tied to an orchestrator, platform, tool such as Kubernetes, Google Cloud Run or Nomad - and environment agnostic - meaning it captures the configuration that should be the same across environments.
* Provide a tightly scoped workload spec that shields developers from the configurational complexity of container orchestrators and tooling. Container orchestration systems such as Kubernetes provide a massive number of options that can be configured just for a workload. Developers may find it challenging to understand which properties are needed, optional or can be disregarded. By keeping a tightly scoped workload spec that only exposes core application constructs developers can keep their focus.
* Implement a declarative approach for infrastructure management that allows developers to describe a workload’s resource dependencies without having to worry by whom, when, and how it will be provisioned in the target environment.

The Score specification was directly derived from these principles. Looking at our opening statement of it being “developer-centric” and “platform-agnostic” we can now even add to the list of words without sounding overwhelming: “environment-agnostic”, “declarative”, “tightly scoped”. A less wordy explanation offers the name itself. The Score specification, just like the musical notation, makes developers the conductor of their workload, which is deployed across an orchestra of tech and tools.

## How is it implemented?

Our story doesn’t end with the Score specification. Its counterpart is the Score implementation, a CLI tool which the Score specification file (`score.yaml`) is executed against. It is tied to a platform such as Docker Compose ([score-compose](https://github.com/score-spec/score-compose)) or Helm ([score-helm](https://github.com/score-spec/score-helm)) and allows to generate a platform-specific configuration file such as `docker-compose.yaml` or a helm `values.yaml` file.

With Score, the developers workflow stays largely uninterrupted. The `score.yaml` file is saved alongside the source code and generates the required configuration with a single command.

In the example below, the developer simply executes score-compose to generate a `compose.yaml` file and spins up the container locally via Docker Compose. Hello World!

{{< figure src="637ca027bcac191361d1dee3_Score-Code-Snippet-22nov22.gif" >}}

The same `score.yaml` file is then used to generate a helm `values.yaml` file for a remote development environment running on Kubernetes.

Check out our current suite of available CLI tools [here](https://github.com/score-spec/spec#-installation).

## Spread the word

Score wants to make developers lives easier by allowing them focus on developing features instead of fighting with infrastructure. It simplifies the promotion of workloads from local to remote development environments by automating repetitive configuration work.

We’re curious to hear: What experienced did you make working with complex microservice applications? Do you have an idea on how to improve the Score specification? Or would you like to support us in building the next generation of Score implementations? Get involved [here](https://github.com/score-spec/spec#-get-involved) and join the [#score channel](https://slack.cncf.io)!