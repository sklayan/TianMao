// Initialize ECharts instances
const charts = {};

// Mock Data Generators
function generateRandomData(length, min, max) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// DOM Elements
const timestampEl = document.getElementById('timestamp');
const timeSelector = document.getElementById('time-selector');

// Update Timestamp
function updateTimestamp() {
    const now = new Date();
    timestampEl.textContent = now.toLocaleTimeString();
}
setInterval(updateTimestamp, 1000);
updateTimestamp();

// Fetch World Map Data
async function initMap() {
    // World map is loaded via script tag in index.html
    initAllCharts();
}

function initAllCharts() {
    initChannelSalesChart();
    initConversionCards();
    initTrafficSourceChart();
    initCategoryRankChart();
    initCategoryTrendChart();
    initWordCloudChart();
    initMarginGaugeChart();
    initMapChart();
    initCityRankChart();
    initRepurchaseChart();

    // Start Data Stream
    startDataStream();

    // Handle Resize
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(chart => chart && chart.resize());
    });
}

// 2. Channel Sales Comparison (Bar)
function initChannelSalesChart() {
    const chart = echarts.init(document.getElementById('channel-sales-chart'));
    charts.channelSales = chart;

    const option = {
        tooltip: { trigger: 'axis' },
        grid: { top: '10%', bottom: '20%', left: '10%', right: '5%' },
        xAxis: {
            type: 'category',
            data: ['天猫', '京东', '拼多多', '抖音', '官网'],
            axisLabel: { color: '#fff' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
        },
        series: [{
            data: [120, 200, 150, 80, 70],
            type: 'bar',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00eaff' },
                    { offset: 1, color: '#0055ff' }
                ])
            }
        }]
    };
    chart.setOption(option);
}

// 3. Conversion Cards
let kpiData = [
    { title: '点击率 (CTR)', value: 4.5, unit: '%', trend: 0.5, up: true },
    { title: '转化率 (CVR)', value: 2.1, unit: '%', trend: 0.1, up: false },
    { title: '客单价', value: 350, unit: '', prefix: '¥', trend: 12, up: true }
];

function initConversionCards() {
    renderConversionCards();
}

function renderConversionCards() {
    const container = document.getElementById('conversion-cards');
    container.innerHTML = kpiData.map(item => `
        <div class="kpi-card">
            <div class="kpi-title">${item.title}</div>
            <div class="kpi-value">${item.prefix || ''}${typeof item.value === 'number' ? item.value.toFixed(1) : item.value}${item.unit}</div>
            <div class="kpi-trend ${item.up ? 'trend-up' : 'trend-down'}">
                ${item.up ? '▲' : '▼'} ${item.trend}%
            </div>
        </div>
    `).join('');
}

// Data Stream Simulation
function startDataStream() {
    setInterval(() => {
        // 1. Update KPI Data
        kpiData.forEach(item => {
            if (item.title === '客单价') {
                item.value += Math.floor((Math.random() - 0.5) * 5);
            } else {
                const change = (Math.random() - 0.5) * 0.1;
                item.value = Math.max(0, item.value + change);
            }
            // Randomly flip trend direction
            if (Math.random() > 0.9) item.up = !item.up;
        });
        renderConversionCards();

        // 2. Update Channel Sales (Bar Chart)
        if (charts.channelSales) {
            const newSalesData = generateRandomData(5, 50, 300);
            charts.channelSales.setOption({ series: [{ data: newSalesData }] });
        }

        // 3. Update Category Trend (Line Chart)
        if (charts.categoryTrend) {
            const option = charts.categoryTrend.getOption();
            const data = option.series[0].data;
            // Shift and push new random value
            data.shift();
            data.push(Math.floor(Math.random() * 150) + 80);
            charts.categoryTrend.setOption({ series: [{ data: data }] });
        }

        // 4. Update Margin Gauge
        if (charts.marginGauge) {
            const newVal = +(Math.random() * 60 + 20).toFixed(2);
            charts.marginGauge.setOption({
                series: [{ data: [{ value: newVal, name: '毛利率' }] }]
            });
        }

    }, 2000); // Update every 2 seconds
}

// 4. Traffic Source (Pie/Rose)
function initTrafficSourceChart() {
    const chart = echarts.init(document.getElementById('traffic-source-chart'));
    charts.trafficSource = chart;

    const option = {
        tooltip: { trigger: 'item' },
        series: [
            {
                name: '流量来源',
                type: 'pie',
                radius: [10, 80],
                center: ['50%', '50%'],
                roseType: 'area',
                itemStyle: { borderRadius: 5 },
                data: [
                    { value: 40, name: '直接访问' },
                    { value: 38, name: '搜索引擎' },
                    { value: 32, name: '社交媒体' },
                    { value: 30, name: '广告投放' },
                    { value: 28, name: '外部链接' }
                ]
            }
        ]
    };
    chart.setOption(option);
}

