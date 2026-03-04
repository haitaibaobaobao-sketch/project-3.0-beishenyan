---
name: ultrarag-knowledge-base
description: UltraRAG 知识库检索与文档管理。通过 MCP 工具搜索本地向量知识库、导入新文档、分块和嵌入。当用户提到"知识库"、"搜索文献"、"查找论文内容"、"导入文档到知识库"、"检索"、"RAG"时触发此 skill。也在用户询问已导入文献的具体内容时触发。
---

# UltraRAG 知识库

通过 ultrarag-retriever 和 ultrarag-corpus 两个 MCP 服务器，提供知识库搜索和文档管理能力。

## 前置条件

- Docker 中运行着 Milvus Standalone（端口 19530）
- 嵌入模型：SiliconFlow API 的 Qwen/Qwen3-Embedding-4B（2560 维）

## 第一步：初始化检索器（每次新对话必须先做）

每次新对话开始，在使用搜索之前，必须先调用 `retriever_init` 初始化检索器：

```
mcp__ultrarag-retriever__retriever_init(
  model_name_or_path="openbmb/MiniCPM-Embedding-Light",
  backend="openai",
  backend_configs={
    "openai": {
      "model_name": "Qwen/Qwen3-Embedding-4B",
      "base_url": "https://api.siliconflow.cn/v1",
      "api_key": "sk-yxmbhlccifzsmytxzcsaiewhyytwcicbuhyxhkvcivvkpacq",
      "concurrency": 8
    }
  },
  batch_size=16,
  corpus_path="data/knowledge_base/chunks/upload_20260207_133734_7b92e4ec.jsonl",
  index_backend="milvus",
  index_backend_configs={
    "milvus": {
      "uri": "http://localhost:19530",
      "id_field_name": "id",
      "vector_field_name": "vector",
      "text_field_name": "contents",
      "id_max_length": 64,
      "text_max_length": 60000,
      "metric_type": "IP",
      "index_params": {"index_type": "AUTOINDEX", "metric_type": "IP"},
      "search_params": {"metric_type": "IP", "params": {}},
      "index_chunk_size": 1000
    }
  },
  collection_name="chem_ai_literature",
  is_demo=false
)
```

初始化成功后才能搜索。

## 搜索知识库

调用 `retriever_search`，传入查询列表和 top_k：

```
mcp__ultrarag-retriever__retriever_search(
  query_list=["polyolefin chemical recycling catalyst"],
  top_k=5,
  collection_name="chem_ai_literature"
)
```

返回 `ret_psg`，是每个查询对应的相关段落列表。

## 导入新文档到知识库

### 1. 解析文档为语料库

```
mcp__ultrarag-corpus__build_text_corpus(
  parse_file_path="C:/Users/MateBook D16/Desktop/阅读/化学ai文献/新文献.pdf",
  text_corpus_save_path="C:/Users/MateBook D16/UltraRAG/data/knowledge_base/corpus/新文献.jsonl"
)
```

### 2. 分块

```
mcp__ultrarag-corpus__chunk_documents(
  raw_chunk_path="C:/Users/MateBook D16/UltraRAG/data/knowledge_base/corpus/新文献.jsonl",
  chunk_path="C:/Users/MateBook D16/UltraRAG/data/knowledge_base/chunks/新文献_chunks.jsonl",
  chunk_backend="token",
  tokenizer_or_token_counter="character",
  chunk_size=500,
  use_title=true,
  chunk_backend_configs={
    "token": {"chunk_overlap": 64}
  }
)
```

### 3. 初始化检索器（如果还没初始化）

同第一步。

### 4. 生成嵌入

```
mcp__ultrarag-retriever__retriever_embed(
  embedding_path="C:/Users/MateBook D16/UltraRAG/data/knowledge_base/index/新文献_embeddings.npy",
  overwrite=true
)
```

### 5. 建索引（导入 Milvus）

```
mcp__ultrarag-retriever__retriever_index(
  embedding_path="C:/Users/MateBook D16/UltraRAG/data/knowledge_base/index/新文献_embeddings.npy",
  collection_name="chem_ai_literature",
  overwrite=false
)
```

## 当前知识库内容

- 集合名：`chem_ai_literature`
- 文档：母文献.pdf（化学回收聚烯烃废弃物综述，National Science Review 2023）
- 文本块数：204
- 向量维度：2560（Qwen3-Embedding-4B）
- 索引类型：Milvus AUTOINDEX，内积相似度（IP）

## 关键路径

- UltraRAG 项目：`C:/Users/MateBook D16/UltraRAG/`
- 语料库：`data/knowledge_base/corpus/`
- 分块文件：`data/knowledge_base/chunks/`
- 嵌入文件：`data/knowledge_base/index/`
- 配置文件：`servers/retriever/parameter.yaml`
