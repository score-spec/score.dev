---
title: "A new chapter for Score: Introducing our reference implementations for compose & k8s"
date: 2024-06-05T00:00:00-00:00
draft: false
description: "Explore the latest in Score development with our updated reference implementations: score-compose and score-k8s."
image: 66607a75774227e39ebddb7e_A new chapter for Score-p-800.png
author: susa-tunker
---

A year ago, we launched [Project Melody](https://score.dev/blog/project-melody), an initiative to empower Score developers. We've been hard at work making this a reality and are very excited to share the fruits of our labour! This article will provide you with an overview of our fully revamped reference implementations, [score-compose](https://github.com/score-spec/score-compose) and [score-k8s](https://github.com/score-spec/score-k8s), allowing you to experience the [Project Melody](https://score.dev/blog/project-melody) vision firsthand.

# Drumrolls for score-compose and score-k8s 🎉

Project Melody proudly presents its offspring! We are excited to officially position [score-compose](https://github.com/score-spec/score-compose) and [score-k8s](https://github.com/score-spec/score-k8s) as your go-to reference implementations. Both serve as a blueprint for working with the Score specification and best practice guide for building custom Score implementations. 

While we’ve smoothed out a few things, we’ll highlight the most important updates below:

## Introducing generate & init 

Getting started with Score is now easier than ever. We’ve introduced two new commands that streamline the setup and execution of your Score files: 

**Init**: The init command simplifies the initial setup process for Score. It prepares the current directory and any necessary local files, such as a template score.yaml file, or configurations needed to get your workload running. Previously, this work had to be done manually by the developer.

**Generate**: The generate command converts Score files in your project into the target output format. This process includes resolving and provisioning all resources and links between workloads as needed. It serves as a more robust and feature-rich replacement for the now deprecated run command.

Learn more about how these commands work in detail for [score-compose](https://github.com/score-spec/score-compose) and [score-k8s](https://github.com/score-spec/score-k8s).

## Getting started with resource provisioners

Managing resource dependencies in Score was previously a manual task left as an exercise to the team. To address this, our reference implementations now include a comprehensive resource provisioning system. This system utilises one or more YAML files to describe how to provision a set of supported resources. 

Users and teams can also supply their own provisioner files to extend this set, allowing for more centralised management of your workload’s resource dependencies. This provides a way to bake necessary resource configurations into the implementation, further reducing cognitive load for developers.

Learn more about supported resource provisioners in [score-compose](https://github.com/score-spec/score-compose) and [score-k8s](https://github.com/score-spec/score-k8s).

# Dive in & explore!

If you’re eager to dive in and explore our new reference implementations, here’s how to get started:

- **Download or upgrade your Score implementation**: Ensure you have the latest version of the [score-compose](https://github.com/score-spec/score-compose) (v0.13.2 and beyond) and [score-k8s](https://github.com/score-spec/score-k8s) (v0.1.5 and beyond) CLI installed to take full advantage of the new features.

- **Check the updated README and documentation**: Visit the [score-compose](https://github.com/score-spec/score-compose) and [score-k8s](https://github.com/score-spec/score-k8s) repositories, as well as the [developer documentation](https://docs.score.dev/docs/score-implementation/), for detailed instructions, examples, and getting started guides.

- **Get started with a sample app**: Start experimenting with our sample app by visiting [this link](https://github.com/score-spec/sample-score-app).

For those interested in our recent demos, we have the following to offer:

- **Score for developers**: If you’re a developer getting started with Score, check out the new [Score for developers](https://docs.score.dev/docs/overview/score-for-devs/) page in our documentation, including an introductory demo to [score-compose](https://github.com/score-spec/score-compose) and [score-k8s](https://github.com/score-spec/score-k8s).

- **Bridge the gap between local and remote environments in your platform**: [Our talk at this year's PlatformCon](https://platformcon.com/talks/bridging-the-gap-between-local-and-remote-environments-in-your-platform) will provide a high level intro to Score, followed by a hands-on demo showcasing [score-compose](https://github.com/score-spec/score-compose) and [score-k8s](https://github.com/score-spec/score-k8s) in action! 

- **See how Score complements other tools like Dapr in order to boost the Developers productivity**: [Another talk at PlatformCon 2024](https://platformcon.com/talks/bridging-the-gap-between-local-and-remote-environments-in-your-platform) will show you in action how to enhance the Developer Experience with these two tools.

We’re excited to hear your feedback and see how you use [score-compose](https://github.com/score-spec/score-compose) and [score-k8s](https://github.com/score-spec/score-k8s) in your projects!

# Thank you

A huge thank you to the Score community for sticking by our side and providing such helpful feedback! A special shoutout to [Ben](https://github.com/astromechza), the lead contributor on [Project Melody](https://score.dev/blog/project-melody), as well as [Andrej](https://github.com/giesan) and [Mathieu](https://github.com/mathieu-benoit), who have been supporting us with the maintenance and development of our reference implementations. Reaching this major milestone wouldn’t have been possible without all of you.