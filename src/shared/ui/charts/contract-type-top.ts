export const contractTypeTopOptions = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    legend: {
        data: ['2020年度', '2019年度'],
        top: 0,
    },
    grid: {
        left: '3%',
        right: '10%',
        bottom: '3%',
        top: '40px',
        containLabel: true,
    },
    xAxis: {
        type: 'value',
        name: '万',
        max: 2500,
    },
    yAxis: {
        type: 'category',
        data: ['咨询到款', '服务到款', '转让到款', '开发到款'],
    },
    series: [
        {
            name: '2020年度',
            type: 'bar',
            data: [1200, 1800, 900, 1500],
            itemStyle: {
                color: '#1E88E5',
            },
            barWidth: 20,
        },
        {
            name: '2019年度',
            type: 'bar',
            data: [1500, 1600, 1100, 2000],
            itemStyle: {
                color: '#E53935',
            },
            barWidth: 20,
        },
    ],
};
