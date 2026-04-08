# AZO Vue3 初始化项目

基于 Vue 3、TypeScript 和 Vite 的前端初始化项目，集成 Vue Router 文件路由、Pinia、Tailwind CSS、ESLint、Stylelint、Prettier 和 Vitest，适合作为中后台或模块化业务项目的基础工程。

## 技术栈

- **核心框架**：Vue 3.5、TypeScript 5.9、Vite 8
- **路由与状态**：Vue Router 5（文件路由）、Pinia 3
- **样式方案**：Tailwind CSS 4、PostCSS、Autoprefixer
- **工程质量**：ESLint（@antfu/eslint-config）、Stylelint、Prettier、Vitest
- **业务依赖**：Axios、ECharts、LogicFlow、OnlyOffice、Vue Flow、Naive UI、es-toolkit

## 快速开始

### 环境要求

- Node.js 20+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

默认访问地址：`http://localhost:5173`

### 构建生产版本

```bash
pnpm build
```

构建命令会先执行 TypeScript 类型检查，再执行 Vite 生产构建。

## 常用命令

```bash
pnpm dev             # 启动开发服务器
pnpm build           # 类型检查并构建生产版本
pnpm test            # 运行 Vitest 测试
pnpm type-check      # TypeScript 类型检查
pnpm lint            # ESLint 检查
pnpm lint:css        # Stylelint 检查 CSS/SCSS/Vue 文件
pnpm format          # 使用 Prettier 格式化项目
pnpm format:check    # 检查 Prettier 格式
pnpm check           # type-check + lint + lint:css + format:check
```

## 项目结构

```text
src/
├── app/          # 应用级核心：路由、页面、全局 store、全局样式
├── core/         # 基础设施：HTTP、认证、日志、错误处理等
├── layouts/      # 布局组件
├── modules/      # 业务模块；pages 子目录用于文件路由
└── shared/       # 跨模块共享代码：组件、hooks、工具、类型等
```

关键文件：

- `src/main.ts`：应用入口
- `src/App.vue`：根组件和布局渲染入口
- `src/app/router/index.ts`：路由实例、静态路由和布局注入
- `src/app/stores/`：Pinia 全局 store
- `src/core/http/`：Axios 封装和 HTTP 相关能力
- `src/route-map.d.ts`：Vue Router 生成的路由类型声明文件
- `vite.config.ts`：Vite 插件、别名和文件路由扫描配置

## 路由约定

项目使用 Vue Router 5 的 Vite 插件自动生成模块路由：

- 自动扫描目录：`src/modules/*/pages/**/*.vue`
- 生成类型文件：`src/route-map.d.ts`
- 静态路由定义：`src/app/router/index.ts`
- 默认布局注入：`src/app/router/index.ts` 中为自动生成的模块路由添加 `DefaultLayout`

示例：

```text
src/modules/home/pages/index.vue      -> /home
src/modules/user/pages/index.vue      -> /user
src/modules/user/pages/list.vue       -> /user/list
src/modules/user/pages/[id].vue       -> /user/:id
src/modules/dashboard/pages/index.vue -> /dashboard
```

注意事项：

- `vite.config.ts` 中 `VueRouter()` 插件必须放在 `vue()` 插件之前。
- `src/route-map.d.ts` 是生成文件，不要手动修改。
- 不需要默认布局的页面可以在静态路由中设置 `meta: { layout: null }`。

## TypeScript 与构建

项目使用 TypeScript 项目引用：

- `tsconfig.json` 引用 `tsconfig.app.json` 和 `tsconfig.node.json`
- `pnpm type-check` 执行 `tsc --noEmit --project tsconfig.app.json`
- `pnpm build` 执行 `tsc --noEmit --project tsconfig.app.json && vite build`

## 代码质量

提交或交付前建议运行：

```bash
pnpm check
```

该命令会按顺序运行：

```bash
pnpm type-check
pnpm lint
pnpm lint:css
pnpm format:check
```

如需自动格式化代码：

```bash
pnpm format
```

## 代码风格

- 缩进：4 空格
- 字符串：单引号
- 语句结尾：保留分号
- 行宽：100 字符
- Tailwind class 排序：由 `prettier-plugin-tailwindcss` 处理
- Markdown 文件允许保留行尾空格

具体规则以 `.prettierrc`、`.editorconfig`、`eslint.config.mjs` 和 `stylelint.config.mjs` 为准。

## Git 提交规范

提交信息格式：

```text
<type>: <description>
```

类型说明：

- `feat`：新功能
- `fix`：修复 bug
- `refactor`：重构
- `docs`：文档
- `test`：测试
- `chore`：构建或工具
- `perf`：性能优化
- `ci`：CI 配置

约束：

- 描述使用中文，且不超过 50 个字符。
- 不添加 `Co-Authored-By`。

## 许可证

Private
