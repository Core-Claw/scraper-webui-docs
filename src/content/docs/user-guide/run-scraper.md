---
title: Run Template
description: When an Template is started, an Template Run is created.
---

When an Template is started, an **Template Run** is created.

An Template Run is a **Docker container** created from a built Docker image and is allocated **dedicated resources**, including CPU, memory, and disk space.

![](@/assets/docs/img_30.jpg)

All activities occurring inside the Template can be viewed in the Template **Run details**, along with the **Template Run logs**.

Each run and build starts from the initial **READY** state, transitions through one or more intermediate states, and eventually reaches a final state.

![](@/assets/docs/img_8.jpg)

---

### Data Retention

CafeScraper retains **all of your Template run records**.

![](@/assets/docs/img_25.jpg)
