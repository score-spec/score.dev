---
title: Why Score
heading: Why Score?
layout: why-score
---

Cloud-native developers often struggle with configuration inconsistencies between environments. This gets even more complicated when the technology stack in each environment is different. What if you use Docker Compose for local development but Helm Charts to deploy to the Kubernetes based development environment? Not only do you have to figure out Docker Compose and Helm, but you need to keep them in sync.

Infrastructure centric development leads to developers having to stay on top of the tech and tools of every environment their applications run in. This often results in bottlenecks across the delivery cycle. Ensuring that a configuration change made locally is reflected appropriately in a remote environment and vice versa might end up being an intricate, multi-stakeholder endeavour.

We believe that developers shouldn’t have to fight a symphony orchestra of tech and tooling when preparing their code for its journey towards production. Instead, we advocate for a workload centric approach to software development. This means that the platform or tools of the target environment are responsible for satisfying the workload runtime requirements rather than the other way around.

The Score specification was developed against a set of workload centric development principles:

{{< icon-paragraph icon="svg/flag.svg" >}}
**Establish a single source of truth for workload configuration** that serves as the main point of reference on how to run a workload, independently of target platform and environment. This allows to generate one directional configuration and combine it with environment specific parameters in the target environment.
{{< /icon-paragraph >}}

{{< icon-paragraph icon="svg/key_visualizer.svg" >}}
**Provide a tightly scoped workload spec** that shields developers from the configurational complexity of container orchestrators and tooling. By exposing only core workload constructs, developers can keep their focus.
{{< /icon-paragraph >}}

{{< icon-paragraph icon="svg/manage_history.svg" >}}
**Implement a declarative approach for infrastructure management** that allows developers to describe a workload’s resource dependancies without having to worry by whom, when, and how it will be provisioned in the target environment.
{{< /icon-paragraph >}}

Score enforces these principles by providing a platform agnostic specification that allows developers to describe their workload runtime requirements in an accessible and declarative way. This definition can be interpreted by the target environment and used as a baseline for injecting any environment-specific parameters.

Advocating for a workload-centric (over an infra-centric) approach are we not only hoping to remove bottlenecks and speed up delivery for teams, but also to bring back joy and flow into developers’ day to day.
