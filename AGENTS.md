# 项目指令

## 技术栈

- Vue 3.5.30 + TypeScript 5.9 + Vite 8.0
- Vue Router 5（文件路由）+ Pinia 3.0
- Tailwind CSS 4.2 + PostCSS
- 包管理器：pnpm

## 命令速查

```bash
# 开发
pnpm dev          # 启动开发服务器（http://localhost:5173）

# 构建
pnpm build        # 类型检查 + 构建生产版本

# 检查（按顺序运行）
pnpm type-check   # TypeScript 类型检查
pnpm lint         # ESLint 检查
pnpm lint:css     # Stylelint 检查
pnpm check        # type-check + lint + lint:css

# 自动修复
pnpm fix          # 修复 ESLint + CSS + 格式化代码
pnpm format       # Prettier 格式化

# 测试
pnpm test         # 运行 Vitest 测试
```

## 重要架构细节

### Vue Router 5 文件路由

- **必须注意**：VueRouter 插件必须在 Vue() 插件之前（vite.config.ts:10-18）
- 自动扫描路由：`src/modules/*/pages/**/*.vue`
- 生成的类型：`src/route-map.d.ts`
- 静态路由定义在：`src/app/router/index.ts`
- 布局注入通过 router 配置实现

### TypeScript 配置

- 使用项目引用（tsconfig.json 引用 tsconfig.app.json 和 tsconfig.node.json）
- 路径别名：`@/*` → `src/*`
- 构建前强制类型检查（build 命令包含 tsc --noEmit）

### 代码风格（强制）

- **4 空格缩进**（非 2 空格）
- 单引号 + 分号
- Tailwind 类名自动排序（prettier-plugin-tailwindcss）
- Stylelint 忽略 Vue 文件（仅检查 CSS/SCSS）

### 目录结构

```
src/
├── app/          # 应用级核心（router, plugins, store, styles）
├── core/         # 基础设施（http, auth, logger, error）
├── modules/      # 业务模块（包含 pages 子目录用于文件路由）
├── shared/       # 共享代码
└── layouts/      # 布局组件
```

### 忽略目录

- `otherfile/` - 完全忽略（ESLint、Stylelint、Git）
- `dist/` - 构建产物

## Git 提交规范

```
<type>: <description>

类型（中文）：
- feat: 新功能
- fix: 修复 bug
- refactor: 重构
- docs: 文档
- test: 测试
- chore: 构建/工具
- perf: 性能优化
- ci: CI 配置
```

**约束**：

- 描述 ≤ 50 字符，必须使用中文
- 禁止 Co-Authored-By（单人提交）

## 完成工作后

必须运行检查命令：`pnpm check`
