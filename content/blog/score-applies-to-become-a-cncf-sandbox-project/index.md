---
title: Score applies to become a CNCF sandbox project
date: 2024-01-31T00:00:00-00:00
draft: false
description: Exciting news! Score applied to the CNCF sandbox. Learn more about our ambitions and plans to realize Score’s potential, and don’t miss our presentation at the CNCF WG Platforms meeting.
image: 65ba1f813d3ee5bf88df9174_Score applies to become a CNCF sandbox project-p-800.jpg
author: susa-tunker
---

We’re excited to announce that Score has [applied to become a CNCF sandbox project](https://github.com/cncf/sandbox/issues/79). We see great potential in this opportunity for Score and its adoption within the community. This marks an important milestone for us as we aim to promote the concept of [workload-centric development](https://score.dev/blog/workload-centric-over-infrastructure-centric-development) among developers and platform teams. 
What is Score?

Score is a workload specification. It is saved alongside the code of a workload in source control and allows developers to define their workload’s runtime requirements. It is characterized by the following:

* **Developer-centric**: The spec simplifies workload definition for developers by exposing only common workload-level properties. Declaring runtime requirements is as easy as saying “My workload includes one container, accessible via a TCP port, and relies on a postgres database”.

* **Platform agnostic**: The Score spec is not bound to any particular platform or runtime environment. Instead, it serves as a universal spec that can be translated into various platform formats (e.g. Docker Compose, Helm, Kustomize, Google Cloud Run, etc.).

* **Environment agnostic**: Score promotes [Dynamic Configuration Management](https://humanitec.com/blog/what-is-dynamic-configuration-management) (DCM), ensuring that environment-specific configuration isn’t hard coded within the spec. For example, a database connection string such as `postgres://${postgres.username}:{postgres.password}`... is resolved in each deployment environment by injecting the required values and secrets.

Score is focused on finding the right level of abstraction for developers, effectively separating their concerns from platform and infrastructure-related complexities.

It presents a suitable standard for teams aiming to build mature platforms at scale. As a specification, Score relies on a capable platform to interpret developer requirements in a standardized and automated manner, thereby reducing cognitive load across the team. By integrating Score’s principles such as [workload-centric development](https://score.dev/blog/workload-centric-over-infrastructure-centric-development) into your platform, you can enable a smooth user experience for developers and platform engineers alike.

## Score’s journey

Score was launched in late 2022, and since then, we’ve been focused on spreading awareness and understanding which ideas and concepts resonate with developers. This led to us exploring various implementation options for Score, comparing it against other tools and specifications, and understanding its placement within the broader landscape. Currently, our focus is on improving the user experience for our two reference implementations, [score-compose](https://github.com/score-spec/score-compose) and [score-helm](https://github.com/score-spec/score-helm), along with improving documentation for building implementations that adhere to the spec. These efforts are aimed at supporting adopters in creating or customizing Score Implementation CLIs according to their requirements. 

## Score applies to the CNCF Sandbox

After confirming the need and use case for Score, we’re now ready to take the next steps and realize Score’s potential. To enable the next phase of community-driven development and adoption of Score, we’re excited to announce that we’ve [submitted it as a sandbox project](https://github.com/cncf/sandbox/issues/79) to the Cloud Native Computing Foundation (CNCF).

For us, the CNCF provides an ideal environment to explore various implementation options for Score within the landscape of container-based developer tooling. This will allow teams to easily test and integrate new tools without burdening developers with added cognitive load. Additionally, we believe the ongoing discussions within the Score community closely align with the CNCF’s focus areas, including platform maturity, optimal abstraction levels, and the integration of a 'workload spec' into the broader landscape.

## Score at the CNCF’s WG Platforms meeting

On 23rd January 2024 we joined the [TAG App Delivery's WG Platforms](https://tag-app-delivery.cncf.io/about/wg-platforms/) meeting to introduce Score and were excited about the engagement and questions from everyone. This provided us with a glimpse of the CNCF ecosystem’s potential.

You can now [watch the recording](https://www.youtube.com/watch?v=P6otOxdOKDk&t=1260s) of the meeting and [access the slides](https://docs.google.com/presentation/d/1O8m2O1WAdUQU6-wcJiwBTiO24J6PBGob3Rqc31DOZEM/edit?usp=sharing) we presented. Additionally, you can [view the list of questions](https://docs.google.com/document/d/1UXJQFFYZOXaVNQVpD2wZcd5maYWIfrMvfeM1NbqOmVA/edit?usp=sharing) that were raised.

The meeting sparked several follow-up discussions and engagements. If you have any further questions or would like to discuss anything related to Score, feel free to reach out to us in the [#score channel on the CNCF Slack](https://slack.cncf.io).