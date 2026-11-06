---
title: "Celebrating 2 years as CNCF Sandbox"
date: 2026-11-04T00:00:00-00:00
draft: false
description: "Score turned 2 as a CNCF Sandbox project: a stronger security posture, more adoption, a new hands-on Labspace and two more KubeCons. Next stop: Salt Lake City!"
image: celebrating-2-years-as-cncf-sandbox.jpg
author: mathieu-benoit
---

🎉 Score turned 2 as a [CNCF Sandbox](https://www.cncf.io/projects/score/) project this past July! 🎉

On July, 2024, [Score joined the CNCF](https://score.dev/blog/score-joins-the-cncf-as-a-sandbox-project/) and last year, we [celebrated our first anniversary](https://score.dev/blog/celebrating-1-year-as-cncf-sandbox/). Time still flies, and this second year was packed with great moments, with the same takeaway: Score only goes as far as its community takes it. Thank you to every contributor, user, speaker and maintainer who helped along the way. 💙

Our mission hasn't changed:

> Score is loved by developers because they can run the same workload on completely different technology stacks, without needing to be an expert in any one of them.

Here is a look back at what we accomplished over the last 12 months.

## 🚀 More adoption, in the real world

The best sign that Score's mission resonates is seeing others build on it.

**Engine** shared how their Infrastructure team uses Score as the service specification layer of a production Kubernetes platform: a single `score.yaml` per service, about 13 custom provisioners, `score-k8s` running inside an ArgoCD plugin, and 25+ Kubernetes resources generated from a file the developer barely has to think about. What used to take days now takes minutes. They also hit a limitation, and instead of working around it they contributed the fix upstream ([score-k8s#232](https://github.com/score-spec/score-k8s/pull/232)), which is a perfect illustration of what we love about open source. Read the full story: [How Engine Built a Self-Service Kubernetes Platform with Score](https://score.dev/blog/engine-self-service-kubernetes-platform-with-score/).

**KodeKloud** took Score to **KubeCon India 2026** with the talk "The Death of the YAML-Engineer". [Mumshad Mannambeth and Abhinav Sharma](https://score.dev/blog/score-at-kubecon-india-2026/) showed how Score's provisioners can generate Crossplane resources, so that developers get a database by writing a 20-line `score.yaml` and zero infrastructure YAML. A pipeline runs once, a control plane runs forever! They even published the demo as a hands-on lab, so you can replay it yourself.

And Score keeps showing up next to other CNCF projects, which is one of the things we enjoy the most:
- **Microcks**: Score and Microcks to unify the inner and outer loops, with a [talk at KubeCon EU](https://score.dev/blog/score-at-kubecon-eu-2026-in-amsterdam/).
- **Radius**: the new experimental [`score-radius`](https://github.com/score-spec/score-radius) implementation, demoed during a Radius community meeting.
- **OpenChoreo**: a conversation, and an experimental implementation, are on the way.
- **Docker Model Runner**: `score-compose` now natively supports it, to deploy workloads with local LLM models.

## 🤝 Community spotlight: ordered container start

If one feature illustrates what this community can do together, it's **ordered container start**: the new `before` property in the Score Specification.

Many workloads need some setup before the main container can run: a schema migration to complete, static data to generate, a shared state to initialize. This is the well-known "init container" and "sidecar" pattern, and until now there was no platform-agnostic way to express it in a Score file. Now there is:

{{< highlight yaml >}}
apiVersion: score.dev/v1b1
metadata:
  name: myapp
containers:
  db-migrate:
    image: migrate/migrate:v4
    command: ["up"]
    before:
      main:
        ready: complete
  main:
    image: myapp:latest
{{</ highlight >}}

The `db-migrate` container runs _before_ `main`, and `ready` defines when `main` can start: `started` (the default), `complete` or `healthy`. Each Score implementation then maps this to what its platform natively provides:

| `ready` | `score-compose` (Docker Compose) | `score-k8s` (Kubernetes) |
|---|---|---|
| `started` | `depends_on` with `service_started` | sidecar `initContainers` entry (`restartPolicy: Always`) |
| `complete` | `depends_on` with `service_completed_successfully` | regular `initContainers` entry |
| `healthy` | `depends_on` with `service_healthy` (with a warning if no probe is defined) | rejected with a validation error, since init containers can't be gated on health |

Both implementations also validate the workload at generation time, to catch containers referencing themselves, unknown containers and cyclic dependencies.

What makes this feature special is that **it took the whole community to ship it**:

- [**Chris**](https://github.com/chris-stephenson), one of the Score Maintainers, [proposed the idea](https://github.com/score-spec/spec/issues/104) back in September 2024. He also reviewed the pull requests, including the feedback that led to a simpler design.
- [**kai-kystverket**](https://github.com/kai-kystverket) took the idea and implemented it in the Score Specification: [spec#136](https://github.com/score-spec/spec/pull/136).
- [**Mathieu**](https://github.com/mathieu-benoit) laid the foundation in the shared Go library with [score-go#121](https://github.com/score-spec/score-go/pull/121), so that the implementations could start building on it before the Specification was even released.
- [**Abhishek**](https://github.com/Abhishek9639) did the heavy lifting afterwards: he [refactored the `before` field from an array to a per-container mapping](https://github.com/score-spec/spec/pull/186) (and fixed the schema validation that wasn't kicking in), integrated it in [score-go#178](https://github.com/score-spec/score-go/pull/178), and then implemented the feature in both [`score-compose`](https://github.com/score-spec/score-compose/pull/454) and [`score-k8s`](https://github.com/score-spec/score-k8s/pull/294).
- [**Matthieu**](https://github.com/lekaf974) spotted that the generated types in `score-go` were broken and fixed the `ContainerBefore` structure and the `ready` conditions with [score-go#222](https://github.com/score-spec/score-go/pull/222).

Five contributors, four Score repositories and about two years from the initial idea to the implementation in both Docker Compose and Kubernetes: that's open source at its best.

### And it goes beyond Score

The story doesn't stop there. When Docker Compose [shipped native init containers](https://github.com/docker/compose/pull/13862) with `pre_start`, [**Abhishek**](https://github.com/Abhishek9639) opened [a feature request](https://github.com/score-spec/score-compose/issues/522) for `score-compose` to leverage it, with a detailed analysis of which Score init containers could be converted. The feedback shared with Docker Compose maintainer [Guillaume Lours](https://github.com/glours) directly influenced the Compose implementation itself: the limitations Score contributors identified, such as hooks not being able to set their own `command` or volumes, were addressed on the Compose side, with hooks now supporting the full container specification. A great example of Score contributors not only building on top of OSS projects, but also helping shape them. The work is still in progress, and you're welcome to join the conversation!

Huge kudos to all of you! 🙌

## 🔮 The path to V1

As we hit 2 years as a Sandbox project, it's really about time we got to `v1` of the spec (yes, we're still on `v1b1`!)  [**Chris**](https://github.com/chris-stephenson) has been gathering requirements since the start of the year for our discussion of what a `v1` of the spec would look like. You can still contribute your ideas in the community Doc [here](https://docs.google.com/document/d/19qkncxA2pduyAwgjfAl-lQs4hEhjhAm0yrXxy-5u8dg/edit). The biggest thing is to make Score compatible with the Kubernetes Custom Resource schema, opening up interesting use-cases of "Score Operators". We also heard the feedback from the community that out "implementation" approach is not very reusable, so we're rebuilding the score-go library to allow for better code-reuse and importing your favourite score implementations as packages in Go!

## 🔒 A stronger security posture

As a CNCF project, we want to demonstrate security best practices by default. Thanks to the [CNCF and Docker partnership](https://www.cncf.io/announcements/2025/09/18/cncf-expands-infrastructure-support-for-project-maintainers-through-partnership-with-docker/), Score was onboarded into the [Docker-Sponsored Open Source Program](https://score.dev/blog/docker-sponsored-open-source-program/), and the results speak for themselves:
- **Docker Scout** on every pull request and in our registry, with CVE, package and policy comparisons between `main` and each PR.
- **Docker Hardened Images** as base images for our containers: minimal, non-root, with SBOMs and SLSA provenance, and a very smooth migration.
- **`docker/github-builder`** to build our container images, with signed SLSA provenance.
- **OIDC connections** for Docker Hub, replacing long-lived tokens with short-lived ones.
- Our container images now live on [Docker Hub](https://hub.docker.com/u/scorespec), with insights on how they are actually used.

The full journey, with before/after snippets you can reuse in your own projects, is in the [dedicated blog post](https://score.dev/blog/docker-sponsored-open-source-program/).

## 🧪 Learn Score hands-on with the Labspace

"I get the idea behind Score, but I'd like to try it before setting everything up." We heard that feedback many times, so we recently released the [**Score Labspace**](https://score.dev/blog/score-labspace/): a guided lab where the instructions and a ready-to-use terminal live side by side, with all the tools already installed. All you need is Docker:

{{< highlight shell >}}
docker compose -f oci://scorespec/score-labspace:latest up
{{</ highlight >}}

In seven short modules, you write one `score.yaml` and deploy it **twice**, with `score-compose` and `score-k8s`, without changing a single line. Then you go further with patch templates and provisioners. It's open source and open to contributions at [score-spec/score-labspace](https://github.com/score-spec/score-labspace).

## 🎤 Two more KubeCons

Since our last anniversary, we have been at two more KubeCons as a CNCF Sandbox project:
- [**KubeCon NA 2025 in Atlanta**](https://score.dev/blog/score-at-kubecon-na-2025-in-atlanta/): a talk about Score and Kro at Cloud Native Rejekts, the Maintainer Summit and our Project Pavilion kiosk.
- [**KubeCon EU 2026 in Amsterdam**](https://score.dev/blog/score-at-kubecon-eu-2026-in-amsterdam/): the Maintainer Summit, the Score + Microcks talk, our kiosk and an update from TAG DevEx.

Each of these was a great opportunity to meet users, answer questions and hear what you would like to see next. Many of the ideas in this post started as a conversation in front of the kiosk.

## 📍 Next stop: KubeCon NA in Salt Lake City

We are going back to where it all started: our first KubeCon as a CNCF Sandbox project was [in Salt Lake City in 2024](https://score.dev/blog/score-at-kubecon-na-in-slc/), and **next week** we are back there for [KubeCon + CloudNativeCon North America 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/) (November 9-12) for our fifth!

Come and meet the Score Maintainers at our kiosk, we will demo the new Labspace live:
- 📍 **Where:** Kiosk **P-17B**, Project Pavilion, Hall 5 (Cosmic Canyon), Level 1, Salt Palace Convention Center
- 🕒 **When:** Thursday, November 12, 10:15 AM - 2:00 PM

Bring your questions, run the lab with us and tell us what you would like to see in Score's third year.

## Upwards

On behalf of the Score Maintainers and the entire Score community, thank you for an amazing second year. Whether you opened an issue, sent a pull request, wrote a blog post, gave a talk or simply gave Score a try, you shaped what it is today.

Can't wait to see what the community will bring to the Score project in year 3!

- [Join the #score channel in the CNCF Slack](https://cloud-native.slack.com/archives/C07DN0D1UCW)
- [Get started with Score](https://docs.score.dev/docs/get-started/) or [try the Labspace](https://github.com/score-spec/score-labspace)
- [Contribute to Score](https://clotributor.dev/search?foundation=cncf&project=score)

See you in Salt Lake City! Let's Score it! 🎶
