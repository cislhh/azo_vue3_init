# Pinia 状态管理配置

本项目已按照最佳实践配置了 Pinia 状态管理。

## 目录结构

```
src/app/stores/
├── index.ts          # 导出所有 store（可选）
├── types.ts          # 共享类型定义
└── user.ts           # 用户 store 示例
```

## 最佳实践

### 1. 使用 Setup Store

推荐使用 Composition API 风格的 Setup Store，而非 Options API：

```ts
// ✅ 推荐：Setup Store
export const useUserStore = defineStore('user', () => {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    function increment() {
        count.value++;
    }
    return { count, doubleCount, increment };
});

// ❌ 不推荐：Options Store
export const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0 }),
    getters: {
        doubleCount: (state) => state.count * 2,
    },
    actions: {
        increment() {
            this.count++;
        },
    },
});
```

### 2. 使用 storeToRefs 解构

在组件中使用时，使用 `storeToRefs` 保持响应性：

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/app/stores/user';

const userStore = useUserStore();

// ✅ 正确：state 和 getters 需要解构时使用 storeToRefs
const { currentUser, users, isLoggedIn } = storeToRefs(userStore);

// ✅ 正确：actions 可以直接解构
const { fetchUsers, login, logout } = userStore;
</script>
```

### 3. 启用 HMR（热模块替换）

在每个 store 文件末尾添加 HMR 支持，开发时编辑 store 不会丢失状态：

```ts
import { acceptHMRUpdate, defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
    // store 实现...
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
```

### 4. 类型安全

为接口定义明确的类型：

```ts
// types.ts
export interface User {
    id: number
    username: string
    email: string
    role: 'admin' | 'user' | 'guest'
    createdAt: string
}

export interface UserState {
    currentUser: User | null
    users: User[]
    loading: boolean
    error: string | null
}
```

### 5. 状态管理原则

- **状态局部化优先**：优先使用组件本地状态（`ref`/`reactive`）
- **按需提升**：只有跨组件共享时才使用 store
- **单一职责**：每个 store 负责一个明确的业务领域
- **只读状态**：通过 actions 修改状态，不直接导出可变状态

### 6. 异步 Actions

异步操作放在 actions 中：

```ts
async function fetchUsers() {
    loading.value = true;
    error.value = null;
    try {
        const data = await api.getUsers();
        users.value = data;
    }
    catch (err) {
        error.value = err instanceof Error ? err.message : '获取失败';
    }
    finally {
        loading.value = false;
    }
}
```

### 7. SSR 注意事项

在 SSR 环境中，确保在组件内调用 `useStore()`，而不是在模块顶层：

```ts
// ✅ 正确：在组件或函数内调用
export function useMyFeature() {
    const userStore = useUserStore();
    // ...
}

// ❌ 错误：模块顶层调用（SSR 会导致状态泄漏）
const userStore = useUserStore();
```

## 示例：User Store

完整的用户 store 示例位于 `src/app/stores/user.ts`，包含：

- 用户认证状态管理
- 用户列表 CRUD 操作
- 加载和错误状态处理
- HMR 支持

查看 `src/modules/user/pages/index.vue` 了解如何在组件中使用。

## 参考资料

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue 最佳实践](https://vuejs.org/guide/best-practices/)
