// Initialize ECharts instances
const charts = {};

// DOM Elements
const timestampEl = document.getElementById('timestamp');

// Update Timestamp
function updateTimestamp() {
    const now = new Date();
    timestampEl.textContent = now.toLocaleTimeString();
}
setInterval(updateTimestamp, 1000);
updateTimestamp();

// Init Charts
function initAllCharts() {
    initGenderChart();
    initAgeChart();
    initOccupationChart();
    initZodiacChart();
    initConsumptionChart();
    initInterestChart();
    initUserMap();
    
    // Handle Resize
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(chart => chart && chart.resize());
    });
}

// 1. Gender Chart (Donut)
function initGenderChart() {
    const chart = echarts.init(document.getElementById('gender-chart'));
    charts.gender = chart;

    const option = {
        tooltip: { trigger: 'item' },
        legend: {
            bottom: '5%',
            left: 'center',
            textStyle: { color: '#fff' }
        },
        series: [
            {
                name: '性别分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#0b0f2a',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                },
                labelLine: { show: false },
                data: [
                    { value: 64, name: '男性', itemStyle: { color: '#2979ff' } },
                    { value: 36, name: '女性', itemStyle: { color: '#00eaff' } }
                ]
            }
        ]
    };
    chart.setOption(option);
}

// 2. Age Chart (PictorialBar / Mountain)
function initAgeChart() {
    const chart = echarts.init(document.getElementById('age-chart'));
    charts.age = chart;

    const categories = ['60后', '70后', '80后', '90后', '00后'];
    const data = [120, 200, 450, 680, 350];

    const option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'none' } },
        grid: { top: '15%', bottom: '10%', left: '10%', right: '10%', containLabel: true },
        xAxis: {
            data: categories,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { color: '#fff' }
        },
        yAxis: {
            splitLine: { show: false },
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false }
        },
        series: [{
            name: '用户数量',
            type: 'pictorialBar',
            barCategoryGap: '-130%',
            symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            itemStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00eaff' },
                    { offset: 1, color: '#2979ff' }
                ])
            },
            emphasis: { itemStyle: { opacity: 1 } },
            data: data,
            z: 10
        }]
    };
    chart.setOption(option);
}

// 3. Occupation Chart (Radar)
function initOccupationChart() {
    const chart = echarts.init(document.getElementById('occupation-chart'));
    charts.occupation = chart;

    const option = {
        tooltip: {},
        radar: {
            indicator: [
                { name: '服务员', max: 100 },
                { name: '学生', max: 100 },
                { name: '公务员', max: 100 },
                { name: '个体经营', max: 100 },
                { name: '白领', max: 100 },
                { name: '教职工', max: 100 }
            ],
            axisName: { color: '#00eaff' },
            splitLine: { lineStyle: { color: 'rgba(0, 234, 255, 0.2)' } },
            splitArea: { show: false },
            axisLine: { lineStyle: { color: 'rgba(0, 234, 255, 0.2)' } }
        },
        series: [{
            name: '职业分布',
            type: 'radar',
            data: [
                {
                    value: [60, 90, 40, 70, 85, 50],
                    name: '职业分布',
                    areaStyle: { color: 'rgba(0, 234, 255, 0.4)' },
                    itemStyle: { color: '#00eaff' },
                    lineStyle: { color: '#00eaff' }
                }
            ]
        }]
    };
    chart.setOption(option);
}

// 4. Zodiac Chart (Bar)
function initZodiacChart() {
    const chart = echarts.init(document.getElementById('zodiac-chart'));
    charts.zodiac = chart;

    const data = [
        {name: '白羊', value: 120}, {name: '金牛', value: 150}, {name: '双子', value: 180},
        {name: '巨蟹', value: 140}, {name: '狮子', value: 160}, {name: '处女', value: 200},
        {name: '天秤', value: 190}, {name: '天蝎', value: 170}, {name: '射手', value: 130},
        {name: '摩羯', value: 110}, {name: '水瓶', value: 145}, {name: '双鱼', value: 125}
    ];

    const option = {
        tooltip: { trigger: 'axis' },
        grid: { top: '10%', bottom: '10%', left: '5%', right: '5%', containLabel: true },
        xAxis: {
            type: 'category',
            data: data.map(d => d.name),
            axisLabel: { color: '#fff', interval: 0, fontSize: 10 },
            axisLine: { lineStyle: { color: '#333' } }
        },
        yAxis: { show: false },
        series: [{
            type: 'bar',
            data: data.map(d => d.value),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00eaff' },
                    { offset: 1, color: 'rgba(0, 234, 255, 0.1)' }
                ]),
                borderRadius: [4, 4, 0, 0]
            }
        }]
    };
    chart.setOption(option);
}

