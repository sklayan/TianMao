// Regional Economy Map Logic via ECharts

let myChart = null;
let mapDataCache = {};
const crumb = document.getElementById('drill-crumb');

// Navigation History Stack: [{code, name}]
let navHistory = [];

// Mock Data for Right Panel
const mockData = {
    '100000': { name: '全国', en: 'China', gmv25: 912, gmv24: 571, growth: 59.7 },
    '420000': { name: '湖北省', en: 'Hubei', gmv25: 45, gmv24: 28, growth: 60.7 },
    '440000': { name: '广东省', en: 'Guangdong', gmv25: 98, gmv24: 75, growth: 30.6 },
    '330000': { name: '浙江省', en: 'Zhejiang', gmv25: 88, gmv24: 68, growth: 29.4 },
    // Default fallback for others
    'default': { name: '未知区域', en: 'Region', gmv25: 30, gmv24: 20, growth: 50.0 }
};

document.addEventListener('DOMContentLoaded', () => {
    initParticles(); // 初始化粒子背景
    initMap();

    // Breadcrumb Click (Go Up One Level)
    crumb.addEventListener('click', () => {
        goBackOneLevel();
    });

    // 返回上级按钮点击事件
    const backBtn = document.getElementById('back-to-parent');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            goBackOneLevel();
        });
    }

    window.addEventListener('resize', () => {
        if (myChart) myChart.resize();
    });
});

// 返回上一级函数
function goBackOneLevel() {
    if (navHistory.length > 1) {
        navHistory.pop(); // Remove current
        const prev = navHistory[navHistory.length - 1]; // Get parent
        // Reload parent, but don't push to stack again
        loadMap(prev.code, prev.name, false, true);
    }
}

async function initMap() {
    myChart = echarts.init(document.getElementById('echarts-map'));

    myChart.showLoading({
        text: 'Loading Geo Data...',
        color: '#00eaff',
        textColor: '#00eaff',
        maskColor: 'rgba(0, 0, 0, 0.4)',
        zlevel: 0
    });

    // Initial Load
    await loadMap('100000', 'China', true);

    // Click Event for Drill Down
    myChart.on('click', async (params) => {
        if (params.data && params.data.adcode) {
            const targetCode = params.data.adcode.toString();
            const targetName = params.name;
            await loadMap(targetCode, targetName);
        } else {
            console.warn('No adcode found in clicked feature data', params);
        }
    });
}

// Full list would be fetched from: https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
// But to save bandwidth/complexity, we do lazy load.

/**
 * Loads the map for a given adcode.
 * @param {string} adcode - The region code (e.g., '100000').
 * @param {string} mapName - The display name.
 * @param {boolean} isReset - If true, clears history and starts fresh.
 * @param {boolean} isBack - If true, implies we are navigating back (don't push to stack).
 */
async function loadMap(adcode, mapName, isReset = false, isBack = false) {
    try {
        let geoJson = mapDataCache[adcode];

        // Fetch if not cached
        if (!geoJson) {
            myChart.showLoading();
            // Use Aliyun Datav GeoAtlas
            const url = `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`;
            const res = await fetch(url);

            if (!res.ok) {
                console.warn(`GeoJSON fetch failed for ${adcode}. Treating as leaf node.`);
                // Update panel to show leaf node info
                updatePanel(adcode, mapName);
                myChart.hideLoading();
                return;
            }
            geoJson = await res.json();
            mapDataCache[adcode] = geoJson;
        }

        // Successfully loaded map data -> Update History
        if (isReset) {
            navHistory = [{ code: adcode, name: mapName }];
        } else if (!isBack) {
            // Check if already top of stack to avoid dupes
            const current = navHistory[navHistory.length - 1];
            if (!current || current.code !== adcode) {
                navHistory.push({ code: adcode, name: mapName });
            }
        }
        // If isBack is true, we assume caller handled the stack pop.

        echarts.registerMap(mapName, geoJson);

        // Update Breadcrumb UI
        updateBreadcrumb();

        // Update Chart
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderColor: '#00eaff',
                textStyle: { color: '#fff' },
                formatter: '{b}'
            },
            geo: {
                map: mapName,
                roam: true, // Enable Zoom/Pan
                zoom: 1.2,
                label: {
                    show: true,
                    color: '#fff',
                    fontSize: 10
                },
                itemStyle: {
                    areaColor: 'rgba(10, 30, 60, 0.6)',
                    borderColor: '#00eaff',
                    borderWidth: 1,
                    shadowColor: 'rgba(0, 234, 255, 0.5)',
                    shadowBlur: 10
                },
                emphasis: {
                    itemStyle: {
                        areaColor: '#00eaff',
                        shadowBlur: 20
                    },
                    label: {
                        show: true,
                        color: '#000'
                    }
                }
            },
            series: [
                {
                    name: 'Regional Sales',
                    type: 'map',
                    geoIndex: 0,
                    // IMPORTANT: Map features to data WITH adcode
                    data: geoJson.features.map(f => ({
                        name: f.properties.name,
                        adcode: f.properties.adcode, // Store adcode for click handler
                        value: Math.round(Math.random() * 1000)
                    }))
                }
            ]
        };

        myChart.setOption(option, true); // true = not merge, reset
        myChart.hideLoading();

        // Update Panel Data
        updatePanel(adcode, mapName);

    } catch (e) {
        console.error("Map Load Error", e);
        myChart.hideLoading();
    }
}

