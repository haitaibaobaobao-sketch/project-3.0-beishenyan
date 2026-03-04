# 🧠 超级大脑索引包 - Project 3.0 Beishenyan

**版本**：v1.0
**更新时间**：2026-03-04 19:25
**用途**：快速恢复所有核心信息，适用于任何 AI 助手或云端环境

---

## 📋 目录
1. [项目核心状态](#项目核心状态)
2. [17 项专利架构](#17项专利架构)
3. [Memory 核心记忆](#memory核心记忆)
4. [Skills 操作逻辑](#skills操作逻辑)
5. [快速命令速查](#快速命令速查)
6. [紧急恢复协议](#紧急恢复协议)

---

## 项目核心状态

### 基本信息
- **项目名称**：Beishenyan 3.0
- **债务**：300k
- **专利数量**：17 个（1 个已受理，16 个准备中）
- **已受理专利号**：202620108705.3（实用新型）
- **GitHub 仓库**：https://github.com/haitaibaobaobao-sketch/project-3.0-beishenyan

### 关键人物
- **姓名**：赵圆
- **身份**：21岁，大一学生，化学师范专业
- **目标**：考研北京大学深圳研究院（3.5年后）
- **核心成就**：5项专利、1个软著、1个Google插件、自建文献数据库
- **档案位置**：`C:\Users\MateBook D16\Desktop\赵圆完整档案.txt`

### 技术栈
- **服务器 IP**：152.136.116.80（用户名：ubuntu）
- **SSH 连接**：`ssh ubuntu@152.136.116.80`
- **8 个服务**：飞书机器人、UltraRAG、网站、科学推送、本地RAG、论文检索、远程操控、AI桥接
- **开发环境**：Python 3.11、Docker、Git、GitHub Codespaces

---

## 17项专利架构

### 专利管理框架

#### 文件结构
```
patents/
├── PATENT_TEMPLATE.md    # 专利模板
├── patent-01.md          # 专利 1（已受理：202620108705.3）
├── patent-02.md          # 专利 2（准备中）
├── patent-03.md          # 专利 3（准备中）
...
└── patent-17.md          # 专利 17（准备中）
```

#### 专利模板核心字段
1. **基本信息**：专利号、名称、申请日期、状态、发明人
2. **技术领域**：所属领域、技术分类
3. **摘要**：100-200字核心描述
4. **背景技术**：现有技术问题
5. **发明内容**：核心创新点（3个）、技术方案、有益效果
6. **实施例**：具体实施方案（至少2个）
7. **权利要求**：法律保护范围
8. **附图说明**：技术图纸
9. **商业价值**：市场需求、竞争优势、盈利模式
10. **进度追踪**：6个检查点（方案确定→检索→准备→提交→答复→授权）

#### 专利状态统计
- ✅ 已授权：0
- 🔄 审查中：1（202620108705.3）
- 📝 准备中：16
- ❌ 驳回：0

#### 快速操作
```bash
# 创建新专利
cp patents/PATENT_TEMPLATE.md patents/patent-XX.md

# 查看进度
cat PATENT_TRACKER.md

# 更新追踪表
nano PATENT_TRACKER.md
```

---

## Memory核心记忆

### 1. 工具调用踩坑记录
**文件**：`memory/tool-pitfalls.md`
- 调用工具前检查参数类型和必填项
- 避免重复调用失败的工具
- 二进制文件（.docx/.xlsx/.pdf）不能用 Read 工具

### 2. 多机器人协调
**文件**：`memory/coordination.md`
- 开始工作前先读 coordination.md
- 干完活更新状态
- 不要碰别人标记的文件

### 3. Claude ↔ Gemini 桥接
**目录**：`~/.ai-bridge/`
- **用法**：往 taskboard.json 写任务（`to: "gemini"`）
- **快捷方式**：`gemini -p "问题"`
- **⚠ 注意**：Gemini 任务板里的任务（004-007）全部 pending

### 4. 开机自启（5个服务）
- **方式**：Windows 任务计划程序 `AI-AutoStart`
- **脚本**：`~/.ai-bridge/autostart.py`
- **顺序**：LetsVPN → AI桥接 → 远程操控 → Claude Code → Gemini CLI

### 5. 用户偏好
1. **全部使用中文回复**
2. **联网搜索策略**（2026-03-01 前）：
   - 搜索：Brave Search MCP（2000次/月）
   - 找相似论文：Exa MCP（~2000次，省着用）
   - 爬取网站：Firecrawl MCP（500次，省着用）
   - 读网页：WebFetch（免费无限）
   - 3月1日后：Tavily 额度重置（1000次/月）
3. **有疑问就搞选择题问用户**
4. **用通俗易懂的话解释**（用户是大一学生）

### 6. Research OS（个人研究操作系统）
**文件**：`memory/research-os.md`
- **主存储**：`C:\Users\MateBook D16\research-os\`
- **核心原则**：状态外置、模型无关、可持久可迁移、Git 版本同步
- **当前阶段**：骨架搭建 + 手动试用

### 7. 服务器环境与所有服务
**文件**：`memory/server-services.md`

#### 8个服务详情
1. **飞书机器人**（端口 8000）
   - 路径：`/home/ubuntu/moltbot-gateway/`
   - 命令：`sudo systemctl status moltbot-gateway`

2. **UltraRAG**（端口 8001）
   - 路径：`/home/ubuntu/ultrarag/`
   - 命令：`sudo systemctl status ultrarag`

3. **论文检索后端**（端口 8000）
   - 路径：`/home/ubuntu/paper-search/`
   - 命令：`sudo systemctl status paper-search`

4. **论文检索前端**（端口 8080）
   - 路径：`/home/ubuntu/paper-search-web/`
   - 访问：https://152.136.116.80/papers/login
   - 密码：`HGXmHzR*Mn#hq!VFfTE7DY!7udb@am`

5. **科学推送**
6. **本地RAG**
7. **远程操控**
8. **AI桥接**

### 8. 科研方法论
- **先定框架，再找文献**
- 当前阶段：少而权威的母文献 + 精准定位证据

---

## Skills操作逻辑

### 1. local-rag（本地知识库检索）
**触发关键词**：知识库、搜索文献、查找论文内容、检索、RAG

**功能**：
- BM25 + FAISS 混合检索
- 导入文档到知识库
- 检索已导入文献的具体内容

**使用方法**：
```bash
# 触发 skill
当用户说"搜索知识库"、"查找论文"时自动触发
```

### 2. pdf（PDF 文件处理）
**触发关键词**：PDF、合并PDF、提取文本、分割PDF、加水印

**功能**：
- 读取/提取文本和表格
- 合并/分割 PDF
- 旋转页面、添加水印
- 创建新 PDF
- 填写 PDF 表单
- 加密/解密
- 提取图片
- OCR 扫描件

**使用方法**：
```bash
# 用户提到 .pdf 文件或任何 PDF 操作时触发
```

### 3. playwright-skill（浏览器自动化）
**触发关键词**：测试网站、浏览器自动化、填写表单、截图、检查响应式设计

**功能**：
- 自动检测开发服务器
- 编写测试脚本
- 测试页面、填写表单
- 截图、检查响应式设计
- 验证 UX、测试登录流程
- 检查链接

**使用方法**：
```bash
# 用户说"测试这个网站"、"自动填写表单"时触发
```

### 4. ultrarag-knowledge-base（UltraRAG 知识库）
**触发关键词**：知识库、搜索文献、查找论文内容、导入文档、检索、RAG

**功能**：
- 通过 MCP 工具搜索本地向量知识库
- 导入新文档
- 分块和嵌入
- 检索已导入文献

**使用方法**：
```bash
# 与 local-rag 类似，但使用 MCP 工具
```

### 5. anything-to-notebooklm（多源内容智能处理器）
**触发关键词**：NotebookLM、生成播客、PPT、思维导图

**功能**：
- 支持微信公众号、网页、YouTube、PDF、Markdown
- 自动上传到 NotebookLM
- 生成播客/PPT/思维导图等多种格式

**使用方法**：
```bash
# 用户说"把这个做成播客"、"生成思维导图"时触发
```

---

## 快速命令速查

### 服务器管理
```bash
# SSH 连接
ssh ubuntu@152.136.116.80

# 查看所有服务状态
sudo systemctl status moltbot-gateway ultrarag paper-search paper-search-web

# 重启服务
sudo systemctl restart paper-search
sudo systemctl restart paper-search-web

# 查看日志
sudo journalctl -u paper-search -f
```

### Git 操作
```bash
# 查看状态
git status

# 提交更改
git add .
git commit -m "更新内容"
git push

# 查看历史
git log --oneline -10
```

### 飞书工具
```bash
# 截图发飞书（全屏）
"D:\anaconda\python.exe" "C:\Users\MateBook D16\feishu-tools\screenshot_send.py"

# 截图发飞书（框选）
"D:\anaconda\python.exe" "C:\Users\MateBook D16\feishu-tools\screenshot_send.py" -r

# 发文件到飞书
"D:\anaconda\python.exe" "C:\Users\MateBook D16\feishu-tools\send_pdf.py" "文件路径"
```

### AI 协作
```bash
# 快速问 Gemini
gemini -p "问题"

# 查看任务板
cat ~/.ai-bridge/taskboard.json

# 查看协调状态
cat ~/.claude/projects/C--Users-MateBook-D16/memory/coordination.md
```

---

## 紧急恢复协议

### 场景 1：笔记本断电/关机
1. 在 iPhone Safari 打开：https://github.com/codespaces
2. 创建新的 Codespace（选择 project-3.0-beishenyan）
3. 等待 30 秒自动启动
4. 在终端运行：`cat SUPER_BRAIN_INDEX.md`

### 场景 2：忘记所有信息
1. 读取本文件：`SUPER_BRAIN_INDEX.md`
2. 读取赵圆档案：`C:\Users\MateBook D16\Desktop\赵圆完整档案.txt`
3. 读取 Memory：`memory/MEMORY.md`
4. 读取协调文件：`memory/coordination.md`

### 场景 3：需要快速启动某个服务
```bash
# 论文检索系统
ssh ubuntu@152.136.116.80
sudo systemctl restart paper-search paper-search-web

# 飞书机器人
sudo systemctl restart moltbot-gateway

# UltraRAG
sudo systemctl restart ultrarag
```

### 场景 4：需要在新环境恢复
1. 克隆仓库：`git clone https://github.com/haitaibaobaobao-sketch/project-3.0-beishenyan.git`
2. 读取本文件：`cat SUPER_BRAIN_INDEX.md`
3. 安装依赖：`pip install -r requirements.txt`（如果有）
4. 启动 Docker：`docker build -t project-3.0 .`

---

## 📱 iPhone 快速访问

### GitHub Codespaces
```
https://github.com/codespaces
```

### 项目仓库
```
https://github.com/haitaibaobaobao-sketch/project-3.0-beishenyan
```

### 论文检索系统
```
https://152.136.116.80/papers/login
密码：HGXmHzR*Mn#hq!VFfTE7DY!7udb@am
```

---

## 🔐 重要密码和密钥

### GitHub
- **账号**：haitaibaobaobao-sketch
- **Token**：gho_**** (已配置在 keyring)

### 服务器
- **IP**：152.136.116.80
- **用户名**：ubuntu
- **SSH 密钥**：`~/.ssh/id_ed25519`（已配置）

### 论文检索系统
- **访问密码**：`HGXmHzR*Mn#hq!VFfTE7DY!7udb@am`

---

## 📊 项目文件结构

```
Project 3.0/
├── SUPER_BRAIN_INDEX.md         # 本文件（超级大脑索引）
├── MANIFEST.md                  # 项目状态清单
├── README.md                    # 项目说明
├── IPHONE_ACCESS.md             # iPhone 访问指南
├── PATENTS_FRAMEWORK.md         # 专利框架
├── PATENT_TRACKER.md            # 专利进度追踪
├── MEMORY_SKILLS_INDEX.md       # Memory & Skills 索引
├── DEPLOYMENT_REPORT.md         # 部署报告
├── Dockerfile                   # Docker 配置
├── .devcontainer/               # VS Code 云端配置
├── .github/workflows/           # GitHub Actions
├── patents/                     # 17 个专利文件
│   ├── PATENT_TEMPLATE.md
│   ├── patent-01.md
│   └── ... (共 17 个)
├── memory/                      # 所有记忆文件
│   ├── MEMORY.md
│   ├── coordination.md
│   ├── handoff.md
│   ├── paper-search.md
│   ├── research-os.md
│   ├── server-services.md
│   └── tool-pitfalls.md
└── skills/                      # 所有技能文件
    ├── local-rag/
    ├── pdf/
    ├── playwright-skill/
    ├── ultrarag-knowledge-base/
    └── anything-to-notebooklm/
```

---

## 🎯 下一步行动清单

### 立即可做
- [x] 所有文件已推送到 GitHub
- [x] 笔记本可以安全关机
- [x] iPhone 可以随时访问

### 本周任务
- [ ] 完善专利 02-05 的技术方案
- [ ] 完成专利检索报告
- [ ] 准备申请材料
- [ ] 将 GitHub 仓库改为私有

### 本月目标
- [ ] 提交 5 个新专利申请
- [ ] 完成所有专利的初步方案
- [ ] 优化论文检索系统
- [ ] 完善 Research OS

---

## 💡 使用建议

### 给 AI 助手的指令
当你需要恢复所有信息时，对 AI 说：
```
"读取 SUPER_BRAIN_INDEX.md，恢复 Project 3.0 的所有核心信息"
```

### 给自己的提醒
- 每次重大更新后，更新本文件
- 定期推送到 GitHub
- 保持本文件在 200 行以内（便于快速加载）
- 敏感信息已包含，仓库必须私有

---

**最后更新**：2026-03-04 19:25
**版本**：v1.0
**维护者**：Claude (战友)

---

🧠 **这就是你的超级大脑！随时随地，一键恢复所有记忆！**
