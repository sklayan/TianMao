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
    initPaymentUserChart();
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

// 3. Payment & User Growth Chart (Pie + Bar)
function initPaymentUserChart() {
    const chart = echarts.init(document.getElementById('payment-user-chart'));
    charts.paymentUser = chart;

    const option = {
        tooltip: { 
            trigger: 'item',
            formatter: function(params) {
                if (params.seriesName === '支付方式') {
                    return `${params.marker}${params.name} : ${params.value}%`;
                } else {
                    return `${params.marker}${params.name} : ${params.value}万人`;
                }
            }
        },
        title: [
            { text: '无线支付占比', left: '12%', top: '5%', textStyle: { color: 'rgba(255,255,255,0.7)', fontSize: 12 } },
            { text: '消费者人数', left: '62%', top: '5%', textStyle: { color: 'rgba(255,255,255,0.7)', fontSize: 12 } }
        ],
        grid: {
            left: '55%',
            right: '5%',
            top: '25%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['2024年', '2025年'],
            axisLabel: { color: '#fff' },
            axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            splitLine: { show: false },
            axisLabel: { show: false }
        },
        graphic: [
            {
                type: 'text',
                left: '25%',
                top: '53%',
                style: {
                    text: '📱',
                    font: '30px sans-serif',
                    textAlign: 'center',
                    fill: '#fff'
                }
            }
        ],
        series: [
            // Pie Chart (Left)
            {
                name: '支付方式',
                type: 'pie',
                radius: ['45%', '65%'],
                center: ['25%', '55%'],
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{d}%',
                    color: '#fff'
                },
                labelLine: { show: true, length: 5, length2: 5 },
                data: [
                    { value: 85, name: '无线端', itemStyle: { color: '#00eaff' } },
                    { value: 15, name: 'PC端', itemStyle: { color: '#2979ff' } }
                ]
            },
            // Bar Chart (Right)
            {
                name: '消费者人数',
                type: 'bar',
                barWidth: '40%',
                data: [
                    { value: 4500, itemStyle: { color: '#2979ff' } },
                    { value: 6800, itemStyle: { color: '#00eaff' } }
                ],
                label: {
                    show: true,
                    position: 'top',
                    color: '#fff',
                    formatter: '{c}万'
                }
            }
        ]
    };
    chart.setOption(option);
}