// 5. Consumption Chart (Funnel)
function initConsumptionChart() {
    const chart = echarts.init(document.getElementById('consumption-chart'));
    charts.consumption = chart;

    const option = {
        tooltip: { trigger: 'item' },
        series: [{
            name: '消费能力',
            type: 'funnel',
            left: '10%', top: 10, bottom: 10, width: '80%',
            min: 0, max: 100,
            minSize: '0%', maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: { show: true, position: 'inside', color: '#fff' },
            itemStyle: { borderColor: '#fff', borderWidth: 0 },
            data: [
                { value: 60, name: '高消费', itemStyle: { color: '#2979ff' } },
                { value: 40, name: '中高消费', itemStyle: { color: '#00eaff' } },
                { value: 20, name: '中等消费', itemStyle: { color: '#00b0ff' } },
                { value: 10, name: '低消费', itemStyle: { color: '#80d8ff' } }
            ]
        }]
    };
    chart.setOption(option);
}

// 6. Interest Chart (WordCloud - Simulated with Scatter for now if WordCloud not avail, but we have it in other file)
// Assuming echarts-wordcloud is loaded or we use a simple scatter
function initInterestChart() {
    const chart = echarts.init(document.getElementById('interest-chart'));
    charts.interest = chart;

    // Simple Bubble Chart as fallback for WordCloud
    const data = [
        {name: '数码', value: 90}, {name: '美妆', value: 85}, {name: '运动', value: 80},
        {name: '家居', value: 75}, {name: '母婴', value: 70}, {name: '美食', value: 65},
        {name: '旅游', value: 60}, {name: '阅读', value: 55}, {name: '电影', value: 50},
        {name: '游戏', value: 45}, {name: '摄影', value: 40}, {name: '宠物', value: 35}
    ];

    const option = {
        tooltip: { formatter: '{b}: {c}' },
        series: [{
            type: 'graph',
            layout: 'force',
            force: { repulsion: 100, edgeLength: 10 },
            roam: true,
            label: { show: true, color: '#fff' },
            data: data.map(d => ({
                name: d.name,
                value: d.value,
                symbolSize: d.value,
                itemStyle: {
                    color: `rgba(${Math.random()*100}, ${Math.random()*200+55}, 255, 0.8)`
                }
            }))
        }]
    };
    chart.setOption(option);
}

// 7. User Map (China)
function initUserMap() {
    const chart = echarts.init(document.getElementById('user-map'));
    charts.map = chart;

    const option = {
        tooltip: { trigger: 'item' },
        geo: {
            map: 'china',
            roam: true,
            itemStyle: {
                areaColor: '#0b0f2a',
                borderColor: '#00eaff',
                borderWidth: 1,
                shadowColor: 'rgba(0, 234, 255, 0.5)',
                shadowBlur: 10
            },
            emphasis: {
                areaColor: '#2979ff'
            }
        },
        series: [{
            name: '用户分布',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [
                {name: '北京', value: [116.4074, 39.9042, 100]},
                {name: '上海', value: [121.4737, 31.2304, 95]},
                {name: '广州', value: [113.2644, 23.1291, 90]},
                {name: '深圳', value: [114.0859, 22.547, 85]},
                {name: '杭州', value: [120.1551, 30.2741, 80]},
                {name: '成都', value: [104.0665, 30.5723, 75]},
                {name: '武汉', value: [114.3054, 30.5931, 70]}
            ],
            symbolSize: function (val) { return val[2] / 5; },
            itemStyle: { color: '#ffcc00' },
            rippleEffect: { brushType: 'stroke' }
        }]
    };
    chart.setOption(option);
}

// Start
initAllCharts();



