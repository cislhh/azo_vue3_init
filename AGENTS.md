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
- 构建前强制类型检查（build 命令包含 tsc --noEmit）

### 代码风格（强制）

- 遵循项目中`.prettierrc`文件的规范

### UI 开发规范（强制）

- 页面骨架、外层布局、栅格分布、间距编排优先使用 Tailwind CSS
- 表单控件、按钮、消息反馈、弹层等交互组件优先使用 Naive UI，避免重复封装基础控件
- 使用 Tailwind CSS 进行布局开发时，优先遵循 `tailwindcss-advanced-layouts` skill；如果当前环境未提供该 skill，也要按同样目标控制布局复用和层次清晰
- 通用 layout、页面骨架、内容容器、表单区块要优先抽成可复用组件，避免在页面里重复拼装相同结构
- 业务页面先保证布局骨架统一，再在骨架内部组合 Naive UI 组件，不要整页直接堆叠 Naive UI 组件替代页面布局

### 目录结构

```
src/
├── app/          # 应用级核心（router, plugins, store, styles）
├── core/         # 基础设施（http, auth, logger, error）
├── modules/      # 业务模块（包含 pages 子目录用于文件路由）
├── shared/       # 共享代码
└── layouts/      # 布局组件
```

### 业务模块开发（强制）

- 开发 `src/modules/*` 业务模块前，必须先使用 `vue-best-practices` skill
- 开发 `src/modules/*` 业务模块时，优先参考 `docs/module-development-reference.md`
- 新模块默认沿用 `user` 模块的 `pages / components / composables` 三层结构
- 模块内禁止新增 `api/` 目录；接口统一放在 `src/core/http/` 下，按模块或功能建目录，并在 `src/core/http/api.ts` 统一导出
- `.vue` 文件保持轻量，页面级业务逻辑、状态编排、事件处理、数据映射优先放到 `composables/*.ts`
- 页面布局和通用骨架优先复用共享组件，不要在模块页面里重复编写相同的外层结构

### 忽略目录

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
- 禁止修改route-map.d.ts

## 完成工作后

必须运行检查命令：`pnpm check`
