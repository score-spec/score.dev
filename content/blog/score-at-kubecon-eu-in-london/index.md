---
title: Score at KubeCon EU in London
date: 2025-02-24T00:00:00-00:00
draft: false
description: Join us at KubeCon EU 2025 in London!
image: Score at KubeCon in LDN - Score.png
author: mathieu-benoit
---
After [KubeCon NA in Salt Lake City in 2024](https://score.dev/blog/score-at-kubecon-na-in-slc/), Score will be very well represented for its second KubeCon as CNCF Sandbox project in London.

This year’s updates and community achievements mark an exciting milestone, and we’re eager to connect with the cloud-native community to showcase how Score is evolving.

Here are four opportunities to hear more about Score and meet with maintainers and contributors at this year’s KubeCon EU in London in April 2025.

## Opportunity #1 - Lightning Talk: Intro to Score

[Project Lightning Talk: You Can Score It! Shift Down to the Platform. Do Not Shift Left to the Developers](https://sched.co/1tcwp).

**Tuesday April 1st, 2025 16:07-16:12 BST.**

Developer Experience (DevX) is a key concept in Platform Engineering and in the cloud native ecosystem. Its primary goal is to empower developers, allowing them to focus on their code and generate business value rather than dealing with Kubernetes and infrastructure complexities.

Thanks to the Open Container Initiative (OCI) standard, the rise of cloud native runtimes has revolutionized how teams build and deploy applications. Developers leverage the same containerized approach from their local development workflows to remote environments. But this still exposes some inherent complexities. What is the right level of abstraction? How to reduce the cognitive load? How to shift down to the platform rather than shift left to the developers?

Let’s see in action how we answer these questions with Score, an open-source workload specification that enables developers to deploy their workloads across a spectrum of runtime platforms like Docker Compose, Kubernetes and more.

## Opportunity #2 - Talk: Dapr + Score

[Dapr + Score: Mixing the Perfect Cocktail for an Enhanced Developer Experience](https://sched.co/1txGi).

**Wednesday April 2nd, 2025 11:15-11:45 BST.**

Developer Experience (DevEx) is an important concept in Platform Engineering and in the cloud native space, advocating for self-service and reduced cognitive load. Its primary goal is to empower developers, allowing them to focus on coding rather than fighting with infrastructure intricacies. What is the right level of abstraction? Which type of tooling is essential? How can teams identify the concepts and workflows that drive value and success?
Tools such as Dapr and Score are being used in innovative ways to make a wider range of developers more productive. On one hand, they allow the Developers to be abstracted from underlying infrastructure and dependencies. On the other hand, Platform Engineers can easily configure the building blocks and associated infrastructure, seamlessly for the Developers.
This talk demonstrates a practical blueprint between Dapr and Score, where you will see how to deploy any Dapr containerized workloads defined by Score, to Docker Compose or Kubernetes.

## Opportunity #3 - Kiosk: Meet Score maintainers

**Thursday April 3rd, 2025 10:30-13:30 BST.**

Score will have a dedicated **Kiosk 2A** provided by the CNCF (thank you!) in the Project Pavilion on Thursday morning. Please visit this Kiosk to meet with Score maintainers. We will answer all your questions and will show live demos.

## Opportunity #4 - Contribfest: Contribute to Score

[Contribfest: Enhancing Your Developers Experience With Score](https://sched.co/1tczO). 

**Thursday April 3rd, 2025 14:15-15:30 BST.**

Join us to contribute to Score! In this session, we will guide you through how you can contribute to either the docs (in Markdown), the source code of `score-go` library (in Go) or the two CLIs implementations: `score-compose` and `score-k8s` (in Go).
Attendees who would like to fix bugs and implement new features can pair program with maintainers to directly contribute and have impact to the Score project. We will also guide anyone who would like to write their own provisioners to provision external dependencies with OpenTofu, Crossplane, etc.

## Projects updates & Community highlights

Score projects got some updates in the last few months, since last KubeCon NA 2024:
- The [`spec`](https://github.com/score-spec/spec/releases) got two new features: `containerProbe` type `exec` for command execution, `binaryContent` for inline Score `files`.
- [`score-compose`](https://github.com/score-spec/score-compose/releases), in addition to some bugs fixed and the integration of the new `spec` version, got a new `mssql` provisioners by default and now supports the new `score-compose provisioners list` command.
- [`score-k8s`](https://github.com/score-spec/score-k8s/releases), in addition to some bugs fixed and the integration of the new `spec` version, got a new `s3` provisioners by default.
- Overall the Score projects got their [CLOMonitor score](https://clomonitor.io/projects/cncf/score) significantly improved to be more compliant with best practices and standards as CNCF project.

Interested in contributing and being part of the Score community as a contributor? Check out the [list of good first issues on GitHub](https://clotributor.dev/search?foundation=cncf&project=score) to get started!

Here are some examples of what the community has been sharing recently:
- New examples with the `cmd` provisioner type have been shared in the [library of provisioners](https://github.com/score-spec/community-provisioners) shared by the community (load `.env` with `python` and provision `redis` with `helm`).
- A [new `score-flyio` implementation](https://score.dev/blog/community-spotlight-score-flyio/) developed by the community that deploys Score files to the Fly.io container platform.
- A [new blog post illustrating how Score can help the Platform Engineerings to abstract and standardize features of their Platform](https://itnext.io/whos-really-responsible-for-an-internal-developer-platform-5dce5f2a0401). And how it could greatly simplify the day-2 operations.
- A [new blog post in Portuguese](https://www.linkedin.com/pulse/descomplicando-o-score-cncf-clecio-antao-nyt3f/) showcasing both `score-compose` and `score-k8s` in actions.
- Score was invited during the ["You Choose!" Ch. 05 / Ep. 05 - Specialized Templating - Feat. Porter, Werf, Radius, Score, PipeCD](https://youtu.be/TEZVeWsirsw)

For those looking to dive deeper into Score, our CNCF Slack channel and our monthly Community Calls offer a collaborative space to explore the latest updates, discuss challenges, and connect with other users. Stay informed by [visiting our community page](https://docs.score.dev/docs/community/) and signing up for the calls.

Can't wait to attend KubeCon London and see where this edition will bring the Score project!

See you there!?
