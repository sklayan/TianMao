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

// Helper: Format Large Numbers
function formatNumber(num) {
    if (num >= 100000000) {
        return (num / 100000000).toFixed(2) + '亿';
    } else if (num >= 10000) {
        return (num / 10000).toFixed(1) + '万';
    }
    return num;
}

// Init Charts
function initAllCharts() {
    initParticles(); // New: Particle Background
    initScanEffect(); // New: Holographic Scan
    
    initGenderChart();
    initAgeChart();
    initOccupationChart(); // Updated: DNA Helix Style
    initConsumptionChart();
    initInterestChart(); // Updated: Galaxy Style
    initUserMap(); // Updated: 3D Map
    
    // Handle Resize
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(chart => chart && chart.resize());
        if (particleCtx) resizeParticles();
    });
}

// --- 1. Visual Effects ---

// Particle System
let particleCtx;
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
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
}

function resizeParticles() {
    const canvas = document.getElementById('particle-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Holographic Scan
function initScanEffect() {
    const overlay = document.querySelector('.scan-overlay');
    overlay.style.display = 'block';
    setTimeout(() => {
        overlay.style.display = 'none'; // Hide after initial scan
    }, 3000);
}

// --- 2. Charts ---

// 1. Gender Chart (Donut) - Added Interaction
function initGenderChart() {
    const chart = echarts.init(document.getElementById('gender-chart'));
    charts.gender = chart;

    const option = {
        tooltip: { 
            trigger: 'item',
            formatter: function(params) {
                if (params.name === 'other') return '';
                return `${params.seriesName}: ${params.value}%`;
            }
        },
        legend: { show: false },
        graphic: [
            {
                type: 'group',
                left: '10%',
                top: '55%',
                children: [
                    {
                        type: 'circle',
                        shape: { cx: 0, cy: -12, r: 6 },
                        style: { fill: '#2979ff' }
                    },
                    {
                        type: 'rect',
                        shape: { x: -8, y: -4, width: 16, height: 20, r: 4 },
                        style: { fill: '#2979ff' }
                    }
                ]
            },
            {
                type: 'group',
                left: '50%',
                top: '55%',
                children: [
                    {
                        type: 'circle',
                        shape: { cx: 0, cy: -12, r: 6 },
                        style: { fill: '#00eaff' }
                    },
                    {
                        type: 'polygon',
                        shape: { points: [[0, -4], [10, 16], [-10, 16]] },
                        style: { fill: '#00eaff' }
                    }
                ]
            }
        ],
        series: [
            {
                name: '男性',
                type: 'pie',
                radius: ['55%', '70%'],
                center: ['30%', '55%'],
                label: { 
                    show: true, 
                    position: 'center', 
                    formatter: '{b}\n{c}%', 
                    color: '#2979ff', 
                    fontSize: 14, 
                    lineHeight: 20
                },
                labelLine: { show: false },
                data: [
                    { value: 64, name: '男性', itemStyle: { color: '#2979ff' } },
                    { value: 36, name: 'other', itemStyle: { color: 'rgba(255,255,255,0.1)' }, label: { show: false }, tooltip: { show: false } }
                ]
            },
            {
                name: '女性',
                type: 'pie',
                radius: ['55%', '70%'],
                center: ['70%', '55%'],
                label: { 
                    show: true, 
                    position: 'center', 
                    formatter: '{b}\n{c}%', 
                    color: '#00eaff', 
                    fontSize: 14, 
                    lineHeight: 20
                },
                labelLine: { show: false },
                data: [
                    { value: 36, name: '女性', itemStyle: { color: '#00eaff' } },
                    { value: 64, name: 'other', itemStyle: { color: 'rgba(255,255,255,0.1)' }, label: { show: false }, tooltip: { show: false } }
                ]
            }
        ]
    };
    chart.setOption(option);
    
    // Interaction: Filter & Linkage
    chart.on('click', function (params) {
        if (params.name !== 'other') {
            highlightOccupation(params.name);
        }
    });

    // Reset on blank click
    chart.getZr().on('click', function (params) {
        if (!params.target) {
            resetOccupationHighlight();
            chart.dispatchAction({
                type: 'downplay',
                seriesIndex: [0, 1]
            });
        }
    });
}

// Linkage Functions
function highlightOccupation(gender) {
    // Linkage disabled for Radar Chart
}

function resetOccupationHighlight() {
    // Linkage disabled for Radar Chart
}

// 2. Age Chart (Bar + Line Combo)
function initAgeChart() {
    const chart = echarts.init(document.getElementById('age-chart'));
    charts.age = chart;
    const categories = ['60后', '70后', '80后', '90后', '00后'];
    const data = [1200000, 2000000, 4500000, 6800000, 3500000];
    
    const option = {
        tooltip: { 
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function(params) {
                let res = params[0].name + '<br/>';
                params.forEach(p => {
                    if (p.seriesType === 'bar') {
                        res += p.marker + p.seriesName + ': ' + formatNumber(p.value);
                    }
                });
                return res;
            }
        },
        grid: { top: '20%', bottom: '10%', left: '5%', right: '5%', containLabel: true },
        xAxis: { 
            data: categories, 
            axisTick: { show: false }, 
            axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, 
            axisLabel: { color: '#fff', fontSize: 12, interval: 0 } 
        },
        yAxis: { 
            show: true, 
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)', type: 'dashed' } },
            axisLabel: { color: 'rgba(255,255,255,0.5)', formatter: (val) => formatNumber(val) }
        },
        series: [
            {
                name: '用户数量',
                type: 'bar',
                barWidth: 20,
                itemStyle: {
                    borderRadius: [10, 10, 0, 0],
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#00eaff' },
                        { offset: 1, color: 'rgba(0, 234, 255, 0.1)' }
                    ])
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#fff',
                    formatter: (params) => formatNumber(params.value)
                },
                data: data
            },
            {
                name: '趋势',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: { color: '#fff', borderColor: '#2979ff', borderWidth: 2 },
                lineStyle: { color: '#2979ff', width: 2, type: 'dashed' },
                data: data
            }
        ]
    };
    chart.setOption(option);
    chart.on('click', function (params) { filterData('age', params.name); });
}

