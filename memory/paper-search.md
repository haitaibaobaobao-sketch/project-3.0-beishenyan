# 论文多源检索系统（Paper Search v2）

## 架构概览

- **访问地址**：http://152.136.116.80/papers/
- **Nginx 代理**：`/papers/` → `127.0.0.1:8080`
- **systemd 服务**：`paper-search.service`（后端）+ `paper-search-web.service`（前端）

### 后端（FastAPI，端口 8000，`/home/ubuntu/paper-search/`）
2026-02-12 从单文件 main.py（1784行）拆分为 9 个模块：

| 文件 | 行数 | 职责 |
|------|------|------|
| main.py | 250 | FastAPI 入口、路由注册 |
| constants.py | 100 | 源名列表、领域权重 |
| constitution.py | 80 | 宪法配置（不可变规则） |
| translate.py | 70 | 中英文翻译 |
| scoring.py | 180 | 论文评分排序 |
| fetchers_direct.py | 500 | 直接 API 数据源 |
| fetchers_indirect.py | 70 | OpenAlex 间接源 |
| pipeline.py | 280 | 搜索管线（并发调度） |
| funder.py | 90 | CrossRef 基金搜索 |

- 旧单文件备份：`main_old_monolith.py`

### 前端（Flask，端口 8080，`/home/ubuntu/paper-search-web/`）
2026-02-12 从单文件 app.py（3133行）拆分为 11 个模块（Flask Blueprint）：

| 文件 | 行数 | 职责 |
|------|------|------|
| app.py | 88 | Flask 入口、认证、页面路由 |
| journal_quality.py | 92 | 期刊质量评估（OpenAlex） |
| pdf_utils.py | 52 | PDF 文件工具、失败队列 |
| doi_verify.py | 281 | DOI 验证和精确获取 |
| pdf_sources.py | 334 | Sci-Hub/Unpaywall 等下载源 |
| helpers.py | 469 | 辅助函数（摘要、健康检查等） |
| routes_search.py | 289 | 搜索路由（7个） |
| routes_doi.py | 421 | DOI/PDF 下载路由（4个） |
| routes_download.py | 467 | 主下载路由（3个） |
| routes_download_extra.py | 473 | 额外下载路由（5个） |
| routes_status.py | 241 | 状态/统计路由（10个） |

- 旧单文件备份：`backups/app_before_split_20260212.py`
- **改某个功能只需读对应模块**，不用再吃整个大文件的 token

### 其他文件
- **API 管理器**：`/home/ubuntu/paper-search/api_manager.py`
- **知网模块**：`/home/ubuntu/paper-search/cnki_browser.py`（独立，`from cnki_browser import CnkiBrowser`）
- **PDF 下载器**：`/home/ubuntu/paper-search-web/guaranteed_pdf_downloader.py`

## 备份位置

- 后端拆分前单文件：`/home/ubuntu/paper-search/main_old_monolith.py`
- 前端拆分前单文件：`/home/ubuntu/paper-search-web/backups/app_before_split_20260212.py`
- 后端备份（CNKI完成后）：`/home/ubuntu/paper-search/backups/paper-search-cnki-done_20260212_1526.tar.gz`
- 前端备份（全部功能完成后）：`/home/ubuntu/paper-search-web/backups/app_all_features_20260212.py`

## 23 个数据源状态（2026-02-12 更新）

### 直接 API（15 个）
| 源 | 状态 | API Key | 限速 |
|---|---|---|---|
| AI4Scholar | ✅ | `sk-user-8ac6f15827ffc6ac0e05963348bb4b2df9b144f8222ffc1c`（另一个 `sk-user-eed24e45fbde32ba5f4b23a1966a7d705ed1246f6f60880c` 在前端用） | 1积分/次，付费 |
| arXiv | ✅ | 不需要 | 1次/3秒 |
| CrossRef | ✅ | 不需要 | 礼貌池（加 mailto） |
| OpenAlex | ✅ | 不需要 | 10次/秒 |
| Semantic Scholar | ✅ 但常被限速 | **已申请，等审批** | 无Key:100次/5分钟，有Key:1000次/5分钟 |
| PubMed | ✅ | 不需要 | 3次/秒 |
| DOAJ | ✅ 已配置 | `5755ae6dcd4b4ba2aa71a19b0075fb48`（账户ID: ab0ddd9e，限速 2次/秒，API 文档：https://doaj.org/api/v4/docs） |
| DBLP | ✅ | 不需要 | 无硬限制（仅计算机科学） |
| CORE | ✅ | `ocMRrh6wlSXfiGUE4gQuLsT5YAN07xdq` | v3 API |
| Google Scholar | ✅ | Serper `b9c9eb452e61769d44c214a4786072e8038f4aed` | 2500次/月免费 |
| PLOS ONE | ✅ | 不需要（`api.plos.org/search`） | 无硬限制（2026-02-12 升级） |
| ACM | ✅ | 不需要（CrossRef member_id=320） | 同 CrossRef（2026-02-12 升级） |
| BioMed Central | ✅ | Springer OA `35f5ca293624e56304eb939e67dd4862` | 同 Springer（2026-02-12 升级） |
| bioRxiv | ✅ | 不需要（Europe PMC API） | 无硬限制（2026-02-12 新增） |
| medRxiv | ✅ | 不需要（Europe PMC API） | 无硬限制（2026-02-12 新增） |

### 知网 CNKI（第 16 个直接源）
| 源 | 状态 | 说明 |
|---|---|---|
| 知网 CNKI | ✅ 搜索可用，❌ 下载待实现 | 通过学校 WebVPN，Playwright 登录 + httpx 搜索 |

