---
title: 运行 Worker（Run）
description: 启动 Worker 时，会创建一个 Worker Run。Worker Run 是一个基于构建后的 Docker 镜像创建的容器，并拥有专用资源（CPU、内存、磁盘空间）。
sidebar:
    order: 5
---

启动 Worker 时，会创建一个 **Worker Run**。Worker Run 是一个基于构建后的 Docker 镜像创建的 Docker 容器，并拥有专用资源（CPU、内存、磁盘空间）。

Worker 内部发生的情况可以在 Worker 运行详情和 Worker 运行日志中查看：

![Worker 运行详情](@/assets/docs/img_7.jpg)

每次运行和构建都从初始状态 **READY** 开始，经历一个或多个过渡状态，最终达到某个结束状态。

![Worker 运行状态转换](@/assets/docs/img_8.jpg)

## 数据保留

CoreClaw 会保留你所有的 Worker 运行记录。
![Worker 运行记录](@/assets/docs/img_9.jpg)
