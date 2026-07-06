---
title: "Score at KubeCon India 2026: The Invisible Platform"
date: 2026-07-04T00:00:00-00:00
draft: false
description: "How we used Score's provisioner system to generate Crossplane XRs - and demoed a platform where developers deploy apps with databases without writing a single line of infrastructure YAML."
image: hero.png
author: abhinav-sharma
---

At KubeCon India 2026, [Mumshad Mannambeth](https://www.linkedin.com/in/mmumshad/) and [I (Abhinav Sharma)](https://www.linkedin.com/in/abhinavsharma0/) gave a talk called "The Death of the YAML-Engineer." The title was provocative on purpose. We weren't announcing a job elimination - we were arguing for a promotion.

The average developer deploying to Kubernetes today spends more time on infrastructure YAML than on their application. Helm charts, Terraform modules, Ingress annotations, NetworkPolicy rules, node selectors - none of it is what they signed up to build. Platform engineering exists to solve this. But too often, "solving it" means handing the developer a slightly shorter pile of YAML and calling it an abstraction.

We wanted to show something different. A developer writes a workload spec - no infra knowledge required - and the platform delivers everything beneath it. A platform so well-designed, it disappears.

## Two Tools, One Story

We built the demo around two CNCF projects that rarely appear on the same slide: Score and Crossplane.

[Score](https://score.dev) is a workload specification language. A developer writes a `score.yaml` describing what their service needs - container image, port, "I need a database" - without specifying where or how that database runs. Score's CLI translates that spec into platform-specific Kubernetes manifests.

[Crossplane](https://crossplane.io) is a universal control plane. Platform engineers define Compositions that map abstract resource types to real infrastructure - a PostgreSQL StatefulSet running in-cluster for demos, an RDS instance in production, a CloudSQL instance on GCP. Crossplane reconciles declared state continuously. If something drifts, it brings it back.

Together they draw a clean boundary. Developers own the Score spec. Platform engineers own the Crossplane Compositions. Neither side needs to understand the other's internals.

## The Bridge: Score Provisioners

The piece that makes this work is Score's [provisioner system](https://docs.score.dev/docs/score-k8s/custom-provisioners/). A provisioner is a template the platform team configures once, mapping abstract Score resource types to real Kubernetes manifests.

In our demo, when a developer declares they need a `postgres` database in their Score spec, the provisioner doesn't just resolve the hostname and credentials. It generates a `DatabaseInstance` custom resource - a Crossplane Composite Resource - as part of the output manifest. The developer never writes a single line of Crossplane YAML. The provisioner does it silently, as part of `score-k8s generate`.

This is the insight we wanted the audience to walk away with: Score's provisioner system isn't just a variable resolver. It's an infrastructure generator. Pair it with Crossplane, and you get a platform where the developer's workflow is completely decoupled from how infrastructure is actually delivered.

## The Demo

The demo had two acts.

**Act 1** started with the platform already set up. Crossplane was running in the cluster. A `DatabaseInstance` Composite Resource Definition was established. The Composition was deployed. Attendees could verify all of it in about three `kubectl` commands - and then we told them: this is the platform engineer's world. Developers never touch this.

The developer - played by one of us - opened a single `score.yaml`. Twenty lines. Container image, port, and one resource declaration: "I need a postgres database." No hostname. No password. No cloud provider. Just intent.

Running `score-k8s generate` produced two Kubernetes resources: a `Deployment` for the app, and a `DatabaseInstance` XR for Crossplane to reconcile. The developer wrote zero infrastructure YAML, yet Crossplane now had everything it needed to provision a real PostgreSQL instance - StatefulSet, Service, and connection Secret - all named and wired correctly.

A single `kubectl apply` later, the app was running and connected to the database. The audience could see `note-taker-postgres` resolved as the hostname in the app's health endpoint - a value the developer never typed.

**Act 2** was the guarantee. We deleted the StatefulSet. Directly. While the app was live.

Crossplane detected the drift in under 30 seconds and recreated it automatically. No command was run. No alert fired. The `DatabaseInstance`'s `SYNCED` status never changed - because the desired state never changed. The control plane quietly brought reality back in line with it.

The line that got the biggest reaction from the audience: *"A pipeline runs once. A control plane runs forever."*

## Watch the Talk

{{< iframe src="https://www.youtube.com/embed/JEWSboHLuQc?si=3cyoGQIb-iyv05RF" >}}

## Beyond the Demo

The pattern scales. The developer's `score.yaml` doesn't change when you move from an in-cluster PostgreSQL to RDS, CloudSQL, or anything else - you swap the Crossplane Composition. The provisioner maps the same Score resource type to a different XR shape. The developer is never involved.

This is what "invisible platform" actually means. Not that infrastructure disappears, but that the developer no longer needs to think about it. The platform engineer is promoted from YAML author to infrastructure architect - writing Compositions and provisioners that encode years of operational knowledge into an API that any developer can use in twenty lines.

## Try It Yourself

We've published the full demo as an interactive lab on KodeKloud. You get a real cluster with Crossplane pre-installed, and you follow the same steps we ran on stage.

[**Try the KodeKloud lab →**](https://kode.wiki/3QQi2rZ)

---

- Get started with [score-k8s](https://github.com/score-spec/score-k8s)
- Learn about [custom provisioners](https://docs.score.dev/docs/score-k8s/custom-provisioners/)
- Crossplane documentation: [crossplane.io](https://crossplane.io)
- Join the conversation in [#score on CNCF Slack](https://communityinviter.com/apps/cloud-native/cncf)
