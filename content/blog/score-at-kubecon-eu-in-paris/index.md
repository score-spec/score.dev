---
title: Score at KubeCon EU in Paris
date: 2024-03-18T00:00:00-00:00
draft: false
description: Amidst the flurry of KubeCon preparations, we’ve been working on some exciting updates for Score. Learn more about our latest developments on Project Melody and drop by at our booth to say hi in Paris!
image: 65f8463ea7dc6825efb4fc15_Score at KubeCon in Paris - Score-p-800.jpg
author: susa-tunker
---

As KubeCon 2024 is starting, we’re getting ready to meet in Paris. We're excited to dive into discussions about the latest Score developments, so join us to connect and explore what's in store for Score at KubeCon. Humanitec, a key supporter of the Score project, is  proud sponsor of [Platform Engineering Day](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/co-located-events/platform-engineering-day/), taking place on Tuesday. Additionally, you'll have the chance to meet some of the project's contributors at booth D35.

## Score updates: Let’s talk at KubeCon

We’re excited about the talks, discussions and learnings awaiting us at KubeCon this year. Catching up with familiar faces from the community is something we’re really looking forward to. It’ll be great to take discussions on topics such as developer experience and platform maturity offline and hash ideas out in person.

Of course, we’re also eager to discuss Score. These past few months have been exciting for the project. We’ve [submitted Score to the CNCF sandbox](https://github.com/cncf/sandbox/issues/79) (fingers crossed!) and made significant progress with [Project Melody](https://score.dev/blog/project-melody) - an initiative aimed to enhance the user experience with Score’s implementation CLIs, making implementation, adoption, usage and customization much more intuitive and smoother. 

As you gear up for KubeCon, we want to make sure you’re up to date with our latest developments on the initiative. So, we thought we’d give you a sneak peek at what we’ve been working on.

## Introducing score-compose 2.0 with Project Melody

[Project Melody](https://score.dev/blog/project-melody) aims to make Score highly accessible by default, sparing developers from having to deal with intricate configurations, while still allowing for customization in more advanced scenarios.

In response to feedback received on our [score-compose](https://github.com/score-spec/score-compose) reference implementation, we’ve focused on improving the resource management experience. While defining dependencies like databases in the [Score Spec](https://github.com/score-spec/spec) is straightforward, configuring them to run with score-compose has required additional manual steps. In light of this, we're rolling out a series of improvements to [score-compose](https://github.com/score-spec/score-compose), where the heavy lifting is handled directly within the CLI.

As we prepare to roll out a range of new functionalities, we wanted to provide you with a preview of the changes coming your way.

### Say hello to init & generate

We’re excited to introduce the `init` and `generate` subcommands to the [score-compose](https://github.com/score-spec/score-compose) CLI. While we've tidied up a few bugs and implemented improvements from our backlog, these two main bits of new functionality are the stars of the show.

* **Init**: The `init` subcommand makes it significantly easier to get started with [score-compose](https://github.com/score-spec/score-compose), preparing the current directory and any necessary local files or configurations needed to get your workload running. It also generates a default score.yaml file to help you get started.
* **Generate**: With the `generate` command, Score files in the your [score-compose](https://github.com/score-spec/score-compose) project are converted into a consolidated Docker compose manifest. This includes resolving and provisioning all resources and links between workloads as needed.

Check out the quick demo below to see these two subcommands in action. In this example, we’ll be working with a Score file, which defines a dependency on a Postgres database and a Redis cache:


{{< highlight yaml >}}
# Specification reference: https://docs.score.dev/docs/reference/score-spec-reference/
---
apiVersion: score.dev/v1b1
metadata:
  name: example
containers:
  hello-world:
    image: nginx:latest
    variables:
      EXAMPLE_VARIABLE: "example-value"
      volumes:
        - source: ${resources.one}
          target: /foo
service:
  ports:
    www:
      port: 8080
      targetPort: 80
resources:
  one:
    type: volume
  two:
    type: redis
{{</ highlight >}}
‍

Now, [score-compose](https://github.com/score-spec/score-compose) can generate resources without developers needing to configure their own resource definitions or determine desired outputs manually:

{{< iframe src="https://www.loom.com/embed/8524876286ca40da96a077a9b1a56deb?sid=ad8ca1ef-fc8b-4bcd-ae3f-b873c5b8ea71" >}}

In addition to Postgres and volume, we’re planning to support resource types such as Redis, DNS, and route, with additional options planned for the future. And you can customize and extend with your own project, team, or organization-specific resource types from day one. Stay tuned for the upcoming release of this functionality, and we're excited for your feedback!

## Join us at booth D35

If you're attending KubeCon this year, don't hesitate to stop by our booth D35 in the exhibit hall. We'd love to discuss the latest developments with you and provide a walkthrough of the project's recent changes. Connecting with fellow members of the community is always a pleasure, and we’re excited to meet you at the event.

À bientôt à KubeCon Paris!

PS: If you aren’t attending KubeCon this year, we’ll be available in the [#score channel on the CNCF Slack](https://slack.cncf.io) to answer any questions. We are always open to chatting during our [monthly community meeting](https://github.com/score-spec/spec?tab=readme-ov-file#-get-in-touch).