// 3. Occupation Chart (DNA Helix Style - Simulated with Bar)
// 3. Occupation Chart (Radar Style)
function initOccupationChart() {
    const chart = echarts.init(document.getElementById('occupation-chart'));
    charts.occupation = chart;

    const categories = ['服务员', '学生', '公务员', '个体', '白领', '教职工'];
    // Initial total data
    const data = [1100000, 1700000, 700000, 1300000, 1600000, 900000];

    const option = {
        tooltip: { 
            trigger: 'item',
            formatter: function(params) {
                let res = params.name + '<br/>';
                const indicators = ['服务员', '学生', '公务员', '个体', '白领', '教职工'];
                params.value.forEach((val, index) => {
                    res += indicators[index] + ': ' + formatNumber(val) + '<br/>';
                });
                return res;
            }
        },
        radar: {
            indicator: categories.map(name => ({ name, max: 2000000 })),
            radius: '65%',
            center: ['50%', '50%'],
            splitNumber: 4,
            axisName: {
                color: '#fff',
                fontSize: 12
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(41, 121, 255, 0.1)', 'rgba(0, 234, 255, 0.1)']
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            }
        },
        series: [{
            name: '职业分布',
            type: 'radar',
            data: [{
                value: data,
                name: '用户数量',
                itemStyle: {
                    color: '#00eaff'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 234, 255, 0.8)' },
                        { offset: 1, color: 'rgba(41, 121, 255, 0.4)' }
                    ])
                },
                lineStyle: {
                    width: 2,
                    color: '#00eaff'
                }
            }]
        }]
    };
    chart.setOption(option);
}

