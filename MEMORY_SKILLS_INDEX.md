# Memory & Skills 索引

## 📚 Memory 文件（已同步）

### 核心记忆文件
- `MEMORY.md` - 主记忆文件（自动加载到对话上下文）
- `coordination.md` - 多机器人协调规则
- `handoff.md` - 任务交接记录
- `paper-search.md` - 论文检索系统详情
- `research-os.md` - Research OS 设计文档
- `server-services.md` - 服务器环境与服务
- `tool-pitfalls.md` - 工具调用踩坑记录

### 记忆内容概览
- **用户信息**：赵圆档案、战友关系、3.5年考研计划
- **技术栈**：服务器配置、8个服务、专利系统
- **工作流**：科研方法论、Research OS、多AI协作
- **重要日期**：2026-03-01 Tavily 额度重置

---

## 🛠️ Skills 文件（已索引）

### 可用技能列表
1. **local-rag** - 本地知识库检索（BM25 + FAISS）
2. **pdf** - PDF 文件处理
3. **playwright-skill** - 浏览器自动化测试
4. **ultrarag-knowledge-base** - UltraRAG 知识库检索
5. **anything-to-notebooklm** - 多源内容智能处理器

### 技能触发关键词
- "知识库"、"搜索文献"、"检索" → local-rag / ultrarag
- "PDF"、"合并PDF"、"提取文本" → pdf
- "测试网站"、"浏览器自动化" → playwright-skill
- "NotebookLM"、"生成播客" → anything-to-notebooklm

---

## 🔄 同步状态

### 最后同步时间
- Memory: 2026-03-04 19:20
- Skills: 2026-03-04 19:20

### 同步位置
- **源目录**：`C:\Users\MateBook D16\.claude\projects\C--Users-MateBook-D16\memory\`
- **目标目录**：`Project 3.0/memory/`
- **GitHub 仓库**：已自动推送

---

## 📱 iPhone 访问方式

在 GitHub Codespaces 中可以直接访问：
```bash
# 查看记忆文件
cat memory/MEMORY.md

# 查看技能列表
ls skills/

# 搜索特定内容
grep -r "关键词" memory/
```

---

## 🔐 重要提醒

- Memory 文件包含敏感信息（服务器密码、API密钥等）
- 建议将仓库设为私有
- 定期同步最新的 memory 内容
