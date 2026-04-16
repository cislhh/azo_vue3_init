export const fundingAccountOptions = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}万 ({d}%)',
    },
    legend: {
        data: ['技术服务', '技术开发', '技术转让', '咨询服务', '其他'],
        top: 0,
    },
    series: [
        {
            name: '外圈分类',
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '55%'],
            label: {
                show: true,
                position: 'outside',
                formatter: '{b}\n{c}万\n{d}%',
                lineHeight: 18,
            },
            labelLine: {
                show: true,
                length: 10,
                length2: 15,
            },
            data: [
                { value: 6681, name: '服务到款', itemStyle: { color: '#FF9800' } },
                { value: 2939, name: '开发到款', itemStyle: { color: '#8BC34A' } },
                { value: 500, name: '转让到款', itemStyle: { color: '#9C27B0' } },
                { value: 200, name: '咨询到款', itemStyle: { color: '#00BCD4' } },
            ],
        },
        {
            name: '内圈技术分类',
            type: 'pie',
            radius: ['25%', '40%'],
            center: ['50%', '55%'],
            label: {
                show: true,
                position: 'outside',
                formatter: '{b}\n{c}万\n{d}%',
                lineHeight: 16,
            },
            labelLine: {
                show: true,
                length: 8,
                length2: 12,
            },
            data: [
                { value: 4000, name: '技术服务', itemStyle: { color: '#00BCD4' } },
                { value: 2681, name: '技术开发', itemStyle: { color: '#E53935' } },
                { value: 1500, name: '技术转让', itemStyle: { color: '#FF5722' } },
                { value: 500, name: '其他服务', itemStyle: { color: '#795548' } },
            ],
        },
    ],
};