### 间接覆盖（通过 OpenAlex publisher ID 过滤，6 个）
| 源 | OpenAlex Publisher ID | 状态 |
|---|---|---|
| IEEE | p4310320990 | ✅ |
| ScienceDirect (Elsevier) | p4310319965 | ✅ |
| Wiley | p4310320256 | ✅ |
| Nature | p4310319908 | ✅ |
| Science (AAAS) | p4310315823 | ✅ |
| Springer | p4310319908 | ✅ |

### 未覆盖（2 个）
| 源 | 原因 |
|---|---|
| JSTOR | 无公开搜索 API |
| ResearchGate | 无 API，反爬严格 |

## API Key 状态

| Key | 状态 | 值 |
|-----|------|-----|
| Springer Nature Meta API | ✅ 已配置 | `811091543830a8ede94f3b9b30b2e0f4`（Meta v2，10.9万篇） |
| Springer Nature OpenAccess | ✅ 已配置 | `35f5ca293624e56304eb939e67dd4862`（BioMed Central 真源已启用） |
| OpenAlex | ✅ 已配置 | `FxEd8g2qbI61awFwZ27ngf` |
| PubMed NCBI | ✅ 已配置 | `9435ec0dd20832d51a983a94676808beae08`（3→10次/秒） |
| Semantic Scholar | ⏳ 已申请，等审批 | https://www.semanticscholar.org/product/api#api-key-form |
| CORE | ✅ 已配置 | `ocMRrh6wlSXfiGUE4gQuLsT5YAN07xdq`（v3 API，8.8万篇） |
| Serper (Google Scholar) | ✅ 已配置 | `b9c9eb452e61769d44c214a4786072e8038f4aed`（2500次/月免费） |
| Materials Project | ✅ 有Key未接入 | `19TQFWEMMQufp2BmII4rPySMqgHg1sSz` |
| AI4Scholar | ⏳ 待充值 | https://ai4scholar.net/pricing |

### Springer 双重保险已实现
- `_fetch_springer_direct()` — 直接调 Springer OpenAccess API（source="springer_direct"）
- OpenAlex publisher_lineage:p4310319908 — 间接覆盖（source="springer"）
- 前端映射：springer_direct → springer，两者合并计数
- 注意：abstract 字段是 dict 格式 `{'h1':'Abstract','p':'...'}`，已做特殊处理

## API 管理器功能（api_manager.py）

- **令牌桶限速器**：每源独立，控制每秒最大请求数
- **信号量并发控制**：限制每源最大并发连接数
- **指数退避重试**：429/5xx 自动重试，带随机抖动
- **多 API Key 轮换**：自动跳过被限速的 Key
- **随机 User-Agent**：8 个 UA 随机轮换
- **内存缓存**：TTL 600 秒，最大 1000 条
- **随机请求间隔**：防止单 IP 爆发请求

## 关键接口

- `GET /search/meta?q=xxx&limit=5` — 21 源聚合搜索
- `GET /search/gaps?q=xxx&limit=5` — 搜索 + 缺失诊断
- `GET /health` — 健康检查（version 2.1）
- `GET /system/api-stats` — API 调用统计
- `POST /api/enhanced-search` — 前端调用的接口（8080 端口，内部调 8000）

## 前端源名映射

后端 `source` 字段 → 前端卡片名：
```
ai4scholar → ai4scholar
arxiv → arxiv
crossref → crossref
openalex → openalex
semantic_scholar → semantic
pubmed → pubmed
ieee → ieee
springer → springer
sciencedirect → sciencedirect
wiley → wiley
nature → nature
science → science
doaj → doaj
core → core
acm → acm
jstor → jstor
biomedcentral → biomedcentral
plosone → plosone
dblp → dblp
researchgate → researchgate
biorxiv → bioRxiv
medrxiv → medRxiv
google_scholar → google_scholar
```

## 元数据级联补全逻辑

缺 DOI → CrossRef 按标题模糊搜索（Jaccard 3-gram 相似度 > 0.6）
缺摘要 → Semantic Scholar 按标题搜索
缺作者/期刊/引用数 → 同上两个源补全
全部失败 → 才返回空

## 常见问题

### 后端启动失败
```bash
sudo journalctl -u paper-search --since '1 min ago' | tail -20
# 常见：SyntaxError（f-string 引号问题）、NameError（变量名不一致）
```

### 前端进程挂了
```bash
cd /home/ubuntu/paper-search-web && nohup python3 app.py > app.log 2>&1 &
# Flask debug 模式，改了 app.py 会自动重载
```

### Semantic Scholar 429 限速
- 当前无 Key，100 次/5 分钟
- 已加延迟重试（最多 3 次，每次等 2*attempt 秒）
- 已申请免费 Key，等审批通过后在 `_fetch_semantic_scholar` 请求头加 `x-api-key`

### Unpaywall 邮箱（2026-02-11 修复）
- Unpaywall API 要求真实邮箱，假邮箱返回 422
- `main.py` 2 处 + `app.py` 5 处的 `research@example.com` 已全部换成 `haitaibaobaobao@gmail.com`
- 用户另一个邮箱：`shijianyishujia@qq.com`

### Google Scholar 接入细节（2026-02-11）
- 通过 Serper.dev 代理，`POST https://google.serper.dev/scholar`
- 请求头：`X-API-KEY: <key>`，body：`{"q": "xxx", "num": limit}`
- 返回字段：title, link, publicationInfo, snippet, year, citedBy, pdfUrl
- 注意：结果没有 DOI，系统通过 CrossRef 级联补全
- 函数位置：`main.py` 第 551 行 `_fetch_google_scholar()`
- 在 `batch1_tasks` 中与其他直接源并行调用
- Serper 管理页面：https://serper.dev

### 搜索超时
- 后端 httpx 超时：35 秒
- 前端调后端超时：80 秒
- 间接源（9 个 OpenAlex 查询）并行执行，加 0.3 秒延迟

## 待参考方案：机构代理入口模式（来自 858611.com）

> 仅记录思路，尚未应用，不改代码。