// 5. Category Rank (Horizontal Bar)
function initCategoryRankChart() {
    const chart = echarts.init(document.getElementById('category-rank-chart'));
    charts.categoryRank = chart;

    const option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { top: '5%', bottom: '5%', left: '20%', right: '10%', containLabel: true },
        xAxis: { type: 'value', show: false },
        yAxis: {
            type: 'category',
            data: ['美妆', '数码', '家电', '服饰', '食品', '母婴', '家居', '运动', '个护', '生鲜'].reverse(),
            axisLabel: { color: '#fff' },
            axisLine: { show: false },
            axisTick: { show: false }
        },
        series: [{
            type: 'bar',
            data: [900, 850, 800, 750, 700, 650, 600, 550, 500, 450].reverse(),
            label: { show: true, position: 'right', color: '#fff' },
            itemStyle: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: '#ff0033' },
                    { offset: 1, color: '#ff9966' }
                ]),
                borderRadius: [0, 10, 10, 0]
            }
        }]
    };
    chart.setOption(option);
}

// 6. Category Trend (Line)
function initCategoryTrendChart() {
    const chart = echarts.init(document.getElementById('category-trend-chart'));
    charts.categoryTrend = chart;

    const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['今年', '去年'], textStyle: { color: '#fff' } },
        grid: { top: '15%', bottom: '10%', left: '5%', right: '5%', containLabel: true },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['0h', '4h', '8h', '12h', '16h', '20h', '24h'],
            axisLabel: { color: '#fff' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
        },
        series: [
            {
                name: '今年',
                type: 'line',
                smooth: true,
                data: [120, 132, 101, 134, 90, 230, 210],
                itemStyle: { color: '#00eaff' },
                areaStyle: { opacity: 0.2, color: '#00eaff' }
            },
            {
                name: '去年',
                type: 'line',
                smooth: true,
                data: [220, 182, 191, 234, 290, 330, 310],
                itemStyle: { color: '#ff0033' },
                lineStyle: { type: 'dashed' }
            }
        ]
    };
    chart.setOption(option);
}

// 7. Word Cloud
function initWordCloudChart() {
    const chart = echarts.init(document.getElementById('wordcloud-chart'));
    charts.wordCloud = chart;

    const option = {
        series: [{
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            right: null,
            bottom: null,
            sizeRange: [12, 40],
            rotationRange: [-90, 90],
            rotationStep: 45,
            gridSize: 8,
            drawOutOfBound: false,
            textStyle: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: function () {
                    return 'rgb(' + [
                        Math.round(Math.random() * 160 + 95),
                        Math.round(Math.random() * 160 + 95),
                        Math.round(Math.random() * 160 + 95)
                    ].join(',') + ')';
                }
            },
            emphasis: {
                focus: 'self',
                textStyle: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: [
                { name: '智能手机', value: 10000 },
                { name: '羽绒服', value: 6181 },
                { name: '洗地机', value: 4386 },
                { name: '面霜', value: 4055 },
                { name: '运动鞋', value: 2467 },
                { name: '猫粮', value: 2244 },
                { name: '投影仪', value: 1898 },
                { name: '咖啡液', value: 1484 },
                { name: '洗碗机', value: 1112 },
                { name: '冲锋衣', value: 965 },
                { name: '扫地机器人', value: 847 },
                { name: '空气炸锅', value: 582 },
                { name: '面膜', value: 555 },
                { name: '纸巾', value: 550 },
                { name: '牛奶', value: 462 }
            ]
        }]
    };
    chart.setOption(option);
}

