<script setup lang="ts">
const overviewCards = [
    {
        title: '横向项目立项数',
        value: '24666',
        subtitle: '累计项目数',
        theme: 'from-[#2f67ff] to-[#4ba3ff]',
    },
    {
        title: '已结题',
        value: '18155',
        subtitle: '累计项目数',
        delta: '+2 项',
    },
    {
        title: '累计到款数(万元)',
        value: '29333.26',
        subtitle: '累计合同款',
        theme: 'from-[#19a85b] to-[#5bcf87]',
    },
    {
        title: '累计合同款',
        value: '68996.13',
        subtitle: '累计合同款',
        delta: '+4 项',
    },
];

const pendingItems = [
    {
        title: '汽车底盘悬架控制臂轻量化设计与性能优化项目',
        tag: '横向项目',
        owner: '李佳',
        college: '汽车工程学院',
        time: '2026-03-22 16:30:31',
        status: '申报待审核',
        duration: '4天',
    },
    {
        title: '车载电子连接器可靠性测试及质量评估项目',
        tag: '经费外拨',
        owner: '李佳',
        college: '汽车工程学院',
        time: '2026-03-22 16:30:31',
        status: '经费外拨待审核',
        duration: '1天',
    },
    {
        title: '汽车底盘悬架控制臂轻量化设计与性能优化子项目',
        tag: '子项目',
        owner: '王悦',
        college: '汽车工程学院',
        time: '2026-03-21 14:12:10',
        status: '经费外拨待审核',
        duration: '1天',
    },
    {
        title: '汽车底盘悬架控制臂轻量化设计与性能优化项目',
        tag: '设备代购',
        owner: '李佳',
        college: '汽车工程学院',
        time: '2026-03-20 10:20:18',
        status: '公示待审核',
        duration: '1天',
    },
];

const completedItems = [
    {
        title: '车载电子连接器可靠性测试及质量评估项目',
        tag: '经费外拨',
        owner: '李佳',
        college: '汽车工程学院',
        duration: '4天',
    },
    {
        title: '车载电子连接器可靠性测试及质量评估项目',
        tag: '经费外拨',
        owner: '李佳',
        college: '汽车工程学院',
        duration: '1天',
    },
    {
        title: '车载电子连接器可靠性测试及质量评估项目',
        tag: '经费外拨',
        owner: '李佳',
        college: '汽车工程学院',
        duration: '4天',
    },
    {
        title: '车载电子连接器可靠性测试及质量评估项目',
        tag: '经费外拨',
        owner: '李佳',
        college: '汽车工程学院',
        duration: '4天',
    },
];

const noticeItems = [
    '合同审核5个工作日反馈意见',
    '合同登记：周二至周四13:00-16:00',
    '科研财务每月最后3个工作日结算，不受理拨款开发票业务及预借发票业务',
];

const progressSteps = ['管理部门审核', '公示通过', '财务审核', '财务主管审核'];
</script>