### 平台概述
- 网址：www.858611.com
- 教程：https://www.yuque.com/docs/share/61a7cbbd-053c-4754-b956-094a023a386a
- 本质：付费的文献下载聚合平台，通过共享高校/机构的图书馆权限，让用户以低成本访问知网、万方、维普等付费数据库
- 登录方式：卡号 + 密码（一人一号，仅限登录本站）

### 核心思路
1. **多入口轮换**：同一个数据库提供多个入口（每个入口对应不同机构的权限），一个挂了换下一个
2. **中文数据库覆盖**：知网（有检索1和检索2两个入口，内容不完全相同）、万方、维普、读秀/超星
3. **英文文献两条路**：
   - 路径A：平台自带的"综合下载"入口（机构代理访问 Elsevier/Wiley/Springer 等）
   - 路径B：百度学术查 DOI → Sci-Hub 下载（2021年前的文献 Sci-Hub 基本都有）
4. **特殊数据库单独处理**：
   - 中华医学会 → 走万方医学入口
   - Embase → 需注册个人账号才能导出
   - Cochrane → Trials 用平台入口导出，其他内容到官网免费导出
5. **浏览器适配**：部分入口只支持搜狗浏览器（机构认证方式依赖特定浏览器特性）

### 对我们系统的潜在启发
- **中文数据库缺口**：我们目前 20 源全是英文为主，知网/万方/维普完全没覆盖，858611 的思路说明中文文献检索需求很大
- **多入口容错**：他们的"入口挂了就换下一个"和我们 API 管理器的"多 Key 轮换 + 重试"思路类似，但他们是入口级别的切换
- **Sci-Hub 兜底**：对于有 DOI 的文献，Sci-Hub 是一个免费的全文获取兜底方案（法律灰色地带，仅记录不推荐）
- **元数据 vs 全文**：我们系统目前只做元数据检索（标题、摘要、DOI），858611 解决的是全文下载问题，两者定位不同但可以互补

## 知网 CNKI 集成（WebVPN 双模方案）— 实施中

> 2026-02-11 头脑风暴，2026-02-12 验证通过，开始实施。

### 学校 WebVPN 信息

- **学校**：大庆师范学院
- **WebVPN 地址**：http://webvpn.dqsy.net/login
- **登录方式**：统一身份认证（学号+密码），教务系统里有入口链接
- **学号**：`2503010110104`
- **密码**：`275223`
- **登录页面**：无验证码，只需用户名+密码
- **URL 改写规则**（已验证）：
  - 把域名的 `.` 换成 `-`
  - 末尾加端口号：HTTPS → `-443`，HTTP → `-80`
  - 拼上 `.webvpn.dqsy.net`
  - 示例：`https://www.cnki.net/xxx` → `http://www-cnki-net-443.webvpn.dqsy.net/xxx`
  - 示例：`https://kns.cnki.net/search` → `http://kns-cnki-net-443.webvpn.dqsy.net/search`
  - 示例：`http://g.wanfangdata.com.cn/` → `http://g-wanfangdata-com-cn-80.webvpn.dqsy.net/`

### 学校已购数据库

| 数据库 | 状态 | 账号信息 |
|--------|------|----------|
| 知网 CNKI | ✅ 已购 | 机构账号 `ka2007` / `cnkikw` |
| 读秀学术搜索 | ✅ 已购 | `jsdfhsjafh11` / `ZbB3eeXm^` |
| 超星电子图书 | ✅ 已购 | `dqsfxy` / `dqsf@0316` |
| 百度文库高校版 | ✅ 有 | 邀请码 `K7THDNVH` |
| 万方 | ❌ 已过期 | WebVPN 能打开页面但提示"机构账号已过期"，无法使用 |
| 维普 | ❌ 未购买 | WebVPN 验证：所有维普域名均跳回首页，确认学校未购买 |

### 三层架构设计（已更新为双模方案，2026-02-12）

> 原三层架构已废弃，改为以下双模自动化方案。

**登录层（Playwright，两个方案共用）**
1. Playwright 打开 `http://portal.dqnu.edu.cn/user/simpleSSOLogin`
2. 填学号 `2503010110104` + 密码 `275223` → 登录
3. 点 menu → 点 VPN → 等待跳转到 `webvpn.dqsy.net`
4. 关掉微信二维码弹窗
5. 提取所有 cookie 保存到文件
6. 关闭浏览器（释放内存）

**方案 A（主力）— HTTP 请求模式**
- 用保存的 cookie + httpx 发请求
- 搜索：GET `kns-cnki-net-443.webvpn.dqsy.net/kns8s/defaultresult/index` → 解析 HTML 表格
- 下载：GET `bar-cnki-net-443.webvpn.dqsy.net/bar/download/order?id=...` → 直接拿 PDF
- 优点：轻量、快速、省内存
- 缺点：如果知网加了 JS 反爬或验证码就不行

**方案 B（备用）— Playwright 全程模式**
- 不关浏览器，搜索和下载都用无头浏览器操作
- 搜索：Playwright 填搜索框 → 点检索 → 解析页面
- 下载：Playwright 点下载链接 → 监听下载事件 → 保存 PDF
- 优点：更像真人，不怕反爬
- 缺点：吃内存（200-300MB），速度慢

**自动切换逻辑**
- 默认用方案 A
- 方案 A 请求返回非 200 或被重定向到登录页 → 先尝试刷新 cookie
- 刷新 cookie 后仍失败 → 自动切换到方案 B
- cookie 过期检测：请求前检查 cookie 文件时间戳，超过 N 小时就重新登录

**新增后端文件**
- `/home/ubuntu/paper-search/cnki_browser.py` — 知网浏览器模块（登录、搜索、下载、cookie 管理）
- `main.py` 新增 `/search/cnki` 接口（搜索）和 `/download/cnki` 接口（下载）

