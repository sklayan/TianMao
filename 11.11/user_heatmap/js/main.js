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

// Fetch World Map Data
async function initMap() {
    // World map is loaded via script tag in index.html, so we can just init charts
    // If we needed to fetch GeoJSON manually, we would do it here.
    // But echarts world map js file registers 'world' automatically.
    initAllCharts();
}

function initAllCharts() {
    initTimeHeatmap();
    initGeoHeatmap();
    initBehaviorPath();
    initPreferenceHeatmap();
    initUserSegmentChart();
    initBehaviorKPI();

    // Handle Resize
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(chart => chart && chart.resize());
    });

    // Start Data Animation
    startDataAnimation();
}

// 1. Time Dimension Heatmap (24h x 11 Days)
function initTimeHeatmap() {
    const chart = echarts.init(document.getElementById('time-heatmap'));
    charts.timeHeatmap = chart;

    // Generate data: 11 days * 24 hours
    const hours = Array.from({length: 24}, (_, i) => `${i}:00`);
    const days = Array.from({length: 11}, (_, i) => `11月${i+1}日`);
    
    const data = [];
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 24; j++) {
            // Simulate higher activity in evening and on 11.11
            let base = Math.random() * 100;
            if (j > 18) base += 50;
            if (i === 10) base += 100; // 11.11 peak
            data.push([j, i, Math.floor(base)]);
        }
    }

    const option = {
        tooltip: { position: 'top' },
        grid: { height: '80%', top: '10%' },
        xAxis: { type: 'category', data: hours, splitArea: { show: true }, axisLabel: { color: '#ccc' } },
        yAxis: { type: 'category', data: days, splitArea: { show: true }, axisLabel: { color: '#ccc' } },
        visualMap: {
            min: 0, max: 250,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '0%',
            inRange: { color: ['#0a0a1e', '#00eaff', '#ff0033'] }, // Rainbow-ish heat
            textStyle: { color: '#fff' }
        },
        series: [{
            name: '活跃度',
            type: 'heatmap',
            data: data,
            label: { show: false },
            emphasis: {
                itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' }
            }
        }]
    };
    chart.setOption(option);
}

// 2. Geo Heatmap (World Map)
function initGeoHeatmap() {
    const chart = echarts.init(document.getElementById('geo-heatmap'));
    charts.geoHeatmap = chart;

    const option = {
        tooltip: { trigger: 'item' },
        visualMap: {
            min: 0, max: 1000,
            left: 'left', top: 'bottom',
            text: ['高', '低'],
            inRange: { color: ['#e0ffff', '#006edd', '#ff0033'] },
            textStyle: { color: '#fff' },
            calculable: true
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
                itemStyle: { areaColor: '#2a333d' },
                label: { show: false }
            }
        },
        series: [{
            name: '用户活跃度',
            type: 'heatmap',
            coordinateSystem: 'geo',
            data: [
                {name: 'China', value: [104.19, 35.86, 950]},
                {name: 'United States', value: [-95.71, 37.09, 800]},
                {name: 'Japan', value: [138.25, 36.20, 750]},
                {name: 'Germany', value: [10.45, 51.16, 600]},
                {name: 'United Kingdom', value: [-3.43, 55.37, 550]},
                {name: 'Australia', value: [133.77, -25.27, 400]},
                {name: 'Canada', value: [-106.34, 56.13, 350]},
                {name: 'Brazil', value: [-51.92, -14.23, 300]},
                {name: 'Russia', value: [105.31, 61.52, 250]},
                {name: 'India', value: [78.96, 20.59, 450]}
            ]
        }]
    };
    chart.setOption(option);
}

// 3. Behavior Path (Sankey)
function initBehaviorPath() {
    const chart = echarts.init(document.getElementById('behavior-path'));
    charts.behaviorPath = chart;

    const option = {
        tooltip: { trigger: 'item', triggerOn: 'mousemove' },
        series: [{
            type: 'sankey',
            layout: 'none',
            emphasis: { focus: 'adjacency' },
            lineStyle: { color: 'gradient', curveness: 0.5 },
            label: { color: '#fff' },
            data: [
                { name: '浏览' }, { name: '加购' }, { name: '下单' }, { name: '支付' },
                { name: '流失' }
            ],
            links: [
                { source: '浏览', target: '加购', value: 5000 },
                { source: '浏览', target: '流失', value: 5000 },
                { source: '加购', target: '下单', value: 3000 },
                { source: '加购', target: '流失', value: 2000 },
                { source: '下单', target: '支付', value: 2800 },
                { source: '下单', target: '流失', value: 200 }
            ],
            itemStyle: { color: '#00eaff', borderColor: '#fff' }
        }]
    };
    chart.setOption(option);
}

