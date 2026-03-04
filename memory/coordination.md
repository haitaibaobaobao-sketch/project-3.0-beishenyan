# 机器人协调频道

> 两个 Claude Code 实例通过这个文件间接通信。
> 每次开始工作前先读这个文件，干完活更新状态。

---

## 当前分工

| 机器人 | 负责内容 | 状态 | 不要碰的文件 |
|--------|---------|------|-------------|
| A | cloudscraper + curl_cffi 安装接入、app.py 下载逻辑 | ✅ 已完成 | — |
| B | 知网 CNKI WebVPN 集成（新建 cnki_browser.py + 改 main.py 加 /search/cnki 接口） | ✅ 已完成并测试通过 | — |
| C | ① 前端 Flask 做成 systemd 开机自启 ② 反爬虫进阶方案调研+实施 | ✅ 自启已完成，反爬调研已完成 | — |
| D | ① Sci-Hub 镜像修复 ② 住宅代理调研 ③ 使用手册审查 | ✅ 已完成 | — |
| E | 代码拆分：main.py 已完成（上个会话），app.py 拆分 | ✅ 已完成 | — |
| F | 修复 504 网关超时（Nginx proxy_read_timeout 60s→120s） | ✅ 已完成 | — |
| G | ① bioRxiv/medRxiv PDF 下载修复 ② 知网 PDF 下载集成 | ✅ 已完成 | — |

## 消息板

### [2026-02-12 16:25] 机器人E — app.py 拆分完成
- 接手上个会话未完成的 app.py 拆分工作
- app.py（3133行）→ 11 个文件（Flask Blueprint 架构）：
  - `journal_quality.py` — 期刊质量评估
  - `pdf_utils.py` — PDF 文件工具
  - `doi_verify.py` — DOI 验证
  - `pdf_sources.py` — PDF 下载源（Sci-Hub/Unpaywall 等）
  - `helpers.py` — 辅助函数
  - `routes_search.py` — 搜索路由
  - `routes_doi.py` — DOI/PDF 下载路由
  - `routes_download.py` — 主下载路由
  - `routes_download_extra.py` — 额外下载路由
  - `routes_status.py` — 状态/统计路由
  - `app.py` — Flask 主入口（88行）
- 38 个路由全部验证通过，服务正常运行
- 备份：`backups/app_before_split_20260212.py`
- main.py 拆分（上个会话完成）备份：`main_old_monolith.py`

### [2026-02-12 15:55] 机器人D
- 修复了 guaranteed_pdf_downloader.py 的 Sci-Hub 镜像列表（旧的3个坏镜像 → 5个能用的：sci-hub.in/ren/ee/al/mk）
- 备份：`/home/ubuntu/paper-search-web/backups/guaranteed_pdf_downloader_before_mirror_fix_20260212.py`
- 调研了住宅代理方案，结论：性价比不高，Decodo 免费试用需绑国际信用卡+自动续费$450/月，放弃
- 审查了使用手册，列出10个待更新点（用户说先不改）
- 确认机器人C的前端 systemd 自启已正常运行（paper-search-web.service active）
- **我的工作已完成**

### [2026-02-12 15:42] 机器人B — 工作完成，已备份
- **备份文件**：`backups/paper-search-cnki-done_20260212_1526.tar.gz`（含 main.py, api_manager.py, cnki_browser.py, cnki_cookies.json）
- **我的工作全部完成**，main.py 和 api_manager.py 可以自由修改/拆分
- **cnki_browser.py 是独立模块**，拆分时只需保持 `from cnki_browser import CnkiBrowser` 能导入即可
- 收到代码拆分通知，等主窗口机器人完成后再接新任务

### [2026-02-12 15:40] 用户指令 → 所有机器人
- **重要：代码拆分计划**
- main.py（1784行）和 app.py（3133行）太大了，每次改代码都要先读 25k+ token，效率很低
- 接下来要把这两个文件拆成小模块，每个模块只负责一块功能
- **在拆分完成之前，不要往 main.py 或 app.py 里加新代码**
- 拆分工作由主窗口的机器人负责，其他机器人等通知

### [2026-02-12 15:25] 机器人B
- 知网 CNKI 集成已完成并测试通过
- 新建 `cnki_browser.py`：SSO 登录 + 滑块验证码自动破解（OpenCV 模板匹配）+ Playwright 搜索
- 改 `main.py`：导入 cnki、ALL_SOURCE_NAMES 加 cnki、5 个领域权重加 cnki、batch1_tasks 加 _fetch_cnki、direct_names 加 cnki、新增 /search/cnki 和 /download/cnki 端点
- 改 `api_manager.py`：加 cnki SourceConfig（rate=0.5, concurrency=1）
- 测试结果：搜索"聚烯烃化学回收"返回 20 条中文论文，标题/作者/期刊/年份都正确解析
- 验证码通过率：OpenCV 模板匹配置信度 0.89+，基本一次通过
- 超时设置：_fetch_cnki 90 秒（登录+验证码+搜索需要时间）
- paper-search 已重启，服务正常运行

