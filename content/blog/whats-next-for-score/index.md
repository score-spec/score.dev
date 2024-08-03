---
title: "What’s next for Score in 2023"
date: 2023-01-12T00:00:00-00:00
draft: false
description: 2022 was a big year for Score. Let’s highlight the community’s biggest accomplishments so far and look ahead to what is coming next. 
image: 63c1587f02019f826b4a507a_What's-next-for-2023---Score-p-800.jpg
author: susa-tunker
---

2022 was a short but eventful year for Score. After its launch in early November, [the score spec](https://github.com/score-spec/spec) repository reached 1k GitHub stars in December and 5k stars in January. What a ride! We’re overwhelmed by this response and grateful for all the contributions and feedback we received along the way. 

{{< figure src="63bfd8d41c0bdd33152fadb1_star-history-2023112.png" >}}

[The team behind Score](https://score.dev/community) took some time to reflect on the last couple of months and discuss focus items for Score in 2023.

## 2022 Review & Highlights

Let's set the scene: In the months before launching Score, we spend a lot of time discussing the philosophy behind Score as well as various solution approaches. We started with a handful of problem statements surrounding issues such as configuration drift, local configuration mismanagement, cognitive overload, knowledge silos and more. From these, we formulated an approach – [workload-centric development](https://score.dev/blog/workload-centric-over-infrastructure-centric-development) – and started deriving a solution – [platform-agnostic workload specification file](https://score.dev/blog/score-one-yaml-to-rule-them-all) – from there.

In November 2022, the Score Specification was launched alongside two example reference implementations ([score-compose](https://github.com/score-spec/score-compose) and [score-helm](https://github.com/score-spec/score-helm)). The project was still early, no question, but we were eager to get the word out and share our vision for Score with the developer community. Our focus for the first couple of weeks was to engage in discussions, validate problem and solution statements and gather user feedback.

Looking back on the year, our personal highlights of 2022 were:

### Community events

We discussed Score and our vision for workload-centric development in front of a variety of audiences. It’s been a great experience to connect with the open source community and exchange ideas. We’re grateful for everyone who took the time to get involved.

* November 8: [Score Launch](https://score.dev/blog/score-one-yaml-to-rule-them-all)
* December 2: Score at the [open source cafe](https://www.youtube.com/watch?v=ieIweao6GAE) with Kunal Kushwaha
* December 7: [Twitter Spaces on “Introducing Score: One YAML to rule them all”](https://twitter.com/i/spaces/1lPJqBDQwolxb?s=20) with over 600 listeners!
* December 13: Score fireside chat at a [platform engineers meetup](https://www.linkedin.com/events/oneyamltorulethemall-andprevent7000492721220030464/)
* December 14: Score at [Cloud Native Live](https://www.youtube.com/watch?v=2EJ3irXaXYA&t=1093s)
* December 21: We [trended on GitHub](https://twitter.com/_sujaya/status/1605568500571021312?s=20&t=SQb6ZjGTpWF0_9xBH7uNWA) for the first time

If you’re interested in joining our upcoming events, keep an eye out on our [blog](https://score.dev/blog) and the [#score channel on the CNCF Slack](https://slack.cncf.io) for updates.

### Community discussions

The future of Score depends on community input. We were excited to engage in first round of interesting (and challenging) discussions, such as:

* [Should Score support non-container workload types?](https://github.com/score-spec/spec/discussions/39)
* [What is the difference between Score and OAM (Kubevela)?](https://github.com/score-spec/spec/issues/23)
* [How is Score different from other tools?](https://score.dev/blog/how-is-score-different-from-other-tools)

You’ll find further discussion threads in the [#score channel on the CNCF Slack](https://slack.cncf.io). We’re looking forward to keeping the conversation going in 2023.

### Feature requests

Score is still new. The community provided a lot of great feedback on how we can improve the maturity of the tool. These feature requests were the most popular:

* A [JSON schema](https://github.com/score-spec/spec/issues/6) to solve the issue of [missing validation](https://github.com/score-spec/spec/issues/21) for the Score spec
* CI/CD with Score e.g. in form of a [GitHub action](https://github.com/score-spec/spec/issues/10)
* [Simplified installation options](https://github.com/score-spec/spec/issues/5) for [Mac](https://github.com/score-spec/spec/issues/3), [Microsoft](https://github.com/score-spec/spec/issues/4) and other OS
* Insufficient [documentation](https://docs.score.dev/docs/) on how to work with the Score spec and missing instructions on how to build your own Implementation CLI.

You can find an overview of all issues [here](https://github.com/score-spec/spec/issues). If you’d like to get involved check our [contribution guidelines](https://github.com/score-spec/spec#-contributing).

2022 left us excited for 2023. It’s been great to see that the idea and vision behind Score resonates with developers, which brings us to 2023…

## 2023 and beyond

Our long term vision for Score is to grow a community for discussing topics like cloud native development, developer tooling and developer experience. We hope to create a space where developers come together to share experiences and explore new ways of working. The goal for the tool itself is to implement:

* An [extensive suite of Score Implementation CLIs](https://github.com/score-spec/spec/blob/main/roadmap.md#score-implementation-clis) to integrate with platforms such as Google Cloud Run, ECS, Nomad, Mesos or similar.
* A well defined [extensions library](https://github.com/score-spec/spec/blob/main/roadmap.md#generalized-score-extension-mechanism) for the Score spec to accommodate all kinds of edge and use cases.
* A [developer knowledge base](https://github.com/score-spec/spec/blob/main/roadmap.md#score-developer-documentation) with educational content for different developer personas.

Curious to explore one of these topics in more detail but aren’t sure where or how to start? Reach out to share your ideas and we’ll do our best to provide additional product input to get you started and support you along the way. 

All contributions are welcome. Playing around with the tool and providing feedback, engaging in discussions or simply sharing your questions with us is a huge help. If you’re interested in testing or adopting Score with your team we’re open to supporting you with the onboarding and integration of the tool.

We’re excited to move things forward together with you and the rest of the community in 2023. It’ll be great to see where we’ll stand at the end of this quarter and year. If there’s something you’d like to discuss, drop in during our [monthly community meetings](https://github.com/score-spec/spec?tab=readme-ov-file#-get-in-touch). See you there!

Happy 2023!

The Score Team