**服务器环境**
- 内存：1.9G（可用 ~800M），方案 A 够用，方案 B 勉强够（同时只跑 1 个浏览器实例）
- 已装：Playwright 1.58.0 + playwright-stealth（系统 Python 3.10）
- CPU：2 核，磁盘：16G 可用

### 已验证的完整登录链路（2026-02-12）

1. 访问 `http://portal.dqnu.edu.cn/user/simpleSSOLogin` → 跳转到 `auths.dqnu.edu.cn/sso/login`（统一身份认证）
2. 输入学号 `2503010110104` + 密码 `275223` → 进入信息门户 `portal.dqnu.edu.cn/web/guest`
3. 点左上角 menu → 点 VPN → 新标签页打开 `webvpn.dqsy.net`（SSO 自动登录，不用再输密码）
4. 关掉微信二维码弹窗（每次登录都会弹）
5. **注意**：直接访问 `webvpn.dqsy.net/login` 用学号密码登录会失败（"用户名或密码错误"），必须走统一身份认证 SSO

### 已验证的知网搜索和下载（2026-02-12）

- **搜索页**：`http://kns-cnki-net-443.webvpn.dqsy.net/kns8s/defaultresult/index`
- **搜索页无验证码**（验证码只在知网首页 `www-cnki-net-443.webvpn.dqsy.net` 弹出）
- **机构权限已生效**：页面显示"大庆师范学院"
- **下载链接格式**：`http://bar-cnki-net-443.webvpn.dqsy.net/bar/download/order?id=...`（直接 URL）
- **搜索结果字段**：标题、作者、期刊/学校、发表时间、数据库类型（期刊/硕士/博士/图书）、被引次数、下载次数
- **详情页链接格式**：`http://kns-cnki-net-443.webvpn.dqsy.net/kcms2/article/abstract?v=...&uniplatform=NZKPT&language=CHS`
- **测试搜索**："聚烯烃化学回收" → 45 条结果，20 条/页

### 待验证事项

1. ~~万方和维普在 WebVPN 里能不能用~~（万方已过期，维普未购买，已确认）
2. ~~知网论文详情页和下载链接在 WebVPN 下的完整 URL 格式~~（已验证）
3. WebVPN 的 session 有效期多长（决定多久要重新登录一次）— 实施时测试
4. ~~直接用学号密码能否登录 webvpn.dqsy.net~~（不能，必须走 SSO）
5. ~~知网搜索结果页里论文链接的提取方式~~（已验证，HTML 表格结构清晰）
6. 下载链接点击后是否直接返回 PDF（还是需要额外操作）— 实施时测试

### 实施计划（2026-02-12）

**步骤 1：备份现有代码**
- `cp main.py backups/main_before_cnki_20260212.py`
- `cp app.py backups/app_before_cnki_20260212.py`

**步骤 2：新建 `/home/ubuntu/paper-search/cnki_browser.py`**
- `CnkiBrowser` 类，包含：
  - `login()` — Playwright SSO 登录，提取 cookie 保存到文件
  - `_ensure_cookie()` — 检查 cookie 是否过期，过期则重新登录
  - `search(query, limit)` — 方案 A：httpx + cookie 搜索知网，解析 HTML 返回论文列表
  - `search_browser(query, limit)` — 方案 B：Playwright 全程搜索（备用）
  - `download(paper_id)` — 方案 A：httpx + cookie 下载 PDF
  - `download_browser(paper_id)` — 方案 B：Playwright 下载（备用）
  - 自动切换：A 失败 → 刷新 cookie → 再失败 → 切 B

**步骤 3：改 `main.py` 加接口**
- `GET /search/cnki?q=关键词&limit=20` — 知网搜索
- `GET /download/cnki?id=论文ID` — 知网下载 PDF
- 知网结果也纳入 `/search/meta` 聚合搜索（作为第 22 个源）

**步骤 4：改前端展示**
- 前端源名映射加 `cnki`
- 搜索结果卡片支持知网论文（中文标题、期刊、学位论文类型等）
- 下载按钮调 `/download/cnki` 接口

**步骤 5：测试**
- 测试登录 → 搜索 → 下载完整链路
- 测试 cookie 过期后自动重新登录
- 测试方案 A → B 自动切换

## 头脑风暴记录（2026-02-11 晚）→ 2026-02-12 已实施

### 1. 领域划分 + 权重分配 + 评分排序 ✅ 已实现（2026-02-12 全面重构）
- AI（Claude Sonnet）判断学科：chemistry_materials / computer_science / biomedical / physics / general
- `DOMAIN_SOURCE_WEIGHTS` 字典：5 个领域 × 19 个源，每个 0-10 权重
- `_get_source_limit()` 根据权重分配检索数量（权重10=3x，权重1=0.5x）

#### 新评分体系（总分100分，两层协作）

| 维度 | 满分 | 计算位置 | 函数 |
|------|------|---------|------|
| 相关度 | 35 | 后端 | `_title_relevance()`(15) + `_abstract_relevance()`(15) + `_keyword_coverage()`(5) |
| 期刊质量 | 25 | 前端 | `_journal_quality_score()` — Q1=25, Q2=18, Q3=12, Q4=6, 未知=8, 预印本=10 |
| 引用影响力 | 20 | 后端 | `_batch_normalize_citations()` — 年均引用对数缩放 + 批内百分位归一化 |
| 时效性 | 10 | 后端 | `_recency_score()` — ≤1年=10, 2-3年=8, 4-5年=6, 6-10年=4, >10年=2 |
| 数据完整度 | 10 | 后端 | `_completeness_score()` — 摘要(3)+DOI(3)+作者(2)+期刊名(1)+年份(1) |

#### 期刊分区推算（前端 app.py）
- `_batch_fetch_journal_data()` — 批量查 OpenAlex sources API（h_index + 2yr_mean_citedness）
- `_estimate_quartile()` — 综合分 = h_norm×60% + c_norm×40%，≥55→Q1, ≥35→Q2, ≥18→Q3, <18→Q4
- 本地文件缓存 `journal_cache.json`（24小时TTL）
- `_norm()` 新增 `source_id`、`source_type` 字段（OpenAlex 提取 `primary_location.source.id/type`）

