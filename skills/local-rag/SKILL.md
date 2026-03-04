---
name: local-rag
description: 本地知识库检索（BM25 + FAISS 混合检索）。当用户提到"知识库"、"搜索文献"、"查找论文内容"、"导入文档到知识库"、"检索"、"RAG"时触发此 skill。也在用户询问已导入文献的具体内容时触发。
---

# 本地知识库检索

通过 `local_rag.py` 脚本进行 BM25 + FAISS 混合检索，完全不依赖 MCP，直接用 Python 调用。

## 检索命令

```bash
"C:\Users\MateBook D16\UltraRAG\.venv\Scripts\python.exe" "C:\Users\MateBook D16\UltraRAG\local_rag.py" search "查询内容" --top_k 5 --mode hybrid
```

**参数说明**：
- `search`：检索子命令
- `"查询内容"`：用户的问题或关键词（建议用英文，因为文献是英文的）
- `--top_k 5`：返回前 5 条最相关的结果（可调整）
- `--mode hybrid`：混合模式（BM25 关键词 + FAISS 语义），也可选 `bm25` 或 `faiss`

## 使用流程

1. 用户提问涉及知识库内容时，先用 Bash 运行上面的检索命令
2. 检索结果是 JSON 格式，包含 `results` 数组，每条有 `rank`、`doc`、`text` 字段
3. 把检索到的 `text` 内容作为参考资料，在当前对话中回答用户的问题
4. 回答时注明信息来源（哪篇文献的哪个部分）

## 查看知识库内容

```bash
"C:\Users\MateBook D16\UltraRAG\.venv\Scripts\python.exe" "C:\Users\MateBook D16\UltraRAG\local_rag.py" list
```

## 重建索引

当导入新文档后，需要重建索引：

```bash
"C:\Users\MateBook D16\UltraRAG\.venv\Scripts\python.exe" "C:\Users\MateBook D16\UltraRAG\local_rag.py" index --overwrite
```

## 当前知识库内容

- **母文献**：化学回收聚烯烃废弃物综述（National Science Review 2023），204 个文本块
- 向量维度：2560（Qwen3-Embedding-4B via SiliconFlow）
- 检索模式：BM25 关键词匹配 + FAISS 向量语义匹配，RRF 融合排序

## 关键路径

- 检索脚本：`C:\Users\MateBook D16\UltraRAG\local_rag.py`
- 文本块：`C:\Users\MateBook D16\UltraRAG\data\knowledge_base\chunks\`
- 索引文件：`C:\Users\MateBook D16\UltraRAG\data\knowledge_base\index\`
- Python 环境：`C:\Users\MateBook D16\UltraRAG\.venv\Scripts\python.exe`

## 注意事项

- 查询建议用**英文**（文献原文是英文）
- 如果用户用中文提问，先把关键概念翻译成英文再检索
- `--mode hybrid` 效果最好，综合了关键词精确匹配和语义理解
- 检索结果的 stderr 输出是进度信息，只需要关注 stdout 的 JSON 输出
