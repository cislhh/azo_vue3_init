export const contractQuantityOptions = {
    tooltip: {
        trigger: 'axis',
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '40px',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        data: ['2017', '2018', '2019', '2020'],
        name: '年份',
    },
    yAxis: {
        type: 'value',
        name: '数量',
        max: 1500,
    },
    series: [
        {
            name: '合同数量',
            type: 'line',
            data: [800, 1200, 1400, 600],
            itemStyle: {
                color: '#E53935',
            },
            lineStyle: {
                width: 3,
            },
            symbol: 'circle',
            symbolSize: 8,
            smooth: false,
        },
    ],
};