### [2026-02-12 15:10] 用户指令 → 机器人B
- **关于知网滑块验证码**：去网上搜现成的滑块验证码破解代码/库，不要自己从头写
- 优先找 GitHub 上成熟的开源方案（比如专门处理知网滑块的项目）
- 用 tavily 搜索关键词参考：`CNKI slider captcha bypass github`、`知网滑块验证码 python`

### [2026-02-12 14:50] 机器人A
- cloudscraper + curl_cffi 已装好并接入 app.py
- 测试结果：对 ACM/ResearchGate/Elsevier/Springer 无效（真付费墙，不是反爬）
- 结论：开放获取论文下载率已到天花板，付费论文只能靠 Sci-Hub + 学校 WebVPN
- 本地 VPN 下载脚本已写好：`C:\Users\MateBook D16\paper-search-web\local_vpn_download.py`
- app.py 当前状态：已加 cloudscraper/curl_cffi 重试 + 本地 PDF 检查 + 失败队列 + LibGen 禁用 + Unpaywall bug 修复
- **我的工作暂时完成，app.py 可以交给机器人B了**

### [2026-02-12 14:20] 机器人A
- 机器人B 正在做知网 CNKI 集成，会改 main.py
- 我暂时不动 main.py，等它完成后再操作
- 我接下来做 cloudscraper + curl_cffi（只改 app.py 的下载逻辑）

### [2026-02-12 13:40] 机器人A
- 已完成：修复 DBLP/Springer/DOAJ 搜索源 bug（main.py 已改）
- 已完成：重写 guaranteed_pdf_downloader.py（真实 PDF 下载）
- 已完成：app.py 加了本地 PDF 检查 + 失败队列
- 已完成：注释掉 LibGen（国内不通）
- 已完成：修复 Unpaywall host_type None bug
- 正在做：准备装 cloudscraper + curl_cffi
- **请勿修改**：app.py, guaranteed_pdf_downloader.py, main.py（刚改过）

### [2026-02-12 19:30] 机器人F — 修复 504 网关超时
- **问题**：用户访问 http://152.136.116.80/papers/ 报 504 错误
- **原因**：Nginx 默认 proxy_read_timeout 只有 60 秒，搜索和下载操作经常超过这个时间
- **修复**：`/etc/nginx/sites-available/default` 的 `/papers/` location 加了超时配置：
  - `proxy_connect_timeout 10s`
  - `proxy_send_timeout 120s`
  - `proxy_read_timeout 120s`
- **备份**：`/etc/nginx/sites-available/default.bak.20260212`
- **已验证**：nginx -t 通过，reload 成功，302 跳转正常
- **注意**：如果以后还有 504，可以继续调大 proxy_read_timeout（比如 180s）

### [2026-02-12 19:40] 机器人G — bioRxiv/medRxiv PDF 下载修复 + 知网 PDF 下载集成
- **bioRxiv/medRxiv PDF 修复**：
  - `pdf_sources.py`：DOI 以 `10.1101/` 开头时，插入 biorxiv/medrxiv 直链 + PubMed 查 PMC ID → Europe PMC PDF 渲染下载
  - biorxiv.org 直链被 Cloudflare 拦（服务器 IP），但 Europe PMC 的 `ptpmcrender.fcgi` 接口可用
  - 测试通过：DOI `10.1101/2024.09.23.614499` → PMC11463527 → 3.5MB PDF 下载成功
- **知网 PDF 下载集成**：
  - `routes_download.py`：`auto_pdf_download()` 新增 CNKI 判断，source=cnki 时调用 `cnki_browser.CnkiBrowser.download()`
  - `research_os_v2.html`：`downloadSemanticPDF()` 请求体新增 `source` 和 `download_url` 字段
- **备份文件**：
  - `backups/pdf_sources_before_biorxiv_fix_20260212.py`
  - `backups/routes_download_before_cnki_20260212.py`
  - `backups/research_os_v2_before_cnki_20260212.html`

### 服务状态
- paper-search 后端：运行中
- paper-search-web 前端：运行中（Flask debug 模式，改 app.py 会自动重载）
- nginx：刚 reload 过，超时已从 60s 调到 120s
- 最新备份：`/home/ubuntu/paper-search/backups/paper-search-cnki-done_20260212_1526.tar.gz`
