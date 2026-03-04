# 服务器环境与服务详情

## 基本信息
- **服务器 IP**：152.136.116.80
- **用户名**：ubuntu
- **密码**：Zzm841800
- **SSH 密钥**：本机 `~/.ssh/id_ed25519` 已配置免密登录
- **Python**：系统 3.10 + deadsnakes PPA 安装的 3.12

## 运行的服务

### 1. Moltbot 飞书机器人（Gateway）
- **端口**：18789 (WebSocket) + 18790 (飞书 Webhook)
- **项目目录**：`/home/ubuntu/openclaw_lcgf`
- **配置文件**：`/home/ubuntu/.clawdbot/moltbot.json`
- **会话数据**：`/home/ubuntu/.clawdbot/agents/main/sessions/`
- **工作空间**：`/home/ubuntu/clawd/`
- **systemd 服务**：`moltbot-gateway.service`
- **模型**：glm/claude-haiku-4-5（通过 http://43.160.240.127:8000/v1 代理）
- **飞书 App ID**：cli_a9f71c81b7b8dbdc
- **飞书 Webhook 路径**：`/feishu/webhook`

### 2. UltraRAG 知识库
- **端口**：5050
- **项目目录**：`/home/ubuntu/UltraRAG`
- **虚拟环境**：`/home/ubuntu/UltraRAG/.venv`（Python 3.12，uv 管理）
- **systemd 服务**：`ultrarag.service`
- **豆包 API Key**：24d49636-5c0e-4dc8-9edc-13dd7db0d189
- **豆包 Endpoint**：ep-20260202000459-6k2vb

### 3. 两系统桥接
- **桥接脚本**：`/home/ubuntu/openclaw_lcgf/skills/ultrarag/scripts/query.py`
- **调用方式**：机器人 exec → query.py → BM25 检索 → 豆包生成回答

### 4. 瓶安仕个人网站
- **访问地址**：http://152.136.116.80（80 端口）
- **服务器文件**：`/home/ubuntu/website/`
- **本地文件**：`C:\Users\MateBook D16\website\`（index.html, style.css, script.js）
- **Nginx 配置**：`/etc/nginx/sites-available/website`

### 5. 科学前沿每日推送系统
- **本地脚本**：`C:\Users\MateBook D16\feishu-tools\`
- **服务器脚本**：`/home/ubuntu/feishu-tools/`
- **核心脚本**：`science_daily_push.py`（定时）、`science_more.py`（按需）
- **6个来源**：ScienceDaily、Nature、arXiv、Phys.org、Science、X/Twitter(Tavily)
- **Tavily API Key**：`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`

### 6. 本地 RAG 检索系统
- **脚本**：`C:\Users\MateBook D16\UltraRAG\local_rag.py`
- **Python**：`C:\Users\MateBook D16\UltraRAG\.venv\Scripts\python.exe`
- **检索模式**：BM25 + FAISS + RRF 融合
- **嵌入**：SiliconFlow Qwen3-Embedding-4B（2560 维）
- **知识库**：母文献（化学回收聚烯烃，204 块）

### 7. 论文多源检索系统（Paper Search v2）
- **详细文档**：见 [paper-search.md](paper-search.md)
- **访问地址**：http://152.136.116.80/papers/
- **后端**：FastAPI 端口 8000，systemd: `paper-search.service`
- **前端**：Flask 端口 8080，systemd: `paper-search-web.service`
- **数据源**：19 个工作中，百度学术被拦

### 8. 远程操控电脑系统（Remote Agent）
- **本地**：`C:\Users\MateBook D16\remote-agent\`
- **服务器**：`/home/ubuntu/remote-cmd/`
- **启动**：双击 `start.bat`
- **支持命令**：run、screenshot、open_file、open_url、type_text、shell、python

## 常见问题速查

### 机器人不回复
1. `sudo systemctl status moltbot-gateway`
2. `sudo journalctl -u moltbot-gateway --since '10 min ago' | tail -30`
3. 清空 sessions：`echo '{}' > ~/.clawdbot/agents/main/sessions/sessions.json && rm -f ~/.clawdbot/agents/main/sessions/*.jsonl`

### 安装依赖超时
- 用清华源：`-i https://pypi.tuna.tsinghua.edu.cn/simple`

## 专利信息
- **申请号**：202620108705.3（实用新型，已受理）
- **查询网址**：https://cpquery.cponline.cnipa.gov.cn
- **飞书提醒**：周一/周五早6:00

## 关键命令速查
```bash
ssh ubuntu@152.136.116.80
sudo systemctl status moltbot-gateway ultrarag paper-search paper-search-web
sudo systemctl restart paper-search      # 论文检索后端
sudo systemctl restart paper-search-web  # 论文检索前端
```