// 8. Margin Gauge
function initMarginGaugeChart() {
    const chart = echarts.init(document.getElementById('margin-gauge-chart'));
    charts.marginGauge = chart;

    const option = {
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 100,
                splitNumber: 5,
                itemStyle: {
                    color: '#00eaff',
                    shadowColor: 'rgba(0,138,255,0.45)',
                    shadowBlur: 10,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                progress: {
                    show: true,
                    roundCap: true,
                    width: 10
                },
                pointer: {
                    icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                    length: '75%',
                    width: 10,
                    offsetCenter: [0, '5%']
                },
                axisLine: {
                    roundCap: true,
                    lineStyle: {
                        width: 10
                    }
                },
                axisTick: {
                    splitNumber: 2,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                splitLine: {
                    length: 12,
                    lineStyle: {
                        width: 3,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: 20,
                    color: '#999',
                    fontSize: 10
                },
                title: {
                    show: true
                },
                detail: {
                    backgroundColor: '#fff',
                    borderColor: '#999',
                    borderWidth: 2,
                    width: '60%',
                    lineHeight: 20,
                    height: 20,
                    borderRadius: 8,
                    offsetCenter: [0, '35%'],
                    valueAnimation: true,
                    formatter: function (value) {
                        return '{value|' + value.toFixed(0) + '}{unit|%}';
                    },
                    rich: {
                        value: {
                            fontSize: 20,
                            fontWeight: 'bolder',
                            color: '#777'
                        },
                        unit: {
                            fontSize: 10,
                            color: '#999',
                            padding: [0, 0, -10, 5]
                        }
                    }
                },
                data: [
                    {
                        value: 35,
                        name: '毛利率'
                    }
                ]
            }
        ]
    };
    chart.setOption(option);
}

// 10. Map Chart (World)
function initMapChart() {
    const chart = echarts.init(document.getElementById('map-chart'));
    charts.map = chart;

    const option = {
        tooltip: { trigger: 'item' },
        visualMap: {
            min: 0,
            max: 1000,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: true,
            inRange: {
                color: ['#e0ffff', '#006edd']
            },
            textStyle: { color: '#fff' }
        },
        geo: {
            map: 'world',
            roam: true,
            zoom: 1.2,
            label: { show: false },
            itemStyle: {
                areaColor: '#323c48',
                borderColor: '#111'
            },
            emphasis: {
                itemStyle: {
                    areaColor: '#2a333d'
                },
                label: { show: false }
            }
        },
        series: [
            {
                name: '销售额',
                type: 'heatmap',
                coordinateSystem: 'geo',
                data: [
                    { name: 'China', value: [104.19, 35.86, 950] },
                    { name: 'United States', value: [-95.71, 37.09, 800] },
                    { name: 'Japan', value: [138.25, 36.20, 750] },
                    { name: 'Germany', value: [10.45, 51.16, 600] },
                    { name: 'United Kingdom', value: [-3.43, 55.37, 550] },
                    { name: 'Australia', value: [133.77, -25.27, 400] },
                    { name: 'Canada', value: [-106.34, 56.13, 350] },
                    { name: 'Brazil', value: [-51.92, -14.23, 300] },
                    { name: 'Russia', value: [105.31, 61.52, 250] },
                    { name: 'India', value: [78.96, 20.59, 450] }
                ]
            }
        ]
    };
    chart.setOption(option);
}

// 11. City Rank (Bar)
function initCityRankChart() {
    const chart = echarts.init(document.getElementById('city-rank-chart'));
    charts.cityRank = chart;

    const option = {
        tooltip: { trigger: 'axis' },
        grid: { top: '5%', bottom: '5%', left: '20%', right: '10%', containLabel: true },
        xAxis: { type: 'value', show: false },
        yAxis: {
            type: 'category',
            data: ['上海', '北京', '杭州', '深圳', '广州', '成都', '重庆', '苏州', '南京', '武汉'].reverse(),
            axisLabel: { color: '#fff' },
            axisLine: { show: false },
            axisTick: { show: false }
        },
        series: [{
            type: 'bar',
            data: [950, 920, 880, 850, 800, 750, 700, 650, 600, 550].reverse(),
            itemStyle: {
                color: '#00eaff',
                borderRadius: [0, 5, 5, 0]
            }
        }]
    };
    chart.setOption(option);
}

// 12. Repurchase & Customer Group (Radar)
function initRepurchaseChart() {
    const chart = echarts.init(document.getElementById('repurchase-chart'));
    charts.repurchase = chart;

    const option = {
        tooltip: {},
        radar: {
            indicator: [
                { name: '复购率', max: 100 },
                { name: '客单价', max: 1000 },
                { name: '活跃度', max: 100 },
                { name: '忠诚度', max: 100 },
                { name: '满意度', max: 100 }
            ],
            axisName: { color: '#fff' }
        },
        series: [{
            name: '客户群体分析',
            type: 'radar',
            data: [
                {
                    value: [60, 450, 80, 70, 90],
                    name: 'VIP客户',
                    areaStyle: { color: 'rgba(255, 0, 51, 0.3)' },
                    itemStyle: { color: '#ff0033' }
                },
                {
                    value: [30, 200, 50, 40, 70],
                    name: '普通客户',
                    areaStyle: { color: 'rgba(0, 234, 255, 0.3)' },
                    itemStyle: { color: '#00eaff' }
                }
            ]
        }]
    };
    chart.setOption(option);
}

// Time Selector Interaction
timeSelector.addEventListener('change', (e) => {
    const value = e.target.value;
    // Simulate data update
    console.log('Switching to:', value);
    // In a real app, fetch new data here.
    // For demo, we just randomize some charts
    const newData = generateRandomData(5, 50, 300);
    charts.channelSales.setOption({
        series: [{ data: newData }]
    });
});

// Start
initMap();
