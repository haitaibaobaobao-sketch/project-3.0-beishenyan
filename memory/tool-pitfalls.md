# 工具调用常见错误（自查清单）

## Invalid tool parameters 常见原因

1. **数组参数不能传字符串** — 比如 `query_list` 要传 `["xxx"]` 而不是 `"xxx"`
2. **必填参数不能省略** — 调用前先确认哪些是 required
3. **null 和省略不一样** — 有些参数不接受 null，不需要就别传
4. **路径中的反斜杠** — Windows 路径在 JSON 里要用 `\\` 或改用 `/`
5. **嵌套对象要用 JSON 格式** — 不能传字符串形式的 JSON

## 特定工具注意事项

### Tavily MCP
- `tavily_search` 的 `query` 是字符串，不是数组
- `include_domains` / `exclude_domains` 是字符串数组
- `topic` 目前只支持 `"general"`

### UltraRAG MCP
- `query_list` 必须是字符串数组 `["query1", "query2"]`
- `batch_query_list` 是二维数组 `[["q1"], ["q2"]]`
- `backend_configs` 必须是对象，不能是字符串

### Playwright MCP
- `ref` 参数必须从 snapshot 里拿到的精确引用，不能猜
- `values` 在 select_option 里是字符串数组

### 通用规则
- 调用前脑子里过一遍：类型对不对？必填全了没？格式对不对？
- 出错一次后不要用完全相同的参数重试，先想想哪里错了