function updateBreadcrumb() {
    const backBtn = document.getElementById('back-to-parent');

    if (navHistory.length <= 1) {
        crumb.style.display = 'none';
        if (backBtn) backBtn.style.display = 'none';
    } else {
        crumb.style.display = 'block';
        if (backBtn) backBtn.style.display = 'flex';
        // Show path: China > Hubei > Wuhan
        // Limit length if too long?
        const path = navHistory.map(item => item.name).join(' > ');
        crumb.innerText = path;
        crumb.style.cursor = 'pointer'; // Hint it's clickable to go back
    }
}

// 各省份Top城市/地区数据
const topAreasData = {
    '100000': ['广东省', '浙江省', '江苏省'],
    '110000': ['朝阳区', '海淀区', '东城区'],       // 北京
    '120000': ['滨海新区', '和平区', '南开区'],     // 天津
    '130000': ['石家庄市', '唐山市', '保定市'],     // 河北
    '140000': ['太原市', '大同市', '临汾市'],       // 山西
    '150000': ['呼和浩特市', '包头市', '鄂尔多斯市'], // 内蒙古
    '210000': ['沈阳市', '大连市', '鞍山市'],       // 辽宁
    '220000': ['长春市', '吉林市', '四平市'],       // 吉林
    '230000': ['哈尔滨市', '齐齐哈尔市', '牡丹江市'], // 黑龙江
    '310000': ['浦东新区', '闵行区', '徐汇区'],     // 上海
    '320000': ['苏州市', '南京市', '无锡市'],       // 江苏
    '330000': ['杭州市', '宁波市', '温州市'],       // 浙江
    '340000': ['合肥市', '芜湖市', '蚌埠市'],       // 安徽
    '350000': ['福州市', '厦门市', '泉州市'],       // 福建
    '360000': ['南昌市', '九江市', '赣州市'],       // 江西
    '370000': ['济南市', '青岛市', '烟台市'],       // 山东
    '410000': ['郑州市', '洛阳市', '开封市'],       // 河南
    '420000': ['武汉市', '宜昌市', '襄阳市'],       // 湖北
    '430000': ['长沙市', '株洲市', '湘潭市'],       // 湖南
    '440000': ['广州市', '深圳市', '东莞市'],       // 广东
    '450000': ['南宁市', '柳州市', '桂林市'],       // 广西
    '460000': ['海口市', '三亚市', '儋州市'],       // 海南
    '500000': ['渝中区', '沙坪坝区', '渝北区'],     // 重庆
    '510000': ['成都市', '绵阳市', '德阳市'],       // 四川
    '520000': ['贵阳市', '遵义市', '六盘水市'],     // 贵州
    '530000': ['昆明市', '曲靖市', '玉溪市'],       // 云南
    '540000': ['拉萨市', '日喀则市', '昌都市'],     // 西藏
    '610000': ['西安市', '宝鸡市', '咸阳市'],       // 陕西
    '620000': ['兰州市', '天水市', '白银市'],       // 甘肃
    '630000': ['西宁市', '海东市', '海北州'],       // 青海
    '640000': ['银川市', '石嘴山市', '吴忠市'],     // 宁夏
    '650000': ['乌鲁木齐市', '克拉玛依市', '吐鲁番市'], // 新疆
    '710000': ['台北市', '高雄市', '台中市'],       // 台湾
    '810000': ['中西区', '湾仔区', '东区'],         // 香港
    '820000': ['澳门半岛', '氹仔', '路环']          // 澳门
};

