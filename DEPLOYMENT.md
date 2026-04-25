# 🚀 GitHub Actions 自动部署说明

## ✅ 配置完成

您的项目已配置 GitHub Actions 自动构建和部署到 GitHub Pages！

## 📋 部署流程

当代码推送到 GitHub 仓库的 `master` 分支时，会自动触发以下流程：

1. **构建阶段** 
   - 使用 Node.js 18 环境
   - 安装项目依赖
   - 执行 `npm run build` 构建项目
   - 生成静态文件到 `SourceCode/dist` 目录

2. **部署阶段**
   - 自动部署到 GitHub Pages
   - 访问地址：https://zhangxiubin.github.io/aiformcheck/

## 🔧 配置详情

### GitHub Actions 工作流
- **配置文件**: `.github/workflows/deploy.yml`
- **触发条件**: 推送到 master 分支
- **构建目录**: `SourceCode/`
- **输出目录**: `SourceCode/dist/`

### Vite 配置
- **Base 路径**: `/aiformcheck/`
- **路由配置**: 使用 HTML5 History 模式，支持子路径

## 🌐 访问地址

- **GitHub Pages**: https://zhangxiubin.github.io/aiformcheck/
- **GitHub 仓库**: https://github.com/zhangxiubin/aiformcheck

## 📝 如何更新部署

### 自动部署（推荐）
```bash
# 修改代码后，直接推送到 GitHub
git add .
git commit -m "更新功能描述"
git push github master
```

推送后会自动触发 GitHub Actions 构建和部署，大约需要 1-2 分钟。

### 手动触发
1. 访问 GitHub 仓库页面
2. 点击 "Actions" 标签
3. 选择 "Deploy to GitHub Pages" 工作流
4. 点击 "Run workflow" 按钮

## 🔍 查看部署状态

### 查看构建日志
1. 访问 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看最近的工作流运行记录

### 查看部署状态
- 绿色 ✅ = 部署成功
- 红色 ❌ = 部署失败（点击查看详细日志）
- 蓝色 🔄 = 正在构建中

## 🛠 本地开发

### 启动开发服务器
```bash
cd SourceCode
npm run dev
```
访问：http://localhost:3000/

### 本地构建测试
```bash
cd SourceCode
npm run build
```

构建产物会生成在 `SourceCode/dist/` 目录。

## ⚙️ 环境配置

### 开发环境
- **端口**: 3000
- **热重载**: 支持
- **API 地址**: /api

### 生产环境
- **Base 路径**: /aiformcheck/
- **资源压缩**: 启用
- **代码分割**: Vue vendor + Element Plus

## 🐛 常见问题

### Q: 部署后页面空白？
A: 检查浏览器控制台是否有资源加载错误，确保 base 路径配置正确。

### Q: 路由跳转不工作？
A: GitHub Pages 支持 SPA 路由，但刷新页面可能返回 404。已配置 `.nojekyll` 文件解决此问题。

### Q: 如何修改部署域名？
A: 在 GitHub 仓库设置中配置自定义域名，并更新 `vite.config.ts` 中的 `base` 路径。

### Q: 构建失败怎么办？
A: 检查 Actions 日志，常见原因：
- 依赖安装失败：检查 `package.json`
- 构建错误：本地运行 `npm run build` 测试
- 权限问题：检查仓库 Settings > Pages > Source

## 📦 项目结构

```
winning-winex-mras-form/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 配置
├── SourceCode/                 # 前端项目源码
│   ├── dist/                   # 构建输出（自动生成）
│   ├── src/                    # 源代码
│   ├── package.json
│   └── vite.config.ts          # Vite 配置
└── README.md
```

## 🎉 开始使用

现在您可以：
1. ✅ 修改代码并推送到 GitHub
2. ✅ 自动触发构建和部署
3. ✅ 访问 GitHub Pages 查看最新版本
4. ✅ 分享链接给团队成员

祝您使用愉快！🚀