// 5. Consumption Chart (Funnel)
function initConsumptionChart() {
    const chart = echarts.init(document.getElementById('consumption-chart'));
    charts.consumption = chart;
    const option = {
        tooltip: { 
            trigger: 'item', 
            formatter: function(params) {
                return params.name + ': ' + formatNumber(params.value);
            } 
        },
        series: [{
            name: '消费能力',
            type: 'funnel',
            left: '10%', top: 10, bottom: 10, width: '80%',
            min: 0, max: 6000000,
            minSize: '0%', maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: { show: true, position: 'inside', color: '#fff' },
            itemStyle: { borderColor: '#fff', borderWidth: 0 },
            data: [
                { value: 6000000, name: '高消费', itemStyle: { color: '#2979ff' } },
                { value: 4000000, name: '中高消费', itemStyle: { color: '#00eaff' } },
                { value: 2000000, name: '中等消费', itemStyle: { color: '#00b0ff' } },
                { value: 1000000, name: '低消费', itemStyle: { color: '#80d8ff' } }
            ]
        }]
    };
    chart.setOption(option);
}

// 6. Interest Chart (Galaxy Style)
function initInterestChart() {
    const chart = echarts.init(document.getElementById('interest-chart'));
    charts.interest = chart;

    const data = [
        {name: '数码', value: 900000}, {name: '美妆', value: 850000}, {name: '运动', value: 800000},
        {name: '家居', value: 750000}, {name: '母婴', value: 700000}, {name: '美食', value: 650000},
        {name: '旅游', value: 600000}, {name: '阅读', value: 550000}, {name: '电影', value: 500000},
        {name: '游戏', value: 450000}, {name: '摄影', value: 400000}, {name: '宠物', value: 350000}
    ];

    const option = {
        tooltip: { 
            formatter: function(params) {
                return `<div style="text-align:center;font-weight:bold;margin-bottom:5px;">${params.name}</div>
                        <div style="font-size:12px;color:rgba(255,255,255,0.8);">
                        兴趣人群: <span style="color:#00eaff;font-family:DIN;font-size:14px;">${formatNumber(params.value)}</span>
                        </div>`;
            },
            backgroundColor: 'rgba(11, 15, 42, 0.9)',
            borderColor: '#00eaff',
            textStyle: { color: '#fff' }
        },
        series: [{
            type: 'graph',
            layout: 'force',
            force: { 
                repulsion: 250, 
                gravity: 0.3, 
                edgeLength: 50,
                layoutAnimation: true
            },
            roam: true,
            draggable: true,
            label: { show: true, color: '#fff' },
            data: data.map((d, i) => ({
                name: d.name,
                value: d.value,
                symbolSize: Math.sqrt(d.value) / 15, // Adjusted scaling for better proportion
                itemStyle: {
                    color: i === 0 ? '#ffcc00' : `rgba(${Math.random()*50}, ${Math.random()*200+55}, 255, 0.8)`, // Center is gold
                    shadowBlur: 10,
                    shadowColor: '#fff'
                }
            })),
            links: [] // No links
        }]
    };
    chart.setOption(option);
}