#### 前端展示改造（research_os_v2.html）
- 论文卡片：5个彩色进度条（蓝=相关度、金=期刊、绿=引用、橙=时效、灰=完整度）
- 期刊名旁显示分区标签（Q1金色、Q2银色、Q3铜色、Q4灰色）
- 顶部排序切换按钮：综合/相关度/期刊/引用/最新
- `resortPapers()` 前端排序函数，后端也支持 `sort_by` 参数

#### 备份
- 后端：`/home/ubuntu/paper-search/backups/main.py.bak_scoring_20260212_*`
- 前端：`/home/ubuntu/paper-search-web/app.py.bak_scoring_20260212_*`
- HTML：`/home/ubuntu/paper-search-web/research_os_v2.html.bak_scoring_20260212_*`

### 2. Sci-Hub 自动下载 ✅ 已实现（方案 A 后端代理）
- `_download_from_scihub(doi)` 辅助函数，在 app.py 中
- 当前可用镜像：sci-hub.in（最稳，走 sci.bban.top）、sci-hub.ren、sci-hub.ee
- 已废弃：sci-hub.se（DNS失败）、sci-hub.st（403）、sci-hub.ru（超时）
- 改动函数：auto_pdf_download、batch_auto_download、auto_download_to_desktop
- 前端备用跳转链接也已更新
- 备份：`/home/ubuntu/paper-search-web/backups/app_before_scihub_20260211.py`

### 3. 中英文自动互译搜索 ✅ 已实现
- `_has_chinese()` 检测中文，`_translate_to_english()` 调 Claude Sonnet 翻译
- 翻译 API：`http://43.160.240.127:8000/v1`，Key：`sk-4a612402d07b2a81257d112d64844c9a18d464e206464e75`
- 中文搜 AI4Scholar/CrossRef/OpenAlex/Google Scholar，英文搜全部 21 源
- API 返回新增：`translated_query` 字段

### 4. CrossRef 基金资助搜索 ✅ 已实现
- `GET /search/funders?q=基金名&limit=5` — 搜基金机构
- `GET /search/funder-papers?funder=基金DOI&q=关键词&limit=20` — 按基金搜论文
- 返回含 `funders` 数组（name, doi, award）

### 5. Materials Project ⏳ 待解封
- 服务器 IP 被 MP 封禁，需发邮件 support@materialsproject.org 申请解封
- 解封后再接入

### 6. 下载系统完善 ✅ 已实现
- LibGen/iDesci 从服务器不通，改为前端跳转（用户本地 VPN 下载）
- 前端备用链接已更新为能用的镜像

## 反爬虫/机器人检测 解决方案（2026-02-12 调研）

### 问题描述
除了有公开 API 可以直接调用的数据源以外，其他需要访问网页的源（如 Google Scholar 网页版、部分出版商页面等）经常返回"你是机器人"或 Cloudflare 验证页面。根本原因：服务器 IP（152.136.116.80）是腾讯云数据中心 IP，天然被网站怀疑为爬虫。

### 方案一：cloudscraper 替换 requests（免费，改动最小）⭐ 优先尝试
- **库**：`cloudscraper`（GitHub 6.1k 星，MIT 协议）
- **原理**：自动处理 Cloudflare 的 JS 挑战，用法几乎和 requests 一样
- **安装**：`pip install cloudscraper -i https://pypi.tuna.tsinghua.edu.cn/simple`
- **用法**：`scraper = cloudscraper.create_scraper()` 然后 `scraper.get(url)` 替代 `requests.get(url)`
- **支持**：Cloudflare v1/v2/v3 挑战、隐身模式、代理轮换
- **局限**：对高级 Cloudflare 保护（Turnstile 验证码）可能不够
- **配合措施**：
  - 随机延迟 1-3 秒（已有 api_manager.py 的随机间隔）
  - UA 轮换（已有）
  - 加 Referer 头（模拟从搜索引擎跳转）

### 方案二：FlareSolverr 反向代理（免费，自建服务）
- **项目**：https://github.com/FlareSolverr/FlareSolverr
- **原理**：启动一个代理服务，用真正的 Chrome 浏览器过 Cloudflare 验证，把 cookie 返回给调用方
- **部署方式**：
  - Docker：`docker run -p 8191:8191 ghcr.io/flaresolverr/flaresolverr:latest`
  - 或源码安装：Python 3.13 + Chrome/Chromium + `pip install -r requirements.txt`
- **调用方式**：POST `http://localhost:8191/v1` 发 JSON 请求
- **优点**：免费、开源、可自建
- **缺点**：每个请求开一个浏览器实例，吃内存（服务器只有 1.9G RAM，可能扛不住）
- **注意**：2025 年底 FlareSolverr 官方承认对最新 Cloudflare 有时会失败，但对一般网站够用

### 方案三：住宅代理 IP（付费，效果最好）
- **原理**：通过真实家庭宽带 IP 发请求，网站不会怀疑是机器人
- **服务商**：
  - Bright Data（大牌，贵）
  - Oxylabs（大牌，贵）
  - 站大爷 / 快代理（国内，便宜些，几十到几百/月）
- **接入方式**：在 httpx/requests 里设置 proxy 参数即可
- **优点**：效果最好，几乎不会被拦
- **缺点**：要花钱，按流量或按 IP 数计费

### 方案四：反检测浏览器工具（免费，技术难度中等）
- **Camoufox**：基于 Firefox 魔改的反检测浏览器，专门设计来不被识别
  - 安装：`pip install camoufox`
  - 2025-2026 年活跃维护
- **SeleniumBase UC Mode**：自带绕过验证码功能
  - 安装：`pip install seleniumbase`
  - 用法：`Driver(uc=True)` 即可
