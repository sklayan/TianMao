// Initialize ECharts instances
const charts = {};

// Centralized Category Data
let currentCategory = '全品类'; // Default
const categoryStats = {
    '美妆': { volume: 452.5, margin: 65, trendBase: 200 },
    '数码': { volume: 418.2, margin: 25, trendBase: 180 },
    '家电': { volume: 385.6, margin: 30, trendBase: 160 },
    '服饰': { volume: 356.8, margin: 55, trendBase: 140 },
    '食品': { volume: 210.4, margin: 40, trendBase: 120 },
    '母婴': { volume: 185.3, margin: 45, trendBase: 100 },
    '家居': { volume: 160.7, margin: 50, trendBase: 90 },
    '运动': { volume: 145.9, margin: 48, trendBase: 80 },
    '个护': { volume: 120.1, margin: 60, trendBase: 70 },
    '生鲜': { volume: 95.4, margin: 35, trendBase: 60 }
};

// Mock Data Generators
function generateRandomData(length, min, max) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// DOM Elements
const timestampEl = document.getElementById('timestamp');

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
    initParticles(); // New: Particle Background
    initConversionCards();
    initTrafficSourceChart();
    initCategoryRankChart();
    initCategoryTrendChart();
    initWordCloudChart();
    initMarginGaugeChart();
    initPriceRangeChart();
    initRepurchaseChart();

    // Initialize with Total Data
    updateCategoryCharts('全品类');

    // Start Data Stream
    startDataStream();

    // Handle Resize
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(chart => chart && chart.resize());
    });
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

function renderConversionCards(data) {
    const container = document.getElementById('conversion-cards');
    const displayData = data || kpiData;
    // Icons mapping
    const icons = ['🖱️', '🔄', '💰'];
    
    container.innerHTML = displayData.map((item, index) => `
        <div class="kpi-card" onclick="handleKpiClick(this, ${index})">
            <div class="kpi-header">
                <div class="kpi-title">${item.title}</div>
                <div class="kpi-icon-bg">${icons[index] || '📊'}</div>
            </div>
            <div class="kpi-body">
                <div class="kpi-value">
                    ${item.prefix || ''}${typeof item.value === 'number' ? item.value.toFixed(1) : item.value}<span class="kpi-unit">${item.unit}</span>
                </div>
            </div>
            <div class="kpi-footer">
                <span class="trend-label">周同比</span>
                <div class="kpi-trend ${item.up ? 'trend-up' : 'trend-down'}">
                    ${item.up ? '▲' : '▼'} ${item.trend}%
                </div>
            </div>
            <!-- Decorative background element -->
            <div class="card-decoration"></div>
        </div>
    `).join('');
}

