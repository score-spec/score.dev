---
title: "Warning: config drift causes a painful death for developers"
date: 2022-12-07T00:00:00-00:00
draft: false
description: Most dev teams struggle with inconsistent configuration and a lack of transparency. Open source project Score tackles these problems.
image: 638dfd62e43516169a74d4cc_Warning_ config drift causes a painful death for developers1-p-800.png
author: susa-tunker
---

The year is 2353. Alien archeologists are combing through ancient Slack logs to better understand the day-to-day of humans before their civilization collapsed. A surprisingly recurring conversation they find among members of so-called “dev teams”:

**Member A**: “Pushed my code change 🎉”

**Member B**: “Mmh... I think something broke”

**Member A**: “Wait.. but it worked on my machine?!”

{{< figure src="638dfd94248daa4fa07cf31c_meme.png" >}}

When I first saw Docker a few years ago, it felt like magic. Finally I could just build a container and push it to any environment without a worry. Life is good. Or is it? Turns out, to get a container from local, to dev and finally to prod you need an intricate, multistakeholder process that relies on handmade YAMLs, organic scripting and fair trade git-based workflows. Deploying container management systems such as Kubernetes went from entry level to beat-the-final-boss complexity pretty quickly.

Why? Mainly, because developers need to deal with different tech stacks across different environments. If you ever made the transition from a `docker-compose.yaml` for local environments to a `chart.yaml` for cloud environments, you know what I’m talking about. The likelihood that someone will get it right the first time is very low. And why should every developer be an expert in Helm or Kustomize anyway? Their job is to code and ship new features, not to be a configuration wizard.

So what happens in practice? The most experienced backend engineer on the team (usually a pretty valuable resource) needs to step in to help get the new or updated services running in the cloud environment. Less experienced developers wait, senior engineers do “shadow ops,” overall productivity and innovation drops.

The reality of most dev teams is scattered configuration and a lack of standardization and transparency. There’s no default separation of concerns, nor a workload- and developer-centric approach to deployments. 

We have seen this over and over at engineering organizations of all sizes and that’s why we decided to create and open source [Score](https://score.dev/). It’s a developer-centric, platform-agnostic workload specification that eliminates configuration inconsistencies between environments. 

Why Score? In music, score is the musical notation that tells a musician whichnotes to play on their instrument. It also tells the conductor at a glance what each musician in an orchestra should be playing. It provides the foundation for everyone to play together in harmony. Similarly, the `score.yaml` specification makes developers the conductors of a workload that is run across an orchestra of technology and tools.

One YAML to rule them all. 

Specify environment-agnostic workload configs once, deploy everywhere. Hopefully a way out of the scripting jungle many teams find themselves in today. 

You might say, “Wait, we already have our config YAML to rule our deployments.” But a different spec for each team or organization is also not a good idea. There are endless ways you can configure such standard templates, based on your own tech stack or individual team’s needs. So every company reinvents the wheel time and again, which can be very frustrating for developers. Every time you switch jobs, you need to learn new conventions from scratch. We need something that is shared and reusable.

That’s why we believe it’s time for a developer-centric workload spec that can work on any platform. As Score gains mindshare, it has the potential to set a useful standard for all dev teams, once and for all. To be clear, this is far from done. What we are sharing with you here is an idea, an alpha implementation and an invitation to contribute to make this happen.

## (S)core Principles

What we observed is that developers struggle to manage differences between how their local and remote environments are set up. If entities are configured differently across platforms, the risk of workload config drift increases. For example: A workload with a dependency on a database might point to a Postgres image or mock server in lower environments. On its way to production, however, a database has to be provisioned and allocated via Terraform. Such “translation gaps” between environments exist for all kinds of items — volumes, external services (Vault or RabbitMQ), ports, DNS records or routes, etc.

We believe that developers shouldn't fight with tooling and advocate for a workload-centric approach to development.

What you really want is ensuring that platforms meet workload requirements rather than the other way around. The platform a workload is deployed to is responsible for satisfying its runtime requirements as specified by the developer. It’s workload-centric and developer-centric.

This means:

* **Having a single source of truth for workload configuration**: Independent of the platform and environment the workload is running on, Score serves as the main reference to understand a workload's runtime requirements. Engineers no longer need to compare platform files to each other. 
* **Keeping a tight scope on the workload spec**: Score shields developers from the configurational complexity of container orchestration tooling. 
* **Declarative approach for dependency management**: Developers declare what their workload needs to run including infrastructure dependencies without having to worry by whom, when and how the resources will be provisioned in the target environment.

Based on these principles, we developed the idea of a platform- gnostic workload specification. It’s a single declarative file that’s easy to understand and captures what a workload needs to run.

{{< figure src="637217b89ebb811f4012bd40_how-score-works.png"  >}}

* The **Score specification** is a developer-centric workload definition that lets engineers describe what the workload needs to run, independently of the environment. The `score.yaml` file is the single source of truth of a workload’s requirements and dependencies. It can be deployed with any container orchestration platform or tools.
* The **Score implementation CLI** is a CLI tool that the Score specification can be executed against. It is tied to a specific type of platform, such as Docker Compose ([score-compose](https://github.com/score-spec/score-compose)) or Helm ([score-helm](https://github.com/score-spec/score-helm)). The CLI will take care of generating a platform-specific config file (such as `docker-compose.yaml`, `chart.yaml`), based on the Score spec.
* The **platform-specific configuration file** is the result of combining the `score.yaml` with the implementation CLI. As an example, running the Score spec against [score-compose](https://github.com/score-spec/score-compose), the platform-specific config file `docker-compose.yaml` will be generated. This file can be combined with environment-specific parameters to run the workload in the target environment.

With Score, the same workload can be run on completely different stacks without engineers having to worry about implementation details or needing to master all the required config files. The same Score specification can be used to generate a `docker-compose.yaml` file for local development, Kubernetes manifests for deployment to a shared development environment or to a serverless platform such as Google Cloud Run.

## Join us to make Score the new standard

As mentioned, we are early. There’s a lot more work to be done both on the [Score spec](https://docs.score.dev/docs/reference/score-spec-reference/) and especially the CLI implementations. So far, we released [score-compose](https://github.com/score-spec/score-compose) (Docker Compose) and [score-helm](https://github.com/score-spec/score-helm) (Helm), among others.

If you want a world with lower cognitive load on developers, less config drift or mismanagement, and frankly just more productive, happier days for all of us, go  [check out the repo](https://github.com/score-spec/spec), contribute, reach out. This is just the beginning, I’d love to build the future of development together.