- **原理**：模拟完全像真人的浏览器指纹（TLS 指纹、JS 环境、鼠标移动等）
- **缺点**：比纯 HTTP 请求慢，吃内存

### 方案五：TLS/浏览器指纹伪装 — curl_cffi（免费）
- **库**：`curl_cffi`
- **原理**：很多网站不光看 User-Agent，还看 TLS 握手特征（JA3 指纹）。普通 Python requests 的 TLS 指纹一眼就能看出是机器。curl_cffi 能模拟真实浏览器的 TLS 指纹
- **安装**：`pip install curl_cffi -i https://pypi.tuna.tsinghua.edu.cn/simple`
- **用法**：`from curl_cffi import requests; requests.get(url, impersonate="chrome")`
- **优点**：轻量，不需要开浏览器，比 cloudscraper 更底层
- **可以和方案一叠加使用**

### 实施建议（优先级排序）
1. **先试方案一**（cloudscraper）— 改动最小，可能就够了
2. **叠加方案五**（curl_cffi）— TLS 指纹伪装，和方案一互补
3. **不够加方案二**（FlareSolverr）— 三个配合用
4. **还不行考虑方案三**（住宅代理）— 花钱但效果最好
5. 方案四作为特殊场景备用（比如知网 WebVPN 登录已经在用 Playwright）

### 当前状态：⏳ 已调研，待实施

---

## 数据源升级计划：把"假源"变"真源"（2026-02-12 调研）

### 问题描述
21 个数据源中，9 个是通过 OpenAlex 按出版商 ID 过滤的"间接源"。这些源的搜索质量受限于 OpenAlex 的收录范围和搜索算法，和直接去对应网站搜的结果有差异，经常返回 0 条结果。

### 各源 API 可用性调查

| 源 | 有自己的 API？ | 能直接接？ | 具体方案 | 状态 |
|---|---|---|---|---|
| IEEE Xplore | ✅ 有，免费申请 Key | ✅ 可以 | 注册 https://developer.ieee.org 拿 Key，200 条/次，支持 title/abstract/keyword 搜索 | ⏳ 待注册 |
| ScienceDirect/Scopus | ✅ 有（Scopus API） | ✅ 可以试 | 用学校邮箱在 https://dev.elsevier.com 注册，拿 API Key + 机构 Token。Scopus 覆盖 Elsevier 全部论文元数据 | ⏳ 待注册 |
| Wiley | ❌ 没有搜索 API | ❌ 不能 | 只有 TDM（文本挖掘）接口，需机构订阅。继续走 OpenAlex 或 CrossRef | 维持现状 |
| Nature | ✅ 已被 Springer API 覆盖 | ✅ 已覆盖 | Springer Meta API 包含 Nature 论文，不需要额外接 | ✅ 已有 |
| Science (AAAS) | ❌ 没有公开 API | ❌ 不能 | 继续走 OpenAlex | 维持现状 |
| ACM | ❌ 没有公开 API | ⚠️ 间接可以 | 通过 CrossRef member_id=320 搜 ACM 论文，比 OpenAlex 更全。注意：2026年1月起 ACM 已转为完全开放获取 | ✅ 已升级（2026-02-12） |
| BioMed Central | ✅ 已被 Springer OpenAccess API 覆盖 | ✅ 已覆盖 | Springer OpenAccess API（已有 Key `35f5ca293624e56304eb939e67dd4862`）包含 BMC 全部 OA 论文 | ✅ 已升级（2026-02-12） |
| PLOS ONE | ✅ 有，完全免费 | ✅ 可以 | API: `https://api.plos.org/search`，不需要 Key，直接调，返回 JSON | ✅ 已升级（2026-02-12） |
| Springer | ✅ 已有直接 API | ✅ 已覆盖 | `_fetch_springer_direct()` 已实现 | ✅ 已有 |

### 升级后的源分布

**升级前**：10 真源 + 9 假源（OpenAlex 间接）+ 2 未覆盖 = 21
**2026-02-12 升级后**：13 真源 + 6 假源（IEEE/ScienceDirect/Wiley/Nature/Science/Springer）+ 2 未覆盖 = 21

已升级的 3 个新真源（2026-02-12 完成）：
1. **PLOS ONE** — 免费 API `api.plos.org/search` → `_fetch_plosone()`
2. **ACM via CrossRef** — member_id=320 过滤 → `_fetch_acm()`
3. **BioMed Central** — Springer OpenAccess API → `_fetch_biomedcentral()`
- 备份：`/home/ubuntu/paper-search/backups/main_before_3source_upgrade_20260212.py`
- 完成备份：`/home/ubuntu/paper-search/backups/main_3source_upgrade_done_20260212.py`

待升级的 2 个：
4. **IEEE Xplore** — 免费注册 Key → 写 `_fetch_ieee_direct()`（需 .edu 邮箱，正在申请中）
5. **Scopus/ScienceDirect** — 学校身份注册 → 写 `_fetch_scopus_direct()`

### 实施优先级
1. PLOS ONE（最简单，不需要注册，直接调）
2. ACM via CrossRef（不需要注册，改 CrossRef 查询加 member_id 过滤）
3. IEEE Xplore（需要注册，但免费）
4. Scopus/ScienceDirect（需要学校身份注册，可能有 IP 限制）
5. BioMed Central（已有 Key，改代码启用）

### 综合实施方案（三步走）

**第一步：升级数据源（不花钱，效果最大）**
- 注册 IEEE Xplore API Key
- 用学校邮箱注册 Elsevier/Scopus API
- 加 PLOS ONE 直接 API
- 加 CrossRef ACM 过滤
- 启用 Springer OpenAccess API 覆盖 BMC

