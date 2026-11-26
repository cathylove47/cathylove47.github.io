---
title: 读 Xiaoquan Yi 的论文：他的写作套路与可借鉴的地方
date: 2026-11-26 00:30:00
permalink: research/xiaoquan-yi-writing-style/
description: 从 OpenReview 上 Xiaoquan Yi（HUST 博士生）的一作论文里，拆出一套"先发现规律、再做方法"的写作模板，供自己写论文时借鉴。
categories:
  - 科研笔记
tags:
  - 论文写作
  - 写作风格
  - LLM 生成文本检测
comments: false
---

这篇是**读后笔记**，不是论文精读：不讲方法细节，只看他怎么组织一篇论文。

## 他是谁，读了哪些

- OpenReview 主页：[~Xiaoquan_Yi1](https://openreview.net/profile?id=~Xiaoquan_Yi1)，华中科技大学计算机学院博士生（2022 级，本科武汉理工），共 13 篇 publication。
- 一作的 5 篇都在 **LLM 生成内容检测**：ChatbotID（NeurIPS 2025）、UMPIRE（ACL 2026）、IED（IJCAI 2026）、VERITAS（NeurIPS 2026）以及它的前身 SAFD（ICLR 2026 投稿，已撤稿）。
- 其余是联邦学习和 Agent 综述的合作论文（FedProG、C²-AFCL、pFedDKS、FedBiF、COMST 综述）。
- 我只拆了前 5 篇一作论文。合作论文只下载了 PDF，没有分析。
- 请求时我没有在 OpenReview 上找到"auto research"相关的内容；如果你指的是另一个人，请告诉我。

## 他的套路：先找规律，再做方法

每篇都遵循同一个顺序：

1. **找一个能被统计验证的现象。** 这个现象是论文的发动机，方法只是把它变成特征或损失。
   - ChatbotID：人与人对话里情感影响是双向的，人与机器人对话是非对称的。
   - UMPIRE：人给图配文字时会补充图里没有的信息，LLM 倾向于描述图里已有的内容。
   - IED：人写的文本信息熵高于 LLM 生成的文本。
   - VERITAS：现有检测器遇到风格改写后准确率最多下降 16.45%。
2. **用一张图或一张表在正文里先证明这个现象**（Motivation 单独成节）。
   - UMPIRE 的表 1 给出具体数字：LLM 文本中"提到图中物体"的比例是 89.3%，人类只有 28.4%。
3. **方法部分每个模块对应一个损失项**，最后合成总目标函数。
4. **实验按固定顺序铺开**：主表 → 换 backbone → 消融 → 按条件分层 → 跨域泛化 → 复杂度。

## 摘要的写法

固定五步，每篇几乎一样：

1. 背景：LLM 变强，所以需要检测。
2. 缺口：现有方法只看静态特征或需要模型内部信息。
3. 发现："We identify / reveal …"，一句话说出规律。
4. 方法：起一个好记的名字（UMPIRE、IED、ChatbotID），说它怎么利用这个规律。
5. 结果：用一个数字收尾，如 15.92%、5.38%、10.81%。

## 引言和相关工作

- 引言第二段把已有方法分成 2–3 类，每类写一个 "However"。
  - 需要模型内部信息，黑盒不能用。
  - 只用统计特征，被改写一下就失效。
  - 监督分类器只看静态文本，忽略交互或跨模态的行为。
- 引言结尾给固定的三条贡献：
  - 第一条写发现，带 "to our knowledge, the first"。
  - 第二条写方法，同样带 "first"。
  - 第三条写实验：多数据集、多种 LLM、up to X%。
- Related Work 按方法类别分小节，每类先说做了什么，再用一两句指出局限，并和本文区分。
- 偶尔借用背景理论给发现撑腰：Communication Accommodation Theory、Principle of Least Effort、Granger 因果检验。

## 一个值得注意的细节：同一篇论文改名再投

SAFD（ICLR 2026 投稿）和 VERITAS（NeurIPS 2026）的摘要几乎逐句相同，都有"up to 16.45%"和"两个局限"的表述；NeurIPS 版加了合作者并改了方法名和章节标题（例如 4.1 Simulating Style-Based Adversarial Attacks、4.2 Performance Degradation Under Style-Shifts、5 The VERITAS Framework）。
这说明被撤稿后，把核心发现和叙事保留，重新包装名字和实验再投，是一条可行路线。这是我对两个版本摘要对比后的判断，不是作者说明。

## 语言习惯

- 动词偏正式、偏夸张：remarkable、innovative、synergistically、hyper-realistic。
- 常用短语：extensive experiments、significantly outperforms、to the best of our knowledge。
- 句子偏长，从句多。
- 缺点：`first` 用得太多，审稿人容易抓；摘要和贡献里的说法也有重复。

## 我可以借鉴什么

- 先找出一个能画成图或表的**经验规律**，让方法服务于它。
- 引言按"分类 + However"逐类指出现有方法的问题，贡献固定写三条。
- 摘要用一个具体数字收尾。
- 实验章节按固定顺序，并加上跨域泛化和复杂度对比。
- 每个方法模块对应一个损失项，最后合成总目标函数，读者容易跟随。
- 要避免：新颖性断言太多；表格和图的说明写得太长。

## 论文列表

| 论文 | Venue | 备注 |
|---|---|---|
| ChatbotID | NeurIPS 2025 poster | 一作，已读 |
| UMPIRE | ACL 2026 long | 一作，已读 |
| Information Entropy for LLM-generated Text Detection (IED) | IJCAI 2026 | 一作，已读 |
| VERITAS | NeurIPS 2026 poster | 一作，已读 |
| SAFD | ICLR 2026 撤稿投稿 | 一作，已读，是 VERITAS 前身 |
| Cross-task Calibration for Asynchronous FCL / C²-AFCL | ICML 2026 / ICLR 2026 投稿 | 合作，未分析 |
| FedProG、pFedDKS、FedBiF、COMST 综述 | NeurIPS 2026 / WWW 2026 / arXiv / IEEE COMST | 合作，未分析 |
