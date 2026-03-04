# 交接文档（2026-02-13 晚）

> 给下一个 Claude Code 实例看的，快速了解当前状态。

## 本次会话做了什么

### 1. 论文检索系统修复（已完成）
- **问题**：Gemini 把 login.html 写成了空文件（0字节），导致网站打不开
- **修复**：从备份 `login.html.bak_auth_20260213_051135` 恢复，重启 paper-search-web 服务
- **验证**：/papers/ → 302 到 /papers/login ✅，/papers/login → 200 ✅

### 2. Webshare 代理部署（已完成）
- 注册了 Webshare 免费账号，拿到 10 个代理 IP
- 已写入服务器 `/home/ubuntu/paper-search/proxies.json`
- 代理用户名：`xwbtujss`，密码：`m3vkntk0mt7p`
- 测试结果：万方 ✅（200，148KB）、百度学术 ❌（安全验证）、知网 ❌（需JS渲染）

### 3. 中文抓取器修复代码（已写好，未部署）
- **桌面上有三个文件**：
  - `Desktop\paper-search-fix\fetchers_chinese.py` — 合并版（万方+知网+百度学术）
  - `Desktop\fix_cnki.py` — 知网单独版（队友写的，质量更高）
  - `Desktop\fix_baidu.py` — 百度学术单独版（队友写的，质量更高）
- **关键发现**：
  - 万方：HTTP GET + HTML 解析即可，从 `__NUXT__` script 提取 JSON
  - 知网：必须 Playwright Chromium 直连（不能走代理，海外IP返回404）
  - 百度学术：必须 Playwright Firefox + stealth（Chromium 全被拦）
  - stealth 正确用法：`from playwright_stealth import Stealth; Stealth().apply_stealth_async(page)`
  - 百度学术必须先访问首页拿 cookie 再搜索，不然触发验证

### 4. balance_checker.exe 图标更换（已完成）
- 换了新图标（蓝色圆角方块+放大镜+美元符号，没有"余额"两个字）
- 已复制到桌面

## 未完成的事（网络断了）

### 部署中文抓取器到服务器
```bash
# 1. 上传合并版代码
scp "C:\Users\MateBook D16\Desktop\paper-search-fix\fetchers_chinese.py" ubuntu@152.136.116.80:/home/ubuntu/paper-search/fetchers_chinese.py

# 2. 安装 Playwright 浏览器（如果没装的话）
ssh ubuntu@152.136.116.80 "python3 -m playwright install chromium firefox"

# 3. 清理可能的残留进程（之前测试可能留了僵尸进程）
ssh ubuntu@152.136.116.80 "pkill -f chromium; pkill -f firefox; pkill -f playwright"

# 4. 修 pipeline.py 让它调用新的抓取器函数
# 需要读 pipeline.py 看怎么 import 和调用

# 5. 重启服务
ssh ubuntu@152.136.116.80 "sudo systemctl restart paper-search"

# 6. 测试
ssh ubuntu@152.136.116.80 "curl -s 'http://127.0.0.1:8000/search/meta?q=polyolefin+recycling&limit=5' | python3 -m json.tool"
```

### Gemini 遗留问题（不紧急）
1. auth.py 缺 is_admin 列
2. constants.py 里 cnki 重复 3 次
3. pipeline.py 没导入 cnki 模块
4. wanfang/baidu_scholar 没接入搜索管线
5. 权重表缺 wanfang 和 baidu_scholar

## 网络断开原因
- VPN（LetsVPN）断了，ping 百度都不通
- 不是服务器问题，是本机网络问题
- 用户重启电脑后 autostart.py 会自动启动 LetsVPN 并连接

## 用户重要偏好
- **用户说停就必须停**
- 全部用中文回复
- 用通俗易懂的话解释（大一学生）
- 有疑问就出选择题问用户
- **严禁使用学校相关资源**（WebVPN、学号等）
- 联网搜索只用 tavily MCP

## 详细技术文档
- 论文检索系统完整文档：`~/.claude/projects/C--Users-MateBook-D16/memory/paper-search.md`
- 总记忆索引：`~/.claude/projects/C--Users-MateBook-D16/memory/MEMORY.md`
