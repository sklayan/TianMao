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
    initParticles(); // New: Particle Background
    initScanEffect(); // New: Holographic Scan
    
    initGenderChart();
    initAgeChart();
    initOccupationChart(); // Updated: DNA Helix Style
    initZodiacChart();
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
        tooltip: { trigger: 'item' },
        legend: { bottom: '5%', left: 'center', textStyle: { color: '#fff' } },
        series: [{
            name: '性别分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '45%'],
            itemStyle: { borderRadius: 10, borderColor: '#0b0f2a', borderWidth: 2 },
            label: { show: false, position: 'center' },
            emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold', color: '#fff' } },
            data: [
                { value: 64, name: '男性', itemStyle: { color: '#2979ff' } },
                { value: 36, name: '女性', itemStyle: { color: '#00eaff' } }
            ]
        }]
    };
    chart.setOption(option);
    
    // Interaction: Filter
    chart.on('click', function (params) {
        filterData('gender', params.name);
    });
}

// 2. Age Chart (PictorialBar) - Added Interaction
function initAgeChart() {
    const chart = echarts.init(document.getElementById('age-chart'));
    charts.age = chart;
    const categories = ['60后', '70后', '80后', '90后', '00后'];
    const data = [120, 200, 450, 680, 350];
    const option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'none' } },
        grid: { top: '15%', bottom: '10%', left: '10%', right: '10%', containLabel: true },
        xAxis: { data: categories, axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: '#fff' } },
        yAxis: { show: false },
        series: [{
            name: '用户数量',
            type: 'pictorialBar',
            symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            itemStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#00eaff' }, { offset: 1, color: '#2979ff' }])
            },
            data: data
        }]
    };
    chart.setOption(option);
    chart.on('click', function (params) { filterData('age', params.name); });
}

// 3. Occupation Chart (DNA Helix Style - Simulated with Bar)
function initOccupationChart() {
    const chart = echarts.init(document.getElementById('occupation-chart'));
    charts.occupation = chart;

    // Use a double bar chart to simulate helix strands
    const categories = ['服务员', '学生', '公务员', '个体', '白领', '教职工'];
    const data1 = [60, 90, 40, 70, 85, 50];
    const data2 = [50, 80, 30, 60, 75, 40]; // Shadow strand

    const option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { top: '10%', bottom: '10%', left: '10%', right: '10%', containLabel: true },
        xAxis: { type: 'value', show: false },
        yAxis: { type: 'category', data: categories, axisLabel: { color: '#fff' }, axisLine: { show: false }, axisTick: { show: false } },
        series: [
            {
                name: 'Strand A',
                type: 'bar',
                stack: 'total',
                barWidth: 10,
                itemStyle: { borderRadius: [5, 5, 5, 5], color: '#00eaff' },
                data: data1
            },
            {
                name: 'Strand B',
                type: 'bar',
                stack: 'total',
                barWidth: 10,
                itemStyle: { borderRadius: [5, 5, 5, 5], color: 'rgba(41, 121, 255, 0.5)' },
                data: data2.map(d => -d) // Mirror effect
            }
        ]
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
        xAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { color: '#fff', interval: 0, fontSize: 10 }, axisLine: { lineStyle: { color: '#333' } } },
        yAxis: { show: false },
        series: [{
            type: 'bar',
            data: data.map(d => d.value),
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#00eaff' }, { offset: 1, color: 'rgba(0, 234, 255, 0.1)' }]),
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

// 6. Interest Chart (Galaxy Style)
function initInterestChart() {
    const chart = echarts.init(document.getElementById('interest-chart'));
    charts.interest = chart;

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
            force: { repulsion: 120, gravity: 0.1, edgeLength: 30 },
            roam: true,
            label: { show: true, color: '#fff' },
            data: data.map((d, i) => ({
                name: d.name,
                value: d.value,
                symbolSize: d.value / 1.5,
                itemStyle: {
                    color: i === 0 ? '#ffcc00' : `rgba(${Math.random()*50}, ${Math.random()*200+55}, 255, 0.8)`, // Center is gold
                    shadowBlur: 10,
                    shadowColor: '#fff'
                }
            })),
            links: data.map((d, i) => i > 0 ? { source: data[0].name, target: d.name } : null).filter(x => x) // Connect all to center
        }]
    };
    chart.setOption(option);
}

// 7. User Map (3D Map with Super Users)
function initUserMap() {
    const chart = echarts.init(document.getElementById('user-map'));
    charts.map = chart;

    const option = {
        tooltip: { show: true },
        geo3D: {
            map: 'china',
            roam: true,
            itemStyle: {
                color: '#0b0f2a',
                opacity: 1,
                borderWidth: 0.8,
                borderColor: '#00eaff'
            },
            viewControl: {
                autoRotate: true,
                autoRotateSpeed: 5,
                distance: 120,
                minBeta: -360,
                maxBeta: 360
            },
            light: {
                main: { intensity: 1, shadow: true, alpha: 30 },
                ambient: { intensity: 0 }
            }
        },
        series: [
            {
                type: 'scatter3D',
                coordinateSystem: 'geo3D',
                symbol: 'pin',
                symbolSize: 30,
                itemStyle: {
                    color: '#ffcc00',
                    opacity: 1
                },
                label: { show: false },
                data: [
                    { name: 'Super User 1', value: [116.4074, 39.9042, 100], itemStyle: { color: '#ff0000' } }, // Beijing
                    { name: 'Super User 2', value: [121.4737, 31.2304, 100], itemStyle: { color: '#ff0000' } }, // Shanghai
                    { name: 'Super User 3', value: [113.2644, 23.1291, 100], itemStyle: { color: '#ff0000' } }  // Guangzhou
                ]
            }
        ]
    };
    chart.setOption(option);

    // Super User Click Interaction
    chart.on('click', function (params) {
        if (params.seriesType === 'scatter3D') {
            showUserCard(params.data);
        }
    });
}