**第二步：反爬虫升级（不花钱）**
- 安装 cloudscraper + curl_cffi
- 改 api_manager.py，对不同源用不同请求方式：
  - 有 API 的源 → 继续用 httpx
  - 需要访问网页的源 → 用 cloudscraper + curl_cffi
  - 特别难搞的 → 用 Playwright + stealth
- 加 Referer 头、Cookie 持久化

**第三步：如果还不够（花钱）**
- 买便宜的住宅代理，只给被拦截的源用

### 当前状态：⏳ 全部已调研，待用户决定实施

---

## 当前故障（2026-02-13）

- **论文检索系统打不开**（http://152.136.116.80/papers/）
- **原因**：Gemini 改前端代码时把 Flask 路由前缀搞坏了
  - `/papers/login` 返回 302 跳转到 `/login`（丢了 `/papers/` 前缀）
  - Nginx 只转发 `/papers/` 开头的请求，所以 `/login` 这个路径 Nginx 不认
- **三个服务都正常运行**（paper-search、paper-search-web、nginx）
- **修复方向**：检查 app.py 和 auth.py 里的 redirect 和 url_for，确保跳转都带 `/papers/` 前缀
- **状态**：✅ 已修复（login.html 是空文件，从备份恢复）

### Gemini 代码遗留问题（2026-02-13 探查发现）
1. **auth.py `is_admin` 列不存在**：查询 `is_admin` 列但建表语句里没有这个列，会报错（不影响登录，影响管理员判断）
2. **constants.py cnki 重复 3 次**：ALL_SOURCE_NAMES 里 cnki 出现了 3 次
3. **pipeline.py cnki 未导入**：引用了 `cnki.search()` 但没有 import cnki_browser
4. **wanfang/baidu_scholar 未集成**：fetchers_chinese.py 写好了但 pipeline.py 没调用
5. **权重表不完整**：DOMAIN_SOURCE_WEIGHTS 有 cnki 但没有 wanfang 和 baidu_scholar
6. **proxies.json 已配置 Webshare 10个免费代理**（2026-02-13）
   - 代理格式：`http://user:pass@IP:port`
   - 万方用代理 GET 能拿到 148KB HTML ✅
   - 百度学术不管有没有代理都弹"安全验证" → 必须用 Firefox + stealth
   - 知网不能走海外代理（返回404）→ 必须从国内服务器直连
   - **严禁使用学校相关资源**（WebVPN、学号等），用户明确禁止
7. **中文抓取器修复代码已写好**（2026-02-13，待部署）
   - 本地合并文件：`C:\Users\MateBook D16\paper-search-fix\fetchers_chinese.py`
   - 队友单独文件：`C:\Users\MateBook D16\fix_cnki.py`、`C:\Users\MateBook D16\fix_baidu.py`
   - 万方：HTTP GET + HTML 解析（从 __NUXT__ script 提取 JSON）
   - 知网：Playwright Chromium 直连 + stealth（全局浏览器复用省内存）
   - 百度学术：Playwright Firefox + stealth（先访问首页拿 cookie 再搜索）
   - stealth 用法：`from playwright_stealth import Stealth; Stealth().apply_stealth_async(page)`
   - 部署命令：`scp paper-search-fix/fetchers_chinese.py ubuntu@152.136.116.80:/home/ubuntu/paper-search/fetchers_chinese.py`
   - 部署后还需修 pipeline.py 的 import 和调用
7. **RECAPTCHA_SECRET_KEY 未使用**：app.py 定义了但没代码用它，login.html 用的是自制数学验证码

---

## bioRxiv + medRxiv 新增（2026-02-12 完成）

### 改动文件
| 文件 | 改动 |
|------|------|
| `constants.py` | `ALL_SOURCE_NAMES` 和 `DIRECT_SOURCES` 加了 biorxiv、medrxiv；5 个领域权重都加了（biomedical=9，其他 2-5） |
| `fetchers_direct.py` | 新增 `_fetch_biorxiv()` 和 `_fetch_medrxiv()`，用 Europe PMC API（`https://www.ebi.ac.uk/europepmc/webservices/rest/search`），按 PUBLISHER 过滤 |
| `pipeline.py` | import 加两个函数，`batch1_tasks` 加两个任务，`direct_names` 加两个名字 |
| `routes_search.py` | `SOURCE_DISPLAY_MAP` 加了 `'biorxiv': 'bioRxiv', 'medrxiv': 'medRxiv'` |
| `research_os_v2.html` | 来源卡片加了 bioRxiv/medRxiv；首页文案改为"23个数据库"，列表加了 bioRxiv、medRxiv、知网(CNKI) |

### 备份
- `/home/ubuntu/paper-search/backups/constants_after_biorxiv_medrxiv_20260212.py`
- `/home/ubuntu/paper-search/backups/fetchers_direct_after_biorxiv_medrxiv_20260212.py`
- `/home/ubuntu/paper-search/backups/pipeline_after_biorxiv_medrxiv_20260212.py`
- `/home/ubuntu/paper-search-web/backups/routes_search_after_biorxiv_medrxiv_20260212.py`
- `/home/ubuntu/paper-search-web/backups/research_os_v2_after_biorxiv_medrxiv_20260212.html`

### 测试结果
- 22 个源有结果，bioRxiv 10篇、medRxiv 10篇
- 单篇 PDF 下载成功
- 批量 20 篇：成功 10 篇（50%），失败 10 篇（其中 6 篇 bioRxiv 全挂）

---

## 待办任务（2026-02-12 留给下一个会话）

### 任务一：修复 bioRxiv/medRxiv PDF 下载（优先级高，简单）

**问题**：bioRxiv/medRxiv 是开放获取预印本，PDF 免费可下，但下载模块不认识它们的地址格式，导致 6 篇全部失败。