// 4. Product Preference Heatmap (Matrix)
function initPreferenceHeatmap() {
    const chart = echarts.init(document.getElementById('preference-heatmap'));
    charts.preferenceHeatmap = chart;

    const categories = ['美妆', '数码', '服饰', '食品', '家居'];
    const userTags = ['新客', 'VIP', '学生', '白领', '银发'];
    
    const data = [];
    for (let i = 0; i < categories.length; i++) {
        for (let j = 0; j < userTags.length; j++) {
            data.push([i, j, Math.floor(Math.random() * 100)]);
        }
    }

    const option = {
        tooltip: { position: 'top' },
        grid: { top: '10%', bottom: '15%' },
        xAxis: { type: 'category', data: categories, axisLabel: { color: '#fff' } },
        yAxis: { type: 'category', data: userTags, axisLabel: { color: '#fff' } },
        visualMap: {
            min: 0, max: 100,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '0%',
            inRange: { color: ['#1a1a3a', '#d500f9'] },
            textStyle: { color: '#fff' }
        },
        series: [{
            type: 'heatmap',
            data: data,
            label: { show: true, color: '#fff' }
        }]
    };
    chart.setOption(option);
}

// 5. User Segmentation (Pie)
function initUserSegmentChart() {
    const chart = echarts.init(document.getElementById('user-segment-chart'));
    charts.userSegment = chart;

    const option = {
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center', textStyle: { color: '#fff' } },
        series: [{
            name: '用户分群',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#0a0a1e',
                borderWidth: 2
            },
            label: { show: false, position: 'center' },
            emphasis: {
                label: { show: true, fontSize: 20, fontWeight: 'bold', color: '#fff' }
            },
            data: [
                { value: 1048, name: '高净值' },
                { value: 735, name: '中等消费' },
                { value: 580, name: '潜力用户' },
                { value: 484, name: '普通用户' }
            ]
        }]
    };
    chart.setOption(option);
}

// 6. Behavior KPI (HTML Injection)
function initBehaviorKPI() {
    const container = document.getElementById('behavior-kpi');
    const kpis = [
        { label: '平均停留时长', value: '12m 30s', trend: '+5%', up: true },
        { label: '页面跳出率', value: '25.4%', trend: '-2%', up: false }, // down is good
        { label: '加购转化率', value: '18.2%', trend: '+1.2%', up: true },
        { label: '客单价分布(Avg)', value: '¥420', trend: '+15%', up: true }
    ];

    container.innerHTML = kpis.map(k => `
        <div class="kpi-item">
            <div>
                <div class="kpi-label">${k.label}</div>
                <div class="kpi-val">${k.value}</div>
            </div>
            <div class="kpi-sub ${k.up ? 'trend-up' : 'trend-down'}">
                ${k.up ? '▲' : '▼'} ${k.trend}
            </div>
        </div>
    `).join('');
}

// Animation Loop
function startDataAnimation() {
    setInterval(() => {
        // Animate Time Heatmap
        if (charts.timeHeatmap) {
            const opt = charts.timeHeatmap.getOption();
            const data = opt.series[0].data;
            // Randomly update some points
            for(let i=0; i<10; i++) {
                const idx = Math.floor(Math.random() * data.length);
                data[idx][2] = Math.floor(Math.random() * 250);
            }
            charts.timeHeatmap.setOption({ series: [{ data: data }] });
        }
        
        // Animate Geo Heatmap
        if (charts.geoHeatmap) {
            const opt = charts.geoHeatmap.getOption();
            const data = opt.series[0].data;
            data.forEach(item => {
                item.value[2] = Math.max(0, Math.min(1000, item.value[2] + (Math.random() - 0.5) * 100));
            });
            charts.geoHeatmap.setOption({ series: [{ data: data }] });
        }

    }, 2000);
}

// Start
initMap();