// 7. User Map (3D Map with Region Click)
function initUserMap() {
    const chart = echarts.init(document.getElementById('user-map'));
    charts.map = chart;

    // Generate random data for provinces
    const provinces = ['北京', '天津', '上海', '重庆', '河北', '河南', '云南', '辽宁', '黑龙江', '湖南', '安徽', '山东', '新疆', '江苏', '浙江', '江西', '湖北', '广西', '甘肃', '山西', '内蒙古', '陕西', '吉林', '福建', '贵州', '广东', '青海', '西藏', '四川', '宁夏', '海南', '台湾', '香港', '澳门'];
    const data = provinces.map(name => ({
        name: name,
        value: Math.floor(Math.random() * 5000000 + 500000)
    }));

    const option = {
        tooltip: { 
            show: true,
            formatter: function(params) {
                if (!params.value) return params.name;
                return `<div style="font-size:14px;font-weight:bold;color:#fff;margin-bottom:5px;">${params.name}</div>
                        <div style="font-size:12px;color:rgba(255,255,255,0.8);">
                        活跃用户: <span style="color:#00eaff;font-family:DIN;">${formatNumber(params.value)}</span>
                        </div>`;
            },
            backgroundColor: 'rgba(11, 15, 42, 0.9)',
            borderColor: '#00eaff',
            textStyle: { color: '#fff' }
        },
        series: [{
            type: 'map3D',
            map: 'china',
            name: '中国',
            data: data,
            roam: true,
            itemStyle: {
                color: '#184385',
                opacity: 1,
                borderWidth: 0.8,
                borderColor: '#00eaff'
            },
            emphasis: {
                label: { show: true, color: '#fff' },
                itemStyle: { color: '#2979ff' }
            },
            viewControl: {
                autoRotate: true,
                autoRotateSpeed: 5,
                distance: 120,
                minBeta: -360,
                maxBeta: 360,
                alpha: 40
            },
            light: {
                main: { intensity: 1, shadow: true, alpha: 30 },
                ambient: { intensity: 0 }
            }
        }]
    };
    chart.setOption(option);

    // Region Click Interaction
    chart.on('click', function (params) {
        // Stop rotation on interaction
        chart.setOption({ series: [{ viewControl: { autoRotate: false } }] });
        
        if (params.name) {
            showRegionModal(params.name);
            updateDashboardByRegion(params.name); // Linkage Update
        }
    });
}

// --- 3. Interactions ---

// Show Region Modal
function showRegionModal(regionName) {
    const modal = document.getElementById('region-modal');
    modal.classList.remove('hidden');
    
    document.getElementById('region-title').textContent = regionName + ' 用户画像';
    
    // Generate Mock Data based on region name hash
    const hash = regionName.split('').reduce((a,b)=>a+b.charCodeAt(0),0);
    const nightIndex = (hash * 13) % 40 + 60; // 60-100
    const priceIndex = (hash * 7) % 60 + 20; // 20-80
    const newIndex = (hash * 23) % 50 + 40; // 40-90
    
    const taglines = ['精致生活家', '硬核科技党', '养生佛系派', '夜猫子部落', '性价比猎手', '奢华体验官'];
    document.getElementById('region-tagline').textContent = taglines[hash % taglines.length];
    
    // Update Bars
    document.getElementById('metric-night').style.width = nightIndex + '%';
    document.getElementById('val-night').textContent = nightIndex + '分';
    
    document.getElementById('metric-price').style.width = priceIndex + '%';
    document.getElementById('val-price').textContent = priceIndex + '分';
    
    document.getElementById('metric-new').style.width = newIndex + '%';
    document.getElementById('val-new').textContent = newIndex + '分';
    
    // Init Region Chart (e.g., Preferred Shopping Time)
    const chartDom = document.getElementById('region-chart');
    // Dispose old instance if exists
    const oldChart = echarts.getInstanceByDom(chartDom);
    if (oldChart) oldChart.dispose();
    
    const chart = echarts.init(chartDom);
    chart.setOption({
        title: { text: '下单时段偏好', left: 'center', textStyle: { color: '#fff', fontSize: 12 } },
        tooltip: { 
            trigger: 'axis',
            formatter: '{b}: {c}%' // Add unit to tooltip
        },
        grid: { top: 30, bottom: 35, left: 30, right: 10 },
        xAxis: { 
            type: 'category', 
            data: ['早\n(6-12点)', '中\n(12-18点)', '晚\n(18-24点)', '夜\n(0-6点)'], 
            axisLine: { lineStyle: { color: '#666' } },
            axisLabel: { interval: 0, fontSize: 10, lineHeight: 14 }
        },
        yAxis: { type: 'value', splitLine: { show: false }, axisLabel: { show: false } },
        series: [{
            type: 'bar',
            name: '占比',
            data: [
                (hash * 3) % 50 + 10, 
                (hash * 5) % 60 + 20, 
                (hash * 7) % 80 + 20, 
                (hash * 11) % 90 + 10
            ],
            itemStyle: { color: '#00eaff', borderRadius: [2, 2, 0, 0] },
            label: { show: true, position: 'top', formatter: '{c}%', color: '#fff', fontSize: 10 } // Add labels with units
        }]
    });
}

