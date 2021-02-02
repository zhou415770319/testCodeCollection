export const options = {
    backgroundColor: '#F9F9F9',
    title: {
        top: 23,
        left: 13,
        text: '',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#333',
        },
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
            lineStyle: {
                color: '#57617B'
            }
        },
        formatter: Function
    },
    legend: {
        top: 25,
        // left: 200,
        right: 20,
        height: 10,
        icon: 'circle',
        itemWidth: 20,
        itemHeight: 20,
        itemGap: 20,
        pageButtonPosition: 'end',
        data: [],
        textStyle: {
            fontSize: 12,
            color: '#666'
        },
        formatter: Function,
        tooltip: {
            show: true,
            confine: true,
            formatter: Function,
        }
    },
    grid: {
        top: 70,
        left: '20px',
        right: '50px',
        bottom: '20px',
        containLabel: true,
        y2: 100,
    },
    xAxis: [{
        type: 'category',
        show: true,
        axisLine: {
            lineStyle: {
                color: '#57617B'
            }
        },
        axisLabel: {
            interval: 0,
            rotate: -15,
            show: false
        },

        data: [],
    }],
    yAxis: [{
        type: 'value',
        name: '',
        scale: true,
        show: true,
        // position:'right',
        axisTick: {
            show: false
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#57617B',
                // type: 'solid',
            }
        },
        axisLabel: {
            margin: 0,
            textStyle: {
                fontSize: 14,
                // align: 'center'
            }
        },
        splitLine: {
            lineStyle: {
                color: ['#ddd'],
                type: 'dashed',
                opacity: 0.4
            }
        }
    }],
    series: [],

}