**修复方案**：改 `/home/ubuntu/paper-search-web/pdf_sources.py` 的 `get_accurate_pdf_sources()` 函数：
- 如果 DOI 以 `10.1101/` 开头，在 PDF 源列表最前面插入：
  - `https://www.biorxiv.org/content/{DOI}v1.full.pdf`
  - `https://www.medrxiv.org/content/{DOI}v1.full.pdf`
- 这两个地址直接返回真 PDF，不需要认证

**验证**：
```bash
curl -sI "https://www.biorxiv.org/content/10.1101/2024.09.23.614499v1.full.pdf" | head -5
# 应返回 200 + content-type: application/pdf
```

### 任务二：知网 PDF 下载（优先级中，复杂）

**问题**：知网搜索已通（`cnki_browser.py`），但 PDF 下载未实现。知网论文没有 DOI，URL 是学校 VPN 代理地址。

**修复思路**：
1. 在 `cnki_browser.py` 加 `download_pdf(article_url)` 方法，复用 VPN cookie
2. 从文章详情页解析下载链接（`bar-cnki-net-443.webvpn.dqsy.net/bar/download/order?id=...`）
3. 在 `routes_download.py` 的 `auto_pdf_download()` 加判断：source 是 cnki 走专用下载
4. 处理 cookie 过期重新登录

---

## 中文源 Selenium 升级（2026-02-14 完成）

### 背景
- 万方改版为 gRPC-Web + SPA，纯 HTTP 请求只拿到空壳 HTML
- 原 Playwright 方案太吃内存（服务器仅 1.9G），且 Playwright 在 pipeline.py 中被禁用
- 用户朋友提供了一个可工作的知网 Selenium 方案（`cnki-search(1).zip`）

### 改动内容
`fetchers_chinese.py` 从 Playwright 全面改为 Selenium + Chrome：
- **全局 Chrome 实例**：三源共用一个 `webdriver.Chrome`，通过 `asyncio.Lock` 串行访问
- **反检测**：`Object.defineProperty(navigator, 'webdriver', {get: () => undefined})`
- **Selenium 同步→异步**：所有操作用 `asyncio.to_thread()` 包装
- **崩溃自愈**：`_get_driver()` 检测 Chrome 是否存活，崩了自动重建

### 三个源状态

| 源 | 状态 | 方案 | 备注 |
|---|---|---|---|
| 万方 | ✅ 正常返回 | Selenium 渲染 SPA，解析 `div.normal-list` | 标题/作者/年份/期刊/摘要/链接/被引数全有 |
| 知网 | ✅ 正常返回 | 从 cnki.net 首页模拟搜索，JS 强制点击绕过联想词遮挡 | 标题/作者/年份/期刊/链接全有 |
| 百度学术 | ❌ 被拦截 | 首页能进，搜索页触发百度安全验证 | 服务器 IP 被百度封，代码无法绕过 |

### 万方 DOM 结构（2026-02-14 探测）
```
div.normal-list.periodical-list
  ├── div.title-area
  │   ├── span.title（标题，含 span.highlight）
  │   └── span.title-id-hidden（论文ID，如 "periodical_szyxsj201906017"，隐藏元素需用 textContent）
  ├── div.author-area
  │   ├── span.essay-type（类型：期刊论文/学位论文等）
  │   ├── span.authors（作者名，多个）
  │   ├── span.periodical-title（期刊名，带《》）
  │   └── span.authors（最后一个可能是 "2019年6期"）
  ├── div.abstract-area（摘要，以"摘要："开头）
  ├── div.keywords-area > span.keywords-list（关键词，多个）
  └── div.stat > .stat-item.quote（被引数，隐藏元素需用 textContent）
```

### 知网搜索流程
1. 访问 `https://www.cnki.net/` 首页
2. 等 2 秒，找 `#txt_SearchText` 输入关键词
3. 等 1 秒，用 JS 隐藏联想词下拉框，再用 `execute_script("arguments[0].click()")` 强制点击搜索按钮
4. 等 4 秒，用 XPath `//a[@class="fz14"]` 获取标题链接
5. 从 `ancestor::tr` 获取作者（`td.author a`）、期刊（`td.source a`）、日期（`td.date`）、引用（`td.quote a`）

### 百度学术问题分析
- 首页 `xueshu.baidu.com` 能正常打开（标题"百度学术 - 保持学习的态度"）
- 搜索页（无论 URL 直接访问还是首页搜索框提交）都触发"百度安全验证"
- 首页已完全改版，无传统 `#kw`/`#su` 搜索框，input 都没有 id/name
- 清除 Cookie、加 Referer、加反检测 JS 均无效
- **结论**：百度对服务器 IP 段（腾讯云北京）做了搜索行为拦截，需要住宅代理或换 IP 才能解决

### 修改的文件
| 文件 | 改动 |
|------|------|
| `/home/ubuntu/paper-search/fetchers_chinese.py` | 全部重写为 Selenium + Chrome |
| `/home/ubuntu/paper-search/main.py` | SSE 流 import 加 `_fetch_cnki_direct, _fetch_baidu_scholar`；`source_fetcher_map` 和 `source_fetchers` 加 cnki、baidu_scholar |
| `/home/ubuntu/paper-search/pipeline.py` | `_fetch_cnki()` 从跳过改为调用 `_fetch_cnki_direct()` |

### 本地文件
- 最新版：`C:\Users\MateBook D16\paper-search-fix\fetchers_chinese.py`（Selenium 版）
- 参考代码：`C:\Users\MateBook D16\Desktop\cnki-search(1).zip`（朋友的知网 Selenium 方案）
- 交接文档：`C:\Users\MateBook D16\Desktop\ClaudeCode_交接文档_v6.md`

### 待解决
1. **百度学术**：需要住宅代理 IP 或 Camoufox 反检测浏览器，当前服务器 IP 被百度封
2. **内存监控**：Chrome 实例常驻内存，搜索高峰可能 OOM，建议加 swap 或升级到 4G
3. **知网验证码**：目前没遇到，但高频搜索可能触发，需要监控日志
