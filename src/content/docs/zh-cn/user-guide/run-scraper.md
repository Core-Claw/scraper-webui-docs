---
title: 运行脚本（Run）
description: 启动 Template 时，会创建一个 Template 运行。Template 运行是一个 Docker 容器，它基于构建的 Docker 镜像创建，并拥有专用的资源（CPU、内存、磁盘空间）。
---

启动 Template 时，会创建一个 Template 运行。Template 运行是一个 Docker 容器，它基于构建的 Docker 镜像创建，并拥有专用的资源（CPU、内存、磁盘空间）。

Template 内部发生的情况可以在 Template 运行日志的 Template 运行详情中看到：

![](@/assets/docs/img_7.jpg)

每次运行和构建都从初始状态READY开始，并经历一个或多个过渡状态，最终达到某个最终状态。

![](@/assets/docs/img_8.jpg)

## 数据保留

CafeScarper 会保留你所有的运行记录
![](@/assets/docs/img_9.jpg)
