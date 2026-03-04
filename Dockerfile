# 使用 Python 3.11
FROM python:3.11-slim

# 安装必要工具
RUN apt-get update && apt-get install -y \
    git \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /workspace

# 复制项目文件
COPY . .

# 暴露端口（如果需要运行服务）
EXPOSE 8080

# 默认命令
CMD ["/bin/bash"]
