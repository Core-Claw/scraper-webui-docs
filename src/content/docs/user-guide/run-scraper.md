---
title: Run Worker
description: When a Worker is started, a Worker Run is created.
---

When a Worker is started, a **Worker Run** is created.

A Worker Run is a **Docker container** created from a built Docker image and is allocated **dedicated resources**, including CPU, memory, and disk space.

![](@/assets/docs/img_30.jpg)

All activities occurring inside the Worker can be viewed in the Worker **Run details**, along with the **Worker Run logs**.

Each run and build starts from the initial **READY** state, transitions through one or more intermediate states, and eventually reaches a final state.

![](@/assets/docs/img_8.jpg)

---

### Data Retention

CoreClaw retains **all of your Worker run records**.

![](@/assets/docs/img_25.jpg)