function getTopAreas(adcode, regionName) {
    // 如果有精确匹配的区域数据，直接返回
    if (topAreasData[adcode]) {
        return topAreasData[adcode];
    }

    // 为没有预定义数据的区域生成通用名称
    const defaultAreas = [
        `${regionName}中心区`,
        `${regionName}东部区`,
        `${regionName}西部区`
    ];

    return defaultAreas;
}

function updatePanel(adcode, name) {
    const data = mockData[adcode] || { ...mockData['default'], name: name };

    // Auto-generate some realistic looking data based on adcode hash if not mocked
    if (!mockData[adcode]) {
        // Hierarchical Scaling Logic
        let level = 'county';
        if (adcode.endsWith('0000')) level = 'province';
        else if (adcode.endsWith('00')) level = 'city';

        // Better Seed: Sum of char codes to avoid '00' endings causing identical seeds
        const seed = adcode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const randomVal = (seed % 100) / 100; // 0.00 - 0.99

        let baseGMV;
        if (level === 'province') {
            baseGMV = 100 + (randomVal * 200); // 100 - 300 for Provinces
        } else if (level === 'city') {
            baseGMV = 20 + (randomVal * 60);   // 20 - 80 for Cities/Prefectures
        } else {
            baseGMV = 1 + (randomVal * 14);    // 1 - 15 for Counties/Districts
        }

        data.gmv25 = parseFloat(baseGMV.toFixed(1));

        // Randomize growth factor (0.6 - 0.9)
        const randomFactor = 0.6 + ((seed * 13) % 40) / 100;
        data.gmv24 = parseFloat((data.gmv25 * randomFactor).toFixed(1));
        data.growth = ((data.gmv25 - data.gmv24) / data.gmv24 * 100).toFixed(1);
    }

    const panelHTML = `
        <div class="region-detail-card">
            <div class="card-header">
                <span class="region-name-large">${data.name}</span>
                <span class="region-en-name">${data.en || 'Region'}</span>
            </div>
            
            <div class="stat-row">
                <div class="stat-label">Total GMV (Sales)</div>
                <div class="stat-bar-container">
                    <div class="year-label">2025</div>
                    <div class="bar-bg">
                        <div class="bar-fill" style="width: 85%;"></div>
                    </div>
                    <div class="stat-value">¥${data.gmv25}亿</div>
                </div>
                <div class="stat-bar-container">
                    <div class="year-label">2024</div>
                    <div class="bar-bg">
                        <div class="bar-fill prev-year" style="width: ${data.gmv24 / data.gmv25 * 85}%;"></div>
                    </div>
                    <div class="stat-value">¥${(data.gmv24).toFixed(1)}亿</div>
                </div>
            </div>

            <div class="growth-indicator">
                <div class="growth-icon">▲ ${data.growth}%</div>
                <div class="growth-text">YoY Growth</div>
            </div>
        </div>

        <div style="margin-top:20px;">
           <h4 style="color:#00eaff; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px;">TOP AREAS IN ${data.name}</h4>
           <ul style="list-style:none; padding:0; margin-top:10px; font-size:12px; color:#ccc;">
               <li style="display:flex; justify-content:space-between; margin-bottom:5px;">
                   <span>1. ${getTopAreas(adcode, data.name)[0]}</span> <span style="color:#fff;">¥${(data.gmv25 * 0.4).toFixed(1)}亿</span>
               </li>
               <li style="display:flex; justify-content:space-between; margin-bottom:5px;">
                   <span>2. ${getTopAreas(adcode, data.name)[1]}</span> <span style="color:#fff;">¥${(data.gmv25 * 0.25).toFixed(1)}亿</span>
               </li>
               <li style="display:flex; justify-content:space-between; margin-bottom:5px;">
                   <span>3. ${getTopAreas(adcode, data.name)[2]}</span> <span style="color:#fff;">¥${(data.gmv25 * 0.15).toFixed(1)}亿</span>
               </li>
           </ul>
        </div>
    `;

    document.getElementById('region-info').innerHTML = panelHTML;
}

// --- 粒子背景动画系统 ---
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
                const dist = Math.sqrt(dx * dx + dy * dy);
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