function handleKpiClick(element, index) {
    // Remove active class from all cards
    document.querySelectorAll('.kpi-card').forEach(card => card.classList.remove('active'));
    // Add active class to clicked card
    element.classList.add('active');
    
    // Simulate interaction: Update Traffic Source based on KPI
    const kpi = kpiData[index];
    if (charts.trafficSource) {
        let newData = [];
        if (kpi.title.includes('转化率')) {
             newData = [
                { value: 45, name: '直接访问' },
                { value: 40, name: '搜索引擎' },
                { value: 10, name: '社交媒体' },
                { value: 3, name: '广告投放' },
                { value: 2, name: '外部链接' }
            ];
        } else if (kpi.title.includes('点击率')) {
             newData = [
                { value: 10, name: '直接访问' },
                { value: 20, name: '搜索引擎' },
                { value: 40, name: '社交媒体' },
                { value: 25, name: '广告投放' },
                { value: 5, name: '外部链接' }
            ];
        } else {
             newData = [
                { value: 30, name: '直接访问' },
                { value: 30, name: '搜索引擎' },
                { value: 20, name: '社交媒体' },
                { value: 10, name: '广告投放' },
                { value: 10, name: '外部链接' }
            ];
        }
        charts.trafficSource.setOption({ series: [{ data: newData }] });
    }
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
            // Slowly increase the last value to simulate real-time sales
            const lastIdx = data.length - 1;
            data[lastIdx] = data[lastIdx] + Math.floor(Math.random() * 5);
            charts.categoryTrend.setOption({ series: [{ data: data }] });
        }

        // 4. Update Margin Gauge
        if (charts.marginGauge) {
            let baseMargin = 35; // Default for Total
            if (currentCategory !== '全品类' && categoryStats[currentCategory]) {
                baseMargin = categoryStats[currentCategory].margin;
            }

            // Fluctuate slightly around base margin (+/- 2%)
            const fluctuation = (Math.random() - 0.5) * 4;
            const newVal = +(baseMargin + fluctuation).toFixed(2);
            
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
        // Unified Blue/Cyan Theme with Gold Accent
        color: ['#2979ff', '#00eaff', '#00b0ff', '#40c4ff', '#82b1ff', '#ffcc00'],
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
        series: [
            {
                name: '流量来源',
                type: 'pie',
                radius: [10, 80],
                center: ['50%', '50%'],
                roseType: 'area',
                itemStyle: { borderRadius: 5, borderColor: '#0b0f2a', borderWidth: 2 },
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

    chart.on('click', function (params) {
        // Simulate interaction: Click traffic source -> Update KPI
        const source = params.name;
        let newKpi = JSON.parse(JSON.stringify(kpiData)); // Deep copy
        if (source === '社交媒体' || source === '广告投放') {
            newKpi[0].value = +(newKpi[0].value * 1.2).toFixed(1); // CTR Up
            newKpi[1].value = +(newKpi[1].value * 0.8).toFixed(1); // CVR Down
        } else if (source === '搜索引擎' || source === '直接访问') {
            newKpi[1].value = +(newKpi[1].value * 1.2).toFixed(1); // CVR Up
        }
        kpiData = newKpi;
        renderConversionCards(newKpi);
    });
}

// 5. Category Rank (Horizontal Bar)
function initCategoryRankChart() {
    const chart = echarts.init(document.getElementById('category-rank-chart'));
    charts.categoryRank = chart;

    const option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { top: '5%', bottom: '5%', left: '20%', right: '15%', containLabel: true },
        xAxis: { type: 'value', show: false },
        yAxis: {
            type: 'category',
            data: Object.keys(categoryStats).reverse(),
            axisLabel: { color: '#fff', fontSize: 13 },
            axisLine: { show: false },
            axisTick: { show: false }
        },
        series: [{
            type: 'bar',
            data: Object.keys(categoryStats).map(k => categoryStats[k].volume).reverse(),
            label: { 
                show: true, 
                position: 'right', 
                color: '#fff',
                formatter: '{c} 亿元',
                fontSize: 13,
                fontWeight: 'bold',
                fontFamily: 'DIN'
            },
            itemStyle: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: '#00eaff' },
                    { offset: 1, color: '#0091ea' }
                ]),
                borderRadius: [0, 4, 4, 0]
            },
            barWidth: '60%'
        }]
    };
    chart.setOption(option);

    // Add click event for interactivity
    chart.on('click', function (params) {
        if (params.componentType === 'series') {
            updateCategoryCharts(params.name);
        }
    });

    // Add blank area click to reset
    chart.getZr().on('click', function (params) {
        if (!params.target) {
            resetCategoryCharts();
        }
    });
}

