<script setup lang="ts">
import {
    ContractQuantityChart,
    ContractTypeTopChart,
    FundingAccountChart,
    ProjectFundingCompareChart,
} from '@/shared/ui/charts';
</script>

<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800">数据统计</h1>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="rounded-lg bg-white p-4 shadow">
                <h2 class="mb-4 text-center text-lg font-semibold text-gray-700"
                    >本年度合同类型到款top</h2
                >
                <ContractTypeTopChart height="320px" />
            </div>

            <div class="rounded-lg bg-white p-4 shadow">
                <h2 class="mb-4 text-center text-lg font-semibold text-gray-700"
                    >2020年经费到账情况</h2
                >
                <FundingAccountChart height="320px" />
            </div>

            <div class="rounded-lg bg-white p-4 shadow">
                <h2 class="mb-4 text-center text-lg font-semibold text-gray-700"
                    >2016-2020合同数量</h2
                >
                <ContractQuantityChart height="320px" />
            </div>

            <div class="rounded-lg bg-white p-4 shadow">
                <h2 class="mb-4 text-center text-lg font-semibold text-gray-700"
                    >2019-2020科研项目到款经费比较</h2
                >
                <ProjectFundingCompareChart height="320px" />
            </div>
        </div>

        <div class="mt-6 text-center text-sm text-gray-500">
            © 吉林大学 —— 横向科研项目管理平台
        </div>
    </div>
</template>
