---
title: Settling in - Score’s journey in the CNCF ecosystem
date: 2024-11-08T00:00:00-00:00
draft: false
description: Discovering Score’s place in the CNCF, connecting developers and platform teams.
image: cover_image_score_journey_in_the_cncf_ecosystem.jpg
author: susa-tunker
---

We’re excited to look back on our first few months as a CNCF sandbox project. This journey has been all about making connections, collaborating with the community and its working groups, and discovering where Score best fits in. Here’s a look at what we’ve learned, our main focus areas, and what’s next as we keep growing in the cloud-native space.

## Looking Back on Our First Few Months in the CNCF

It’s almost 4 months ago now that [Score joined the CNCF sandbox](https://score.dev/blog/score-joins-the-cncf-as-a-sandbox-project)! It was pretty cool to see our Score logo on the CNCF landscape, marking this big milestone. 

{{< figure src="cncf_landscape.png" >}}

As we’ve had some time to get settled and connect with the CNCF community, we’ve been thinking more about where and how Score fits into the CNCF ecosystem. This is a question that also came up throughout our onboarding—and it’s one we’re excited to keep exploring as we go forward.

## Score as the glue between teams

The question of where Score fits isn’t easy to answer because the project is designed to act as the “glue” between application developers and platform engineers. To recap: Score lets developers define their workload’s runtime requirements through a single spec file. This file is then processed by a Score implementation, which translates it into the required format—such as Docker Compose or Kubernetes (See [this graphic](https://github.com/score-spec/spec?tab=readme-ov-file#-implementation-of-the-score-specification) for a visual representation).

For developers, Score significantly reduces cognitive load. They can focus on describing their workload via a single spec without having to get into the weeds of container orchestration tech and tools (like Helm, Amazon ECS, Google Cloud Run, Nomad etc.). For platform engineers, Score brings standardisation by allowing them to define how the Score spec should be interpreted, produce the desired output for the platform and provision resources.

So, where does Score fit in the CNCF ecosystem? Within the [TAG App Delivery working groups](https://tag-app-delivery.cncf.io/wgs/), Platform and App Development align most closely with Score’s focus and potential impact. Other groups, like Artifacts, Infrastructure Lifecycle, and Operator, offer valuable insights into areas beyond Score’s core objectives. 

That said, let’s dive into the groups where Score feels most at home.

## Platform Working Group

The Platform Working Group has been Score’s home base so far. This group helped Score gain traction and ultimately supported our entry into the CNCF sandbox. Score fits well here because it drives discussions around separation of concerns and finding the right abstractions for teams working with internal developer platforms.

Score’s core philosophy - [workload-centric over infrastructure-centric development](https://score.dev/blog/workload-centric-over-infrastructure-centric-development) - encourages platform teams to focus on the developer experience from the start. Speaking in more practical terms, platform teams can put this into action by setting schemas for their team’s Score specifications, maintaining resource provisioners, or building custom implementations to match their use cases.

We’re excited to keep collaborating with this working group and explore how Score can continue supporting platform teams in creating mature platforms at scale.

(*Check out our previous talk with the Platform WG [here](https://www.youtube.com/watch?v=P6otOxdOKDk&t=1260s)*)

## App Development Working Group

The formation of the App Development Working Group [earlier this year](https://www.cncf.io/blog/2024/07/05/a-new-app-development-wg-has-now-been-launched) was an exciting development for us. Its [charter](https://tag-app-delivery.cncf.io/wgs/app-development/charter/charter.md) feels like it was lifted straight from Score’s mission statement and aligns perfectly with the problems Score addresses: reducing developer cognitive load and empowering them to ship quickly without getting bogged down by infrastructure details.

> *“Developing complex and distributed applications introduces challenges for inner-loop development practices and directly impacts developers’ productivity. The mismatch between development and production environments adds unnecessary complexities to developer workflows and pushes teams to develop different approaches to accelerate their feedback loops. ([reference](https://tag-app-delivery.cncf.io/wgs/app-development/charter/charter.md))”*

At present, the group is focused on highlighting Graduated and Incubating projects that directly benefit developers. This makes it more of an aspirational home for Score while we’re still in the Sandbox stage. However, the alignment with our goals is clear, and we hope to build bridges here as Score matures.

## Join the journey

While we’ve been most visible in the Platform Working Group so far, we’re eager to connect with others interested in app development discussions (On that note, we recently published a [Score for developers](https://docs.score.dev/docs/overview/score-for-devs) section in our documentation!). 

We see Score as a meeting point for developers and platform engineers to share experiences and explore fresh workflows—and we’re excited to see more contributors joining us. If you’re interested in contributing, check out [CLOTributor](https://clotributor.dev/search?foundation=cncf&project=score) for ways to get involved.

To see Score in action, watch [this recent talk hosted by Microsoft](https://learn.microsoft.com/en-us/shows/open-at-microsoft/improve-the-developers-experience-from-your-platform-with-score), where we dive into how Score can improve the developer experience.

For everything else—see you in the #score channel on [CNCF Slack](https://communityinviter.com/apps/cloud-native/cncf)!

