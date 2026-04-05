# AZO Vue3 初始化项目

基于 Vue 3 + TypeScript + Vite 的现代化前端项目模板，集成了 Tailwind CSS、Pinia 状态管理和 Vue Router 5。

## 技术栈

### 核心框架

- **Vue 3.5.30** - 渐进式 JavaScript 框架
- **TypeScript 5.9** - 类型安全的 JavaScript 超集
- **Vite 8.0** - 下一代前端构建工具
- **Vue Router 5** - Vue.js 官方路由管理器
- **Pinia 3.0** - Vue 3 官方状态管理库

### UI 与样式

- **Tailwind CSS 4.2** - 实用优先的 CSS 框架
- **PostCSS** - CSS 转换工具
- **Autoprefixer** - 自动添加浏览器前缀

### 代码质量

- **ESLint** - 代码检查工具（基于 @antfu/eslint-config）
- **Prettier** - 代码格式化工具
- **Stylelint** - CSS/SCSS 代码检查
- **TypeScript** - 静态类型检查

### 业务组件

- **LogicFlow** - 流程图编辑框架
- **OnlyOffice** - 文档编辑器组件
- **Vue Flow** - 流程图组件库
- **ECharts** - 数据可视化图表库

## 快速开始

### 环境要求

- Node.js >= 20.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

项目将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 可用命令

### 开发相关

```bash
pnpm dev           # 启动开发服务器
pnpm build         # 构建生产版本
pnpm preview       # 预览生产构建
```

### 代码检查

```bash
pnpm lint          # 运行 ESLint 检查
pnpm lint:css      # 运行 Stylelint 检查
pnpm type-check    # TypeScript 类型检查
pnpm check         # 运行所有检查（类型 + ESLint + CSS）
```

### 代码修复

```bash
pnpm format        # 使用 Prettier 格式化代码
pnpm fix           # 自动修复所有可修复的问题
pnpm fix:eslint    # 自动修复 ESLint 问题
pnpm fix:css       # 自动修复 CSS 问题
```

### 测试

```bash
pnpm test          # 运行测试
```

## 项目结构

```
azo-vue3-init/
├── public/           # 静态资源
├── src/
│   ├── app/          # 应用核心代码
│   │   ├── router/   # 路由配置
│   │   └── styles/   # 全局样式
│   ├── core/         # 核心工具
│   │   └── http/     # HTTP 请求封装
│   ├── modules/      # 业务模块
│   ├── main.ts       # 应用入口
│   └── env.d.ts      # 环境变量类型定义
├── .editorconfig     # 编辑器配置
├── .prettierrc       # Prettier 配置
├── eslint.config.mjs # ESLint 配置
├── stylelint.config.mjs  # Stylelint 配置
├── tsconfig.json     # TypeScript 配置
└── vite.config.ts    # Vite 配置
```

## 代码规范

### 缩进

- 统一使用 **4 空格** 缩进
- 编辑器配置已设置为自动格式化

### 命名规范

- 组件：PascalCase（如 `UserList.vue`）
- 文件：kebab-case（如 `user-service.ts`）
- 变量/函数：camelCase（如 `getUserData`）
- 常量：SCREAMING_SNAKE_CASE（如 `API_BASE_URL`）
- 类型/接口：PascalCase（如 `UserData`）

### Git 提交规范

```
<type>: <description>

类型说明：
- feat: 新功能
- fix: 修复 bug
- refactor: 重构代码
- docs: 文档更新
- test: 测试相关
- chore: 构建工具或辅助工具的变动
- perf: 性能优化
- ci: CI 配置文件和脚本的变动
```

## 编辑器支持

推荐使用 VS Code，已提供 `.vscode/settings.json` 配置，包括：

- 自动保存时格式化
- 文件关联配置
- 默认格式化工具设置

其他编辑器可通过 `.editorconfig` 获得一致的基本配置。

## 许可证

Private