function closeRegionModal() {
    document.getElementById('region-modal').classList.add('hidden');
    resetDashboardToGlobal(); // Reset to global view
}

function closeUserCard() {
    // Deprecated
}

// Reset Dashboard to Global View
function resetDashboardToGlobal() {
    console.log("Resetting dashboard to global view");
    
    // Reset Headers
    const updateHeader = (chartId, suffix) => {
        const chartEl = document.getElementById(chartId);
        if (chartEl && chartEl.previousElementSibling) {
            chartEl.previousElementSibling.textContent = '基础属性：' + suffix;
            if (suffix === '职业分布') chartEl.previousElementSibling.textContent = '社会属性：' + suffix;
            if (suffix === '消费能力') chartEl.previousElementSibling.textContent = '消费属性：' + suffix;
            if (suffix === '兴趣偏好') chartEl.previousElementSibling.textContent = '行为属性：' + suffix;
        }
    };

    updateHeader('gender-chart', '性别分布');
    updateHeader('occupation-chart', '职业分布');
    updateHeader('age-chart', '年龄分布');
    updateHeader('consumption-chart', '消费能力');
    updateHeader('interest-chart', '兴趣偏好');

    // Reset Data to Global Baseline immediately
    if (charts.gender) {
        charts.gender.setOption({
            series: [
                { data: [{ value: 60, name: '男性', itemStyle: { color: '#2979ff' } }, { value: 40, name: 'other', itemStyle: { color: 'rgba(255,255,255,0.1)' }, label: { show: false }, tooltip: { show: false } }] },
                { data: [{ value: 40, name: '女性', itemStyle: { color: '#00eaff' } }, { value: 60, name: 'other', itemStyle: { color: 'rgba(255,255,255,0.1)' }, label: { show: false }, tooltip: { show: false } }] }
            ]
        });
    }
    if (charts.occupation) {
        charts.occupation.setOption({
            series: [{ data: [{ value: [1100000, 1700000, 700000, 1300000, 1600000, 900000], name: '用户数量' }] }]
        });
    }
    if (charts.age) {
        const ageData = [1200000, 2000000, 4500000, 6800000, 3500000];
        charts.age.setOption({ series: [{ data: ageData }, { data: ageData }] });
    }
    if (charts.consumption) {
        charts.consumption.setOption({
            series: [{
                data: [
                    { value: 6000000, name: '高消费', itemStyle: { color: '#2979ff' } },
                    { value: 4000000, name: '中高消费', itemStyle: { color: '#00eaff' } },
                    { value: 2000000, name: '中等消费', itemStyle: { color: '#00b0ff' } },
                    { value: 1000000, name: '低消费', itemStyle: { color: '#80d8ff' } }
                ]
            }]
        });
    }
    if (charts.interest) {
        const interestData = [
            {name: '数码', value: 900000}, {name: '美妆', value: 850000}, {name: '运动', value: 800000},
            {name: '家居', value: 750000}, {name: '母婴', value: 700000}, {name: '美食', value: 650000},
            {name: '旅游', value: 600000}, {name: '阅读', value: 550000}, {name: '电影', value: 500000},
            {name: '游戏', value: 450000}, {name: '摄影', value: 400000}, {name: '宠物', value: 350000}
        ];
        charts.interest.setOption({
            series: [{ 
                data: interestData.map((d, i) => ({
                    name: d.name,
                    value: d.value,
                    symbolSize: Math.sqrt(d.value) / 15,
                    itemStyle: {
                        color: i === 0 ? '#ffcc00' : `rgba(${Math.random()*50}, ${Math.random()*200+55}, 255, 0.8)`,
                        shadowBlur: 10,
                        shadowColor: '#fff'
                    }
                }))
            }]
        });
    }

    // Restart Simulation (which will overwrite data with global randoms)
    startDataSimulation();
    
    // Resume Map Rotation
    if (charts.map) {
        charts.map.setOption({ series: [{ viewControl: { autoRotate: true } }] });
        // Clear selection highlight if possible, or just let it be
        charts.map.dispatchAction({
            type: 'downplay'
        });
    }
}

