export const projectFundingCompareOptions = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter (params: any) {
            if (!params.length) return '';
            const month = params[0].name;
            let result = `${month}<br/>`;
            params.forEach((item: { seriesName: string; value: number }) => {
                result += `${item.seriesName}: ${item.value.toLocaleString()}<br/>`;
            });
            return result;
        },
    },
    legend: {
        data: ['2019年到款金额', '2020年到款金额'],
        top: 0,
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
        data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月',
        ],
    },
    yAxis: {
        type: 'value',
        name: '万',
        max: 7000,
    },
    series: [
        {
            name: '2019年到款金额',
            type: 'bar',
            data: [1200, 800, 1500, 2000, 1800, 3115, 2500, 2200, 2800, 3000, 3500, 5000],
            itemStyle: {
                color: '#E53935',
            },
            barWidth: 15,
        },
        {
            name: '2020年到款金额',
            type: 'bar',
            data: [1000, 600, 1200, 1800, 1500, 2500, 2000, 1700, 2200, 2500, 2800, 4200],
            itemStyle: {
                color: '#1E88E5',
            },
            barWidth: 15,
        },
    ],
};
