<p align="center">
  <img src="[docs/images/banner.png](https://github.com/mem0ai/mem0/blob/main/docs/images/banner.png)" width="800px" alt="Mem0 Logo">
</p>

<p align="center">
  <a href="https://mem0.ai/slack">
    <img src="https://img.shields.io/badge/slack-mem0-brightgreen.svg?logo=slack" alt="Mem0 Slack">
  </a>
  <a href="https://mem0.ai/discord">
    <img src="https://dcbadge.vercel.app/api/server/6PzXDgEjG5?style=flat" alt="Mem0 Discord">
  </a>
  <a href="https://x.com/mem0ai">
    <img src="https://img.shields.io/twitter/follow/mem0ai" alt="Mem0 Twitter">
  </a>
  <a href="https://www.ycombinator.com/companies/mem0"><img src="https://img.shields.io/badge/Y%20Combinator-S24-orange?style=flat-square" alt="Y Combinator S24"></a>
  <a href="https://www.npmjs.com/package/mem0ai-ts"><img src="https://img.shields.io/npm/v/mem0ai-ts?style=flat-square&label=npm+mem0ai-ts" alt="mem0ai-ts npm package"></a>
  <a href="https://mem0.ai/email"><img src="https://img.shields.io/badge/substack-mem0-brightgreen.svg?logo=substack&label=mem0+substack" alt="Mem0 newsletter"></a>
</p>

# Mem0-TS: The Memory Layer for Personalized AI in TypeScript

Mem0-TS is the Typescript version of [mem0](https://github.com/mem0ai/mem0), which provides an intelligent, adaptive memory layer for Large Language Models (LLMs), enhancing personalized AI experiences by retaining and utilizing contextual information across diverse applications. This enhanced memory capability is crucial for applications ranging from customer support and healthcare diagnostics to autonomous systems and personalized content recommendations, allowing AI to remember user preferences, adapt to individual needs, and continuously improve over time.

## 🚀 Quickstart

### Installation

The Mem0-TS package can be installed directly from npm:

```bash
npm install mem0ai-ts
```

> [!NOTE]
> The Mem0-TS currently (20240727) is only supported OpenAI LLM and embeddings.

Set OpenAI key:

```
process.env.OPENAI_API_KEY = "sk-xxx";
```

### Usage

-   import and initialize"

```
import Memory from "mem0-ts";

const m = new Memory();
await m.initialize();
```

-   add memory

```
await m.add("I am working on improving my tennis skills. Suggest some online courses.", "alice", { category: "hobbies" });

```