// Filter Logic (Animation)
function filterData(type, value) {
    // Flash effect on all charts to simulate filtering
    const allCharts = [charts.interest, charts.consumption];
    allCharts.forEach(c => {
        if(c) {
            c.showLoading({ text: 'Filtering...', color: '#00eaff', maskColor: 'rgba(11, 15, 42, 0.8)' });
            setTimeout(() => {
                c.hideLoading();
                // Here you would normally fetch new data. We will just shuffle data for demo.
                const opt = c.getOption();
                if(opt.series[0].data) {
                    opt.series[0].data.sort(() => Math.random() - 0.5);
                    c.setOption(opt);
                }
            }, 800);
        }
    });
}

// Global Simulation Intervals
let simulationIntervals = [];

// Data Simulation
function startDataSimulation() {
    // Clear existing intervals if any
    stopDataSimulation();

    // 1. Simulate Real-time Gender Ratio Fluctuation
    simulationIntervals.push(setInterval(() => {
        if (!charts.gender) return;
        let maleVal = 60 + (Math.random() * 4 - 2); // 58-62
        maleVal = parseFloat(maleVal.toFixed(1)); // Round to 1 decimal
        let femaleVal = parseFloat((100 - maleVal).toFixed(1));
        
        charts.gender.setOption({
            series: [
                {
                    data: [
                        { value: maleVal, name: '男性', itemStyle: { color: '#2979ff' } },
                        { value: femaleVal, name: 'other', itemStyle: { color: 'rgba(255,255,255,0.1)' }, label: { show: false }, tooltip: { show: false } }
                    ]
                },
                {
                    data: [
                        { value: femaleVal, name: '女性', itemStyle: { color: '#00eaff' } },
                        { value: maleVal, name: 'other', itemStyle: { color: 'rgba(255,255,255,0.1)' }, label: { show: false }, tooltip: { show: false } }
                    ]
                }
            ]
        });
    }, 3000));

    // 2. Simulate Age Group Activity
    simulationIntervals.push(setInterval(() => {
        if (!charts.age) return;
        const data = [1200000, 2000000, 4500000, 6800000, 3500000].map(v => v + Math.floor(Math.random() * 50000 - 25000));
        charts.age.setOption({
            series: [
                { data: data },
                { data: data }
            ]
        });
    }, 5000));

    // 3. Simulate Occupation Changes (Radar)
    simulationIntervals.push(setInterval(() => {
        if (!charts.occupation) return;
        
        // Generate new random data
        const newData = [1100000, 1700000, 700000, 1300000, 1600000, 900000].map(v => {
            return Math.min(2000000, Math.max(500000, v + Math.floor(Math.random() * 100000 - 50000)));
        });

        charts.occupation.setOption({
            series: [{
                data: [{
                    value: newData,
                    name: '用户数量'
                }]
            }]
        });
    }, 4000));

    // 4. Simulate Consumption Funnel
    simulationIntervals.push(setInterval(() => {
        if (!charts.consumption) return;
        charts.consumption.setOption({
            series: [{
                data: [
                    { value: 6000000 + Math.random() * 100000, name: '高消费', itemStyle: { color: '#2979ff' } },
                    { value: 4000000 + Math.random() * 100000, name: '中高消费', itemStyle: { color: '#00eaff' } },
                    { value: 2000000 + Math.random() * 100000, name: '中等消费', itemStyle: { color: '#00b0ff' } },
                    { value: 1000000 + Math.random() * 50000, name: '低消费', itemStyle: { color: '#80d8ff' } }
                ]
            }]
        });
    }, 3500));

    // 6. Simulate KPI Numbers (Total Users & New User Rate)
    const totalUserEl = document.getElementById('total-user-num');
    const newUserRateEl = document.getElementById('new-user-rate');
    
    let currentTotalUsers = 8942105;
    
    simulationIntervals.push(setInterval(() => {
        // Increase total users
        const increase = Math.floor(Math.random() * 50 + 10);
        currentTotalUsers += increase;
        if (totalUserEl) totalUserEl.textContent = currentTotalUsers.toLocaleString();
        
        // Fluctuate new user rate
        if (newUserRateEl) {
            const rate = 12.5 + (Math.random() * 0.4 - 0.2);
            newUserRateEl.textContent = rate.toFixed(1) + '%';
        }
    }, 1000));
}