// Data Stream Simulation
function startDataStream() {
    // State for smoother animations
    let currentUsers = 6800;
    let mobileShare = 85.0;

    setInterval(() => {
        // 1. Update Payment & User Chart
        if (charts.paymentUser) {
            // Mobile share: very subtle fluctuation around 85%
            if (Math.random() > 0.5) {
                mobileShare += (Math.random() - 0.5) * 0.1;
                // Clamp between 84% and 86%
                mobileShare = Math.max(84, Math.min(86, mobileShare));
            }
            
            const mobileVal = parseFloat(mobileShare.toFixed(2));
            const pcVal = parseFloat((100 - mobileVal).toFixed(2));
            
            // User count: strictly increasing (simulating growth)
            // Add 0-2 users every cycle
            currentUsers += Math.floor(Math.random() * 3);

            charts.paymentUser.setOption({
                series: [
                    { data: [{ value: mobileVal, name: '无线端', itemStyle: { color: '#00eaff' } }, { value: pcVal, name: 'PC端', itemStyle: { color: '#2979ff' } }] },
                    { data: [{ value: 4500, itemStyle: { color: '#2979ff' } }, { value: currentUsers, itemStyle: { color: '#00eaff' } }] }
                ]
            });
        }

        // 2. Update Category Rank (Bar Chart)
        if (charts.categoryRank) {
            const option = charts.categoryRank.getOption();
            const data = option.series[0].data;
            // Slightly fluctuate values to simulate real-time sales
            const newData = data.map(val => {
                const change = Math.floor(Math.random() * 5); // Only increase or stay same
                return val + change;
            });
            charts.categoryRank.setOption({ series: [{ data: newData }] });
        }

        // 3. Update Category Trend (Line Chart)
        if (charts.categoryTrend) {
            const option = charts.categoryTrend.getOption();
            const data = option.series[0].data;
            // Slowly increase the last value
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

            // Fluctuate slightly around base margin (+/- 0.5%)
            const fluctuation = (Math.random() - 0.5) * 1;
            const newVal = +(baseMargin + fluctuation).toFixed(2);
            
            charts.marginGauge.setOption({
                series: [{ data: [{ value: newVal, name: '毛利率' }] }]
            });
        }

        // 5. Update Price Range (Funnel)
        if (charts.priceRange) {
            const option = charts.priceRange.getOption();
            const data = option.series[0].data;
            const newData = data.map(item => {
                // Sales only increase
                const change = Math.floor(Math.random() * 10);
                return { ...item, value: item.value + change };
            });
            charts.priceRange.setOption({ series: [{ data: newData }] });
        }

        // 6. Update Repurchase (Radar) - Very subtle breathing
        if (charts.repurchase) {
             const option = charts.repurchase.getOption();
             const seriesData = option.series[0].data;
             const newData = seriesData.map(group => {
                 const newValues = group.value.map((val, idx) => {
                     // Index 1 is AOV (Money), others are % or score
                     const range = idx === 1 ? 2 : 0.5;
                     const change = (Math.random() - 0.5) * range;
                     let res = val + change;
                     if (idx !== 1) res = Math.max(0, Math.min(100, res));
                     return parseFloat(res.toFixed(1));
                 });
                 return { ...group, value: newValues };
             });
             charts.repurchase.setOption({ series: [{ data: newData }] });
        }

        // 7. Update Traffic Source (Pie)
        if (charts.trafficSource) {
            const option = charts.trafficSource.getOption();
            const data = option.series[0].data;
            // Slowly increase values to simulate incoming traffic
            const newData = data.map(item => {
                // Increase by a small amount (0 ~ 0.05) to simulate real-time traffic accumulation
                // Since unit is '万次' (10k), 0.01 = 100 visits
                const change = Math.random() * 0.05; 
                return { ...item, value: parseFloat((item.value + change).toFixed(2)) };
            });
            charts.trafficSource.setOption({ series: [{ data: newData }] });

            // 8. Update Traffic Details (Modal Data)
            Object.keys(trafficDetails).forEach(key => {
                const detail = trafficDetails[key];
                
                // Update Trend (Fluctuate last point only, don't shift days)
                const lastIdx = detail.trend.length - 1;
                const change = Math.floor((Math.random() - 0.5) * 10);
                detail.trend[lastIdx] = Math.max(0, detail.trend[lastIdx] + change);

                // Update Metrics (Simulate fluctuation)
                // 0: Duration (seconds), 1: Bounce Rate (%), 2: New User (%)
                // Duration
                detail.metrics[0].raw += Math.floor((Math.random() - 0.5) * 5);
                const m = Math.floor(detail.metrics[0].raw / 60);
                const s = detail.metrics[0].raw % 60;
                detail.metrics[0].value = `${m}m ${s.toString().padStart(2, '0')}s`;

                // Bounce Rate
                detail.metrics[1].raw = Math.max(0, Math.min(100, detail.metrics[1].raw + (Math.random() - 0.5) * 2));
                detail.metrics[1].value = `${detail.metrics[1].raw.toFixed(0)}%`;

                // New User
                detail.metrics[2].raw = Math.max(0, Math.min(100, detail.metrics[2].raw + (Math.random() - 0.5) * 2));
                detail.metrics[2].value = `${detail.metrics[2].raw.toFixed(0)}%`;
            });

            // If Modal is Open, Update UI
            if (currentModalSource && trafficDetails[currentModalSource]) {
                const detail = trafficDetails[currentModalSource];
                
                // Update Main Value & Percent from Chart Data
                const currentItem = newData.find(i => i.name === currentModalSource);
                if (currentItem) {
                    const total = newData.reduce((sum, i) => sum + i.value, 0);
                    const percent = ((currentItem.value / total) * 100).toFixed(2);
                    
                    const valEl = document.getElementById('modal-traffic-val');
                    const perEl = document.getElementById('modal-traffic-percent');
                    if (valEl) valEl.textContent = `${currentItem.value}万次`;
                    if (perEl) perEl.textContent = `${percent}%`;
                }

                // Update Metrics
                detail.metrics.forEach((m, i) => {
                    const el = document.getElementById(`metric-val-${i}`);
                    if (el) el.textContent = m.value;
                });

                // Update Chart
                if (charts.modalTrend) {
                    charts.modalTrend.setOption({
                        series: [{ data: detail.trend }]
                    });
                }
            }
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
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c}万次 ({d}%)' },
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

    // Interaction: Click to show details
    chart.on('click', function (params) {
        showTrafficDetails(params.name, params.value, params.percent);
    });
}

// Traffic Source Details Data
let currentModalSource = null; // Track open modal source
const trafficDetails = {
    '直接访问': {
        desc: '用户直接输入网址或通过收藏夹访问，反映了品牌的高忠诚度。',
        metrics: [
            { label: '平均停留时长', value: '5m 30s', raw: 330 }, // raw in seconds
            { label: '跳出率', value: '25%', raw: 25 },
            { label: '新用户占比', value: '15%', raw: 15 }
        ],
        trend: [120, 132, 101, 134, 90, 230, 210]
    },
    '搜索引擎': {
        desc: '来自百度、谷歌等搜索引擎的自然流量和付费流量。',
        metrics: [
            { label: '平均停留时长', value: '3m 10s', raw: 190 },
            { label: '跳出率', value: '45%', raw: 45 },
            { label: '新用户占比', value: '60%', raw: 60 }
        ],
        trend: [220, 182, 191, 234, 290, 330, 310]
    },
    '社交媒体': {
        desc: '来自微博、抖音、小红书等社交平台的引流。',
        metrics: [
            { label: '平均停留时长', value: '4m 45s', raw: 285 },
            { label: '跳出率', value: '35%', raw: 35 },
            { label: '新用户占比', value: '75%', raw: 75 }
        ],
        trend: [150, 232, 201, 154, 190, 330, 410]
    },
    '广告投放': {
        desc: '通过展示广告、信息流广告等付费渠道获取的流量。',
        metrics: [
            { label: '平均停留时长', value: '2m 20s', raw: 140 },
            { label: '跳出率', value: '55%', raw: 55 },
            { label: '新用户占比', value: '85%', raw: 85 }
        ],
        trend: [320, 332, 301, 334, 390, 330, 320]
    },
    '外部链接': {
        desc: '来自合作伙伴、友链或其他网站的引荐流量。',
        metrics: [
            { label: '平均停留时长', value: '3m 50s', raw: 230 },
            { label: '跳出率', value: '40%', raw: 40 },
            { label: '新用户占比', value: '40%', raw: 40 }
        ],
        trend: [820, 932, 901, 934, 1290, 1330, 1320]
    }
};

function showTrafficDetails(name, value, percent) {
    const modal = document.getElementById('traffic-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    
    if (!modal) return;

    currentModalSource = name; // Set current source

    const details = trafficDetails[name] || {
        desc: '暂无详细描述',
        metrics: [],
        trend: [0,0,0,0,0,0,0]
    };

    title.textContent = `${name} - 详细分析`;
    
    let metricsHtml = details.metrics.map((m, i) => `
        <div class="detail-item">
            <span class="detail-label">${m.label}</span>
            <span class="detail-value" id="metric-val-${i}">${m.value}</span>
        </div>
    `).join('');

    body.innerHTML = `
        <div style="margin-bottom: 20px; color: #ccc;">${details.desc}</div>
        <div class="detail-item">
            <span class="detail-label">当前流量</span>
            <span class="detail-value" style="color: var(--accent-color); font-size: 24px;" id="modal-traffic-val">${value}万次</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">占比</span>
            <span class="detail-value" id="modal-traffic-percent">${percent}%</span>
        </div>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 15px 0;">
        ${metricsHtml}
        <div class="detail-chart" id="modal-trend-chart"></div>
    `;

    modal.style.display = 'flex';

    // Init mini chart in modal
    setTimeout(() => {
        const chartDom = document.getElementById('modal-trend-chart');
        if (chartDom) {
            // Dispose existing instance if any to avoid warning
            const existingChart = echarts.getInstanceByDom(chartDom);
            if (existingChart) existingChart.dispose();

            const myChart = echarts.init(chartDom);
            charts.modalTrend = myChart; // Store reference

            const option = {
                title: { text: '近7日流量趋势', textStyle: { color: '#fff', fontSize: 12 }, left: 'center', top: 10 },
                grid: { top: 40, bottom: 20, left: 30, right: 20 },
                xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], axisLabel: { color: '#ccc', fontSize: 10 } },
                yAxis: { type: 'value', axisLabel: { color: '#ccc', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
                series: [{
                    data: details.trend,
                    type: 'line',
                    smooth: true,
                    areaStyle: { opacity: 0.3, color: '#00eaff' },
                    itemStyle: { color: '#00eaff' }
                }]
            };
            myChart.setOption(option);
        }
    }, 100);
}

window.closeTrafficModal = function() {
    const modal = document.getElementById('traffic-modal');
    if (modal) modal.style.display = 'none';
    currentModalSource = null; // Clear current source
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

    // KPI Cards removed

    // Traffic Source update removed (Static)

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