// 6. Category Trend (Line)
function initCategoryTrendChart() {
    const chart = echarts.init(document.getElementById('category-trend-chart'));
    charts.categoryTrend = chart;

    // Generate 24h data with finer granularity (every 30 mins)
    const hours = [];
    const dataCurrent = [];
    const dataLast = [];
    let valC = 100;
    let valL = 80;
    
    for (let i = 0; i <= 48; i++) {
        const h = Math.floor(i / 2);
        const m = (i % 2) * 30;
        hours.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        
        // Upward trend with slight noise
        valC += Math.random() * 150 - 10; 
        valL += Math.random() * 100 - 10;
        
        dataCurrent.push(Math.floor(valC));
        dataLast.push(Math.floor(valL));
    }

    const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['2025年实时', '2024年同期'], textStyle: { color: '#fff' } },
        grid: { top: '15%', bottom: '15%', left: '5%', right: '5%', containLabel: true },
        dataZoom: [
            { type: 'inside', start: 0, end: 100 },
            { type: 'slider', show: true, bottom: 0, height: 15, borderColor: 'transparent', backgroundColor: 'rgba(255,255,255,0.1)', textStyle: { color: '#fff' } }
        ],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: hours,
            axisLabel: { color: '#fff' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
        },
        series: [
            {
                name: '2025年实时',
                type: 'line',
                smooth: true,
                data: dataCurrent,
                itemStyle: { color: '#2979ff' }, // Changed to Blue
                areaStyle: { opacity: 0.2, color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(41, 121, 255, 0.5)'}, {offset: 1, color: 'rgba(41, 121, 255, 0.0)'}]) },
                animationDuration: 8000,
                animationEasing: 'linear'
            },
            {
                name: '2024年同期',
                type: 'line',
                smooth: true,
                data: dataLast,
                itemStyle: { color: '#00eaff' }, // Changed to Cyan
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
                    const colors = ['#00eaff', '#ffffff', '#ffcc00', '#ff0033', '#0091ea'];
                    return colors[Math.floor(Math.random() * colors.length)];
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
                    shadowColor: 'rgba(0, 234, 255, 0.45)',
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

// 10. Price Range Structure (Funnel)
function initPriceRangeChart() {
    const chart = echarts.init(document.getElementById('price-range-chart'));
    charts.priceRange = chart;

    const option = {
        color: ['#00eaff', '#00b0ff', '#2979ff', '#304ffe', '#536dfe'],
        tooltip: { 
            trigger: 'item', 
            formatter: function(params) {
                return `${params.seriesName} <br/>${params.name} : ${params.value} 万单 (${params.percent}%)`;
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'center',
            textStyle: { color: '#fff' },
            data: ['0-100元', '100-300元', '300-500元', '500-1000元', '1000-3000元', '3000元+']
        },
        series: [
            {
                name: '价格带销量分布',
                type: 'funnel',
                left: '20%',
                top: 20,
                bottom: 20,
                width: '70%',
                min: 0,
                max: 25000, // Adjusted max for new scale
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                    show: true,
                    position: 'inside',
                    color: '#fff',
                    formatter: '{c} 万单'
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                data: [
                    // Initial data for Total (approx 700 million orders total)
                    { value: 15000, name: '0-100元' },
                    { value: 20000, name: '100-300元' },
                    { value: 18000, name: '300-500元' },
                    { value: 12000, name: '500-1000元' },
                    { value: 8000, name: '1000-3000元' },
                    { value: 4000, name: '3000元+' }
                ]
            }
        ]
    };
    chart.setOption(option);
}

// 12. Repurchase & Customer Group (Radar)
function initRepurchaseChart() {
    const chart = echarts.init(document.getElementById('repurchase-chart'));
    charts.repurchase = chart;

    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(11, 15, 42, 0.9)',
            borderColor: '#00eaff',
            textStyle: { color: '#fff' },
            formatter: function(params) {
                const name = params.name;
                const values = params.value;
                // Indicators: Repurchase, AOV, Activity, Loyalty, Satisfaction
                return `
                    <div style="font-weight:bold; color:${params.color}; margin-bottom:5px;">${name}</div>
                    复购率: ${values[0]}%<br/>
                    客单价: ¥${values[1]}<br/>
                    活跃度: ${values[2]}<br/>
                    忠诚度: ${values[3]}<br/>
                    满意度: ${values[4]}
                `;
            }
        },
        radar: {
            indicator: [
                { name: '复购率', max: 100 },
                { name: '客单价', max: 1000 }, // Will be updated dynamically
                { name: '活跃度', max: 100 },
                { name: '忠诚度', max: 100 },
                { name: '满意度', max: 100 }
            ],
            axisName: { color: '#fff' },
            splitArea: {
                areaStyle: {
                    color: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
                }
            }
        },
        series: [{
            name: '客户群体分析',
            type: 'radar',
            data: [] // Initial data will be set by updateCategoryCharts
        }]
    };
    chart.setOption(option);
}

// Helper: Get Data for Category Interaction
function getCategoryData(category) {
    // Default KPI and Traffic Source Data for Total
    let kpi = [
        { title: '点击率 (CTR)', value: 4.5, unit: '%', trend: 0.5, up: true },
        { title: '转化率 (CVR)', value: 2.1, unit: '%', trend: 0.1, up: false },
        { title: '客单价', value: 350, unit: '', prefix: '¥', trend: 12, up: true }
    ];
    
    let trafficSourceData = [
        { value: 40, name: '直接访问' },
        { value: 38, name: '搜索引擎' },
        { value: 32, name: '社交媒体' },
        { value: 30, name: '广告投放' },
        { value: 28, name: '外部链接' }
    ];

    if (category === '全品类') {
        const words = [
            { name: '智能手机', value: 10000 }, { name: '羽绒服', value: 6181 },
            { name: '洗地机', value: 4386 }, { name: '面霜', value: 4055 },
            { name: '运动鞋', value: 2467 }, { name: '猫粮', value: 2244 },
            { name: '投影仪', value: 1898 }, { name: '咖啡液', value: 1484 },
            { name: '洗碗机', value: 1112 }, { name: '冲锋衣', value: 965 },
            { name: '扫地机器人', value: 847 }, { name: '空气炸锅', value: 582 },
            { name: '面膜', value: 555 }, { name: '纸巾', value: 550 },
            { name: '牛奶', value: 462 }
        ];
        const margin = 35; 
        const dataCurrent = [];
        const dataLast = [];
        let valC = 1000; 
        let valL = 800;
        for (let i = 0; i <= 48; i++) {
            valC += Math.random() * 150 - 10; 
            valL += Math.random() * 100 - 10;
            dataCurrent.push(Math.floor(valC));
            dataLast.push(Math.floor(valL));
        }
        // Total Orders ~ 700 million (70000 wan)
        const priceRange = [
            { value: 15000, name: '0-100元' },
            { value: 20000, name: '100-300元' },
            { value: 18000, name: '300-500元' },
            { value: 12000, name: '500-1000元' },
            { value: 8000, name: '1000-3000元' },
            { value: 4000, name: '3000元+' }
        ];

        // Generate Repurchase Data for Total
        const aov = kpi[2].value;
        const vipAov = Math.floor(aov * 2.2);
        const normalAov = Math.floor(aov * 0.7);
        const maxAov = Math.max(vipAov, 1000);

        const repurchaseData = {
            maxAov: maxAov,
            data: [
                {
                    value: [30, normalAov, 50, 40, 70],
                    name: '普通客户',
                    areaStyle: { color: 'rgba(0, 234, 255, 0.3)' },
                    itemStyle: { color: '#00eaff' },
                    z: 2
                },
                {
                    value: [60, vipAov, 80, 70, 90],
                    name: 'VIP客户',
                    areaStyle: { color: 'rgba(255, 0, 51, 0.3)' },
                    itemStyle: { color: '#ff0033' },
                    z: 1
                }
            ]
        };

        return { words, margin, trend: { current: dataCurrent, last: dataLast }, priceRange, kpi, trafficSource: trafficSourceData, repurchase: repurchaseData };
    }

    const stats = categoryStats[category] || categoryStats['美妆'];

    // Customize KPI based on category characteristics
    if (category === '美妆' || category === '个护') {
        kpi = [
            { title: '点击率 (CTR)', value: 5.2, unit: '%', trend: 0.8, up: true },
            { title: '转化率 (CVR)', value: 3.5, unit: '%', trend: 0.3, up: true },
            { title: '客单价', value: 280, unit: '', prefix: '¥', trend: 5, up: false }
        ];
        trafficSourceData = [
            { value: 20, name: '直接访问' },
            { value: 30, name: '搜索引擎' },
            { value: 60, name: '社交媒体' }, // High social
            { value: 40, name: '广告投放' },
            { value: 10, name: '外部链接' }
        ];
    } else if (category === '数码' || category === '家电') {
        kpi = [
            { title: '点击率 (CTR)', value: 3.1, unit: '%', trend: 0.2, up: false },
            { title: '转化率 (CVR)', value: 1.2, unit: '%', trend: 0.1, up: true },
            { title: '客单价', value: 2500, unit: '', prefix: '¥', trend: 150, up: true }
        ];
        trafficSourceData = [
            { value: 50, name: '直接访问' },
            { value: 60, name: '搜索引擎' }, // High search
            { value: 20, name: '社交媒体' },
            { value: 30, name: '广告投放' },
            { value: 15, name: '外部链接' }
        ];
    } else {
        // Randomize slightly for others
        kpi = [
            { title: '点击率 (CTR)', value: +(3 + Math.random() * 2).toFixed(1), unit: '%', trend: 0.2, up: Math.random() > 0.5 },
            { title: '转化率 (CVR)', value: +(1 + Math.random() * 2).toFixed(1), unit: '%', trend: 0.1, up: Math.random() > 0.5 },
            { title: '客单价', value: Math.floor(100 + Math.random() * 400), unit: '', prefix: '¥', trend: 10, up: Math.random() > 0.5 }
        ];
        trafficSourceData = [
            { value: Math.floor(Math.random() * 50), name: '直接访问' },
            { value: Math.floor(Math.random() * 50), name: '搜索引擎' },
            { value: Math.floor(Math.random() * 50), name: '社交媒体' },
            { value: Math.floor(Math.random() * 50), name: '广告投放' },
            { value: Math.floor(Math.random() * 50), name: '外部链接' }
        ];
    }

    const baseWords = {
        '美妆': ['面霜', '面膜', '口红', '精华', '粉底液', '防晒', '眼霜', '香水', '卸妆水', '眉笔'],
        '数码': ['手机', '平板', '耳机', '相机', '智能手表', '充电宝', '路由器', '键盘', '鼠标', '显示器'],
        '家电': ['冰箱', '洗衣机', '空调', '电视', '微波炉', '烤箱', '吸尘器', '吹风机', '电饭煲', '加湿器'],
        '服饰': ['羽绒服', '毛衣', '牛仔裤', '连衣裙', '卫衣', '外套', '衬衫', 'T恤', '短裙', '风衣'],
        '食品': ['零食', '牛奶', '坚果', '巧克力', '饼干', '方便面', '饮料', '茶叶', '咖啡', '麦片'],
        '母婴': ['奶粉', '纸尿裤', '婴儿车', '玩具', '童装', '奶瓶', '湿巾', '孕妇装', '辅食', '安全座椅'],
        '家居': ['沙发', '床垫', '衣柜', '餐桌', '椅子', '窗帘', '地毯', '灯具', '收纳盒', '抱枕'],
        '运动': ['跑鞋', '运动服', '瑜伽垫', '哑铃', '篮球', '足球', '泳衣', '帐篷', '登山鞋', '护膝'],
        '个护': ['洗发水', '沐浴露', '牙膏', '牙刷', '护发素', '洗手液', '卫生巾', '剃须刀', '发膜', '身体乳'],
        '生鲜': ['苹果', '香蕉', '牛肉', '猪肉', '鸡蛋', '海鲜', '蔬菜', '三文鱼', '车厘子', '草莓']
    };

    const words = (baseWords[category] || baseWords['美妆']).map(name => ({
        name,
        value: Math.floor(Math.random() * 5000) + 1000
    }));

    const margin = stats.margin;

    // Generate trend data based on stats.trendBase
    const dataCurrent = [];
    const dataLast = [];
    let valC = stats.trendBase;
    let valL = stats.trendBase * 0.8;
    
    for (let i = 0; i <= 48; i++) {
        valC += Math.random() * 40 - 2; 
        valL += Math.random() * 30 - 2;
        if (valC < 0) valC = 0;
        if (valL < 0) valL = 0;
        dataCurrent.push(Math.floor(valC));
        dataLast.push(Math.floor(valL));
    }

    // Generate Price Range Data
    // Ranges: 0-100, 100-300, 300-500, 500-1000, 1000-3000, 3000+
    let priceDist = [20, 30, 20, 15, 10, 5]; // Default distribution
    if (category === '数码' || category === '家电') {
        priceDist = [5, 10, 15, 20, 30, 20]; // Higher prices
    } else if (category === '食品' || category === '生鲜' || category === '个护') {
        priceDist = [40, 30, 15, 10, 5, 0]; // Lower prices
    } else if (category === '美妆' || category === '服饰') {
        priceDist = [10, 25, 30, 20, 10, 5]; // Mid prices
    }
    
    // Calculate approximate total orders based on GMV and AOV
    // GMV in Yi (10^8), AOV in Yuan
    // Orders = GMV * 10^8 / AOV
    // We want result in Wan (10^4) -> GMV * 10000 / AOV
    const gmv = stats.volume;
    const aov = kpi[2].value;
    const totalOrdersWan = Math.floor((gmv * 10000) / aov);
    
    // Add some randomness
    const ranges = ['0-100元', '100-300元', '300-500元', '500-1000元', '1000-3000元', '3000元+'];
    const priceData = priceDist.map((base, index) => ({
        value: Math.floor((base / 100) * totalOrdersWan),
        name: ranges[index]
    }));

    // Generate Repurchase Data consistent with AOV
    const vipAov = Math.floor(aov * 2.2);
    const normalAov = Math.floor(aov * 0.7);
    const maxAov = Math.max(vipAov, 1000); // Dynamic max for radar axis

    const repurchaseData = {
        maxAov: maxAov,
        data: [
            {
                value: [
                    Math.floor(20 + Math.random() * 20), // Repurchase Rate
                    normalAov, // AOV
                    Math.floor(40 + Math.random() * 20), // Activity
                    Math.floor(30 + Math.random() * 20), // Loyalty
                    Math.floor(60 + Math.random() * 20)  // Satisfaction
                ],
                name: '普通客户',
                areaStyle: { color: 'rgba(0, 234, 255, 0.3)' },
                itemStyle: { color: '#00eaff' },
                z: 2 // Ensure Normal is on top for tooltip priority
            },
            {
                value: [
                    Math.floor(60 + Math.random() * 20), // Repurchase Rate
                    vipAov, // AOV
                    Math.floor(80 + Math.random() * 10), // Activity
                    Math.floor(70 + Math.random() * 20), // Loyalty
                    Math.floor(85 + Math.random() * 10)  // Satisfaction
                ],
                name: 'VIP客户',
                areaStyle: { color: 'rgba(255, 0, 51, 0.3)' },
                itemStyle: { color: '#ff0033' },
                z: 1
            }
        ]
    };

    return { words, margin, trend: { current: dataCurrent, last: dataLast }, priceRange: priceData, kpi, trafficSource: trafficSourceData, repurchase: repurchaseData };
}

function resetCategoryCharts() {
    updateCategoryCharts('全品类');
}

function updateCategoryCharts(category) {
    currentCategory = category;
    
    // Update Titles
    document.getElementById('trend-chart-title').textContent = category + '销售趋势';
    document.getElementById('wordcloud-title').textContent = category + '热销词云';
    document.getElementById('margin-title').textContent = category + '毛利贡献';

    const data = getCategoryData(category);

    // Update KPI Cards
    kpiData = data.kpi; // Update global data so stream continues correctly
    renderConversionCards(data.kpi);

    // Update Traffic Source
    if (charts.trafficSource) {
        charts.trafficSource.setOption({
            series: [{ data: data.trafficSource }]
        });
    }

    // Update Trend Chart
    if (charts.categoryTrend) {
        charts.categoryTrend.setOption({
            // title: { text: category + '销售趋势', textStyle: { color: '#fff', fontSize: 14 }, top: '5%', left: 'center' },
            series: [
                { name: '2025年实时', data: data.trend.current },
                { name: '2024年同期', data: data.trend.last }
            ]
        });
    }

    // Update Price Range Chart
    if (charts.priceRange) {
        // Dynamic max calculation to ensure the funnel is always wide enough
        const maxVal = Math.max(...data.priceRange.map(d => d.value));
        charts.priceRange.setOption({
            series: [{ 
                max: maxVal,
                data: data.priceRange 
            }]
        });
    }

    // Update Word Cloud
    if (charts.wordCloud) {
        charts.wordCloud.setOption({
            series: [{ data: data.words }]
        });
    }

    // Update Margin Gauge
    if (charts.marginGauge) {
        charts.marginGauge.setOption({
            series: [{ data: [{ value: data.margin, name: '毛利率' }] }]
        });
    }

    // Update Repurchase Chart
    if (charts.repurchase) {
        charts.repurchase.setOption({
            radar: {
                indicator: [
                    { name: '复购率', max: 100 },
                    { name: '客单价', max: data.repurchase.maxAov * 1.2 }, // Add buffer
                    { name: '活跃度', max: 100 },
                    { name: '忠诚度', max: 100 },
                    { name: '满意度', max: 100 }
                ]
            },
            series: [{
                data: data.repurchase.data
            }]
        });
    }
}

// --- Visual Effects ---

// Particle System
let particleCtx;
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    particleCtx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            particleCtx.fillStyle = 'rgba(0, 234, 255, 0.5)';
            particleCtx.beginPath();
            particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            particleCtx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    
    function animate() {
        particleCtx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw connections
        particleCtx.strokeStyle = 'rgba(0, 234, 255, 0.1)';
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    particleCtx.beginPath();
                    particleCtx.moveTo(particles[i].x, particles[i].y);
                    particleCtx.lineTo(particles[j].x, particles[j].y);
                    particleCtx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
    
    // Handle Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Start
initMap();