// --- 3. Interactions ---

// Show Super User Card
function showUserCard(data) {
    const card = document.getElementById('super-user-card');
    card.classList.remove('hidden');
    
    // Init Mini Radar
    const miniChart = echarts.init(document.getElementById('user-radar-mini'));
    miniChart.setOption({
        radar: {
            indicator: [
                { name: '消费', max: 100 }, { name: '活跃', max: 100 },
                { name: '信用', max: 100 }, { name: '互动', max: 100 }, { name: '潜力', max: 100 }
            ],
            radius: '60%',
            splitNumber: 3,
            axisName: { color: '#fff', fontSize: 10 }
        },
        series: [{
            type: 'radar',
            data: [{ value: [90, 80, 95, 70, 85], name: 'User Stats', areaStyle: { color: 'rgba(0, 234, 255, 0.5)' } }]
        }]
    });
}

function closeUserCard() {
    document.getElementById('super-user-card').classList.add('hidden');
}

// Filter Logic (Animation)
function filterData(type, value) {
    // Flash effect on all charts to simulate filtering
    const allCharts = [charts.interest, charts.consumption, charts.zodiac];
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

// Time Slider Logic
function updateTime(val) {
    const date = `11.${val < 10 ? '0' + val : val}`;
    // Update UI or Data based on date
    console.log("Time Travel to:", date);
    // Example: Update Map Color to simulate heat change
    if(charts.map) {
        charts.map.setOption({
            geo3D: { itemStyle: { color: val > 5 ? '#0b0f2a' : '#1a2350' } } // Darker as time goes on
        });
    }
}

// Data Simulation
function startDataSimulation() {
    // 1. Simulate Real-time Gender Ratio Fluctuation
    setInterval(() => {
        if (!charts.gender) return;
        const maleVal = 60 + (Math.random() * 4 - 2); // 58-62
        charts.gender.setOption({
            series: [{
                data: [
                    { value: maleVal, name: '男性', itemStyle: { color: '#2979ff' } },
                    { value: 100 - maleVal, name: '女性', itemStyle: { color: '#00eaff' } }
                ]
            }]
        });
    }, 3000);

    // 2. Simulate Age Group Activity (PictorialBar)
    setInterval(() => {
        if (!charts.age) return;
        const data = [120, 200, 450, 680, 350].map(v => v + Math.floor(Math.random() * 50 - 25));
        charts.age.setOption({
            series: [{ data: data }]
        });
    }, 5000);

    // 3. Simulate Occupation Changes (Radar)
    setInterval(() => {
        if (!charts.occupation) return;
        const newData = [60, 90, 40, 70, 85, 50].map(v => Math.min(100, Math.max(20, v + Math.floor(Math.random() * 20 - 10))));
        charts.occupation.setOption({
            series: [{
                data: [{
                    value: newData,
                    name: '职业分布'
                }]
            }]
        });
    }, 4000);

    // 4. Simulate Consumption Funnel
    setInterval(() => {
        if (!charts.consumption) return;
        charts.consumption.setOption({
            series: [{
                data: [
                    { value: 60 + Math.random() * 10, name: '高消费', itemStyle: { color: '#2979ff' } },
                    { value: 40 + Math.random() * 10, name: '中高消费', itemStyle: { color: '#00eaff' } },
                    { value: 20 + Math.random() * 10, name: '中等消费', itemStyle: { color: '#00b0ff' } },
                    { value: 10 + Math.random() * 5, name: '低消费', itemStyle: { color: '#80d8ff' } }
                ]
            }]
        });
    }, 3500);

    // 5. Simulate Interest Bubbles (Graph)
    setInterval(() => {
        if (!charts.interest) return;
        const opt = charts.interest.getOption();
        if (!opt.series || !opt.series[0].data) return;
        
        const data = opt.series[0].data.map(item => {
            // Randomly change value
            let newVal = item.value + (Math.random() * 10 - 5);
            newVal = Math.max(20, Math.min(100, newVal));
            return {
                ...item,
                value: newVal,
                symbolSize: newVal
            };
        });
        
        charts.interest.setOption({
            series: [{ data: data }]
        });
    }, 2000);

    // 6. Simulate KPI Numbers (Total Users & New User Rate)
    const totalUserEl = document.getElementById('total-user-num');
    const newUserRateEl = document.getElementById('new-user-rate');
    
    let currentTotalUsers = 8942105;
    
    setInterval(() => {
        // Increase total users
        const increase = Math.floor(Math.random() * 50 + 10);
        currentTotalUsers += increase;
        if (totalUserEl) totalUserEl.textContent = currentTotalUsers.toLocaleString();
        
        // Fluctuate new user rate
        if (newUserRateEl) {
            const rate = 12.5 + (Math.random() * 0.4 - 0.2);
            newUserRateEl.textContent = rate.toFixed(1) + '%';
        }
    }, 1000);
}

// Start
initAllCharts();
startDataSimulation();