function stopDataSimulation() {
    simulationIntervals.forEach(clearInterval);
    simulationIntervals = [];
}

// Update Dashboard Data by Region
function updateDashboardByRegion(regionName) {
    // Stop random simulation to show stable regional data
    stopDataSimulation();
    
    console.log("Updating dashboard for:", regionName);

    // 1. Define Regional Characteristics (Logic)
    // Hash based generation for consistency
    const hash = regionName.split('').reduce((a,b)=>a+b.charCodeAt(0),0);
    
    // Factors (0.0 - 1.0)
    let economicFactor = 0.5; // Economy level
    let techFactor = 0.3;     // Tech industry presence
    let ageFactor = 0.5;      // 0: Young, 1: Old
    
    // Custom Logic for Key Provinces
    if (['北京', '上海', '广东', '浙江', '江苏'].includes(regionName)) {
        economicFactor = 0.9;
        techFactor = 0.8;
        ageFactor = 0.3; // Young professionals
    } else if (['贵州', '云南', '广西', '甘肃'].includes(regionName)) {
        economicFactor = 0.3;
        techFactor = 0.2;
        ageFactor = 0.4; // Young but less tech
    } else if (['黑龙江', '吉林', '辽宁'].includes(regionName)) {
        economicFactor = 0.4;
        techFactor = 0.3;
        ageFactor = 0.7; // Aging population
    } else {
        // Randomize others deterministically
        economicFactor = ((hash % 100) / 100) * 0.5 + 0.2;
        techFactor = ((hash * 3 % 100) / 100) * 0.4 + 0.1;
        ageFactor = ((hash * 7 % 100) / 100);
    }

    // Update Headers
    const updateHeader = (chartId, suffix) => {
        const chartEl = document.getElementById(chartId);
        if (chartEl && chartEl.previousElementSibling) {
            chartEl.previousElementSibling.textContent = regionName + '：' + suffix;
        }
    };

    updateHeader('gender-chart', '性别分布');
    updateHeader('occupation-chart', '职业分布');
    updateHeader('age-chart', '年龄分布');
    updateHeader('consumption-chart', '消费能力');
    updateHeader('interest-chart', '兴趣偏好');

    // 2. Update Gender Chart
    // Tech/Industrial areas might have more males? Or balanced.
    // Let's say Tech areas have slightly more males.
    let maleRatio = 50 + (techFactor * 10) + (Math.random() * 5 - 2.5); 
    maleRatio = parseFloat(Math.min(70, Math.max(30, maleRatio)).toFixed(1));
    const femaleRatio = parseFloat((100 - maleRatio).toFixed(1));
    
    charts.gender.setOption({
        series: [
            { data: [{ value: maleRatio, name: '男性', itemStyle: { color: '#2979ff' } }, { value: femaleRatio, name: 'other', itemStyle: { color: 'rgba(255,255,255,0.1)' }, label: { show: false }, tooltip: { show: false } }] },
            { data: [{ value: femaleRatio, name: '女性', itemStyle: { color: '#00eaff' } }, { value: maleRatio, name: 'other', itemStyle: { color: 'rgba(255,255,255,0.1)' }, label: { show: false }, tooltip: { show: false } }] }
        ]
    });

    // 3. Update Occupation Chart (Radar)
    // Tech factor affects "IT/互联网"
    const occData = [
        Math.floor(1000000 * (1 + techFactor)), // IT
        Math.floor(1500000 * (1 + economicFactor)), // Finance/Sales
        Math.floor(800000 * (1 - techFactor)), // Traditional
        Math.floor(1200000 * (1 + ageFactor)), // Services
        Math.floor(1400000 * (1 - ageFactor)), // Student/Freelance
        Math.floor(1000000) // Other
    ];
    charts.occupation.setOption({
        series: [{ data: [{ value: occData, name: '用户数量' }] }]
    });

    // 4. Update Age Chart
    // Age factor affects distribution
    // 60s, 70s, 80s, 90s, 00s
    let ageData = [
        1000000 * (0.5 + ageFactor), // 60s
        1800000 * (0.8 + ageFactor), // 70s
        4000000, // 80s (Base)
        6000000 * (1.5 - ageFactor), // 90s
        3000000 * (1.5 - ageFactor)  // 00s
    ].map(v => Math.floor(v));
    
    charts.age.setOption({
        series: [{ data: ageData }, { data: ageData }]
    });

    // 5. Update Consumption Chart
    // Economic factor affects High/Mid-High consumption
    const totalConsumption = 10000000;
    const high = totalConsumption * (0.2 + economicFactor * 0.4);
    const midHigh = totalConsumption * (0.3 + economicFactor * 0.2);
    const mid = totalConsumption * 0.3;
    const low = totalConsumption - high - midHigh - mid;
    
    charts.consumption.setOption({
        series: [{
            data: [
                { value: Math.floor(high), name: '高消费', itemStyle: { color: '#2979ff' } },
                { value: Math.floor(midHigh), name: '中高消费', itemStyle: { color: '#00eaff' } },
                { value: Math.floor(mid), name: '中等消费', itemStyle: { color: '#00b0ff' } },
                { value: Math.floor(low), name: '低消费', itemStyle: { color: '#80d8ff' } }
            ]
        }]
    });

    // 6. Update Interest Chart
    // Tech factor -> Digital, Games
    // Female ratio -> Beauty, Baby
    // Age factor -> Health, Tea? (Not in list, but maybe Reading/Travel)
    const interestData = [
        {name: '数码', value: 900000 * (1 + techFactor)}, 
        {name: '美妆', value: 850000 * (femaleRatio / 50)}, 
        {name: '运动', value: 800000},
        {name: '家居', value: 750000 * (1 + ageFactor)}, 
        {name: '母婴', value: 700000 * (femaleRatio / 50)}, 
        {name: '美食', value: 650000},
        {name: '旅游', value: 600000 * (1 + economicFactor)}, 
        {name: '阅读', value: 550000}, 
        {name: '电影', value: 500000},
        {name: '游戏', value: 450000 * (1 + techFactor - ageFactor)}, 
        {name: '摄影', value: 400000}, 
        {name: '宠物', value: 350000}
    ];
    
    charts.interest.setOption({
        series: [{ 
            data: interestData.map((d, i) => ({
                name: d.name,
                value: Math.floor(d.value),
                symbolSize: Math.sqrt(d.value) / 15,
                itemStyle: {
                    color: i === 0 ? '#ffcc00' : `rgba(${Math.random()*50}, ${Math.random()*200+55}, 255, 0.8)`,
                    shadowBlur: 10,
                    shadowColor: '#fff'
                }
            }))
        }]
    });
}

// Start
initAllCharts();
startDataSimulation();