<template>
    <div class="space-y-6">
        <section class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
            <div class="rounded-sm bg-white p-5 shadow-sm">
                <div class="mb-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <h2 class="text-xl font-semibold text-[#333]">数据概览</h2>
                        <a
                            href="/project-demand"
                            class="inline-flex items-center rounded-full bg-[#2f67ff] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#2257d6]"
                        >
                            横向项目
                        </a>
                    </div>
                    <span class="text-sm text-[#999]">单位：万元</span>
                </div>

                <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <article
                        v-for="card in overviewCards"
                        :key="card.title"
                        class="min-w-0 rounded-xl border border-[#eef2f7] p-4"
                        :class="
                            card.theme ? ['bg-gradient-to-r', card.theme, 'text-white'] : 'bg-white'
                        "
                    >
                        <p class="text-sm" :class="card.theme ? 'text-white/85' : 'text-[#666]'">{{
                            card.title
                        }}</p>
                        <div class="mt-3 flex items-end justify-between gap-3">
                            <strong class="text-4xl leading-none font-semibold">{{
                                card.value
                            }}</strong>
                            <span v-if="card.delta" class="text-3xl font-semibold text-[#1bb65f]">{{
                                card.delta
                            }}</span>
                        </div>
                        <p
                            class="mt-3 text-sm"
                            :class="card.theme ? 'text-white/80' : 'text-[#999]'"
                            >{{ card.subtitle }}</p
                        >
                    </article>
                </div>
            </div>

            <aside class="rounded-sm bg-white p-5 shadow-sm">
                <div class="mb-4 flex items-center gap-2 text-[#2257b7]">
                    <span class="text-lg">▣</span>
                    <h2 class="text-xl font-semibold">公告</h2>
                </div>
                <div class="space-y-3 text-sm leading-6 text-[#555]">
                    <p v-for="notice in noticeItems" :key="notice">{{ notice }}</p>
                </div>
            </aside>
        </section>

        <section class="grid gap-4 xl:grid-cols-2">
            <article class="rounded-sm bg-white p-5 shadow-sm">
                <div class="mb-4 flex items-center gap-8 border-b border-[#edf1f5] pb-3">
                    <div class="flex items-center gap-2 text-[#e34d59]">
                        <span>🔔</span>
                        <h2 class="text-xl font-semibold">待办事项</h2>
                    </div>
                    <div class="flex gap-6 text-sm text-[#666]">
                        <span class="border-b-2 border-[#2f67ff] pb-2 text-[#2f67ff]"
                            >全部（12）</span
                        >
                        <span>3天以上（4）</span>
                    </div>
                </div>

                <div class="space-y-5">
                    <div
                        v-for="item in pendingItems"
                        :key="`${item.title}-${item.time}`"
                        class="border-b border-[#f2f4f7] pb-4 last:border-b-0"
                    >
                        <div class="flex items-start justify-between gap-4">
                            <div class="min-w-0 flex-1">
                                <h3 class="truncate text-base font-medium text-[#333]">{{
                                    item.title
                                }}</h3>
                                <div
                                    class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#8a8f98]"
                                >
                                    <span
                                        class="rounded-full bg-[#eff8eb] px-2 py-0.5 text-xs text-[#6cad4f]"
                                        >{{ item.tag }}</span
                                    >
                                    <span class="text-[#2f67ff]">详情</span>
                                    <span>{{ item.owner }}</span>
                                    <span>{{ item.college }}</span>
                                </div>
                            </div>
                            <div class="shrink-0 text-right text-sm">
                                <p class="font-medium text-[#ef5c60]">{{ item.status }}</p>
                                <p class="mt-2 text-[#999]">{{ item.time }}</p>
                                <p class="mt-1 text-[#666]"
                                    >办理时长：<span class="text-[#ef5c60]">{{
                                        item.duration
                                    }}</span></p
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <article class="rounded-sm bg-white p-5 shadow-sm">
                <div class="mb-4 flex items-center gap-8 border-b border-[#edf1f5] pb-3">
                    <div class="flex items-center gap-2 text-[#2257b7]">
                        <span>▣</span>
                        <h2 class="text-xl font-semibold">已办事项</h2>
                    </div>
                    <div class="flex gap-6 text-sm text-[#666]">
                        <span class="border-b-2 border-[#2f67ff] pb-2 text-[#2f67ff]">已办理</span>
                        <span>已办结</span>
                    </div>
                </div>

                <div class="space-y-5">
                    <div
                        v-for="item in completedItems"
                        :key="`${item.title}-${item.duration}`"
                        class="border-b border-[#f2f4f7] pb-4 last:border-b-0"
                    >
                        <div class="flex items-start justify-between gap-4">
                            <div class="min-w-0 flex-1">
                                <h3 class="truncate text-base font-medium text-[#333]">{{
                                    item.title
                                }}</h3>
                                <div
                                    class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#8a8f98]"
                                >
                                    <span
                                        class="rounded-full bg-[#eff8eb] px-2 py-0.5 text-xs text-[#6cad4f]"
                                        >{{ item.tag }}</span
                                    >
                                    <span class="text-[#2f67ff]">详情</span>
                                    <span>{{ item.owner }}</span>
                                    <span>{{ item.college }}</span>
                                </div>
                            </div>
                            <div class="shrink-0 text-right text-sm text-[#666]">
                                <div class="flex items-center gap-3 text-xs text-[#8aa189]">
                                    <template v-for="step in progressSteps" :key="step">
                                        <span class="flex items-center gap-2">
                                            <span
                                                class="h-3 w-3 rounded-full border border-[#3bae5b] bg-white"
                                            ></span>
                                            <span>{{ step }}</span>
                                        </span>
                                    </template>
                                </div>
                                <p class="mt-2"
                                    >办理时长：<span class="text-[#ef5c60]">{{
                                        item.duration
                                    }}</span></p
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    </div>
</template>
