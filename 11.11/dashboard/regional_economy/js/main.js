// Regional Economy Map Logic via ECharts

let myChart = null;
let mapDataCache = {};
const crumb = document.getElementById('drill-crumb');

// Navigation History Stack: [{code, name}]
let navHistory = [];

// Mock Data for Right Panel
const mockData = {
    '100000': { name: '全国', en: 'China', gmv15: 912, gmv14: 571, growth: 59.7 },
    '420000': { name: '湖北省', en: 'Hubei', gmv15: 45, gmv14: 28, growth: 60.7 },
    '440000': { name: '广东省', en: 'Guangdong', gmv15: 98, gmv14: 75, growth: 30.6 },
    '330000': { name: '浙江省', en: 'Zhejiang', gmv15: 88, gmv14: 68, growth: 29.4 },
    // Default fallback for others
    'default': { name: '未知区域', en: 'Region', gmv15: 30, gmv14: 20, growth: 50.0 }
};

document.addEventListener('DOMContentLoaded', () => {
    initMap();

    // Map Controls
    document.getElementById('zoom-in').addEventListener('click', () => {
        if (myChart) {
            let op = myChart.getOption();
            let zoom = op.geo[0].zoom || 1;
            myChart.setOption({ geo: { zoom: zoom * 1.2 } });
        }
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        if (myChart) {
            let op = myChart.getOption();
            let zoom = op.geo[0].zoom || 1;
            myChart.setOption({ geo: { zoom: zoom / 1.2 } });
        }
    });

    // Reset now acts as "Back" if history exists, or full reset
    document.getElementById('reset-map').addEventListener('click', () => {
        if (navHistory.length > 1) {
            // Go back to absolute top
            loadMap('100000', 'China', true);
        } else {
            // Already at top, just reset zoom
            myChart.setOption({ geo: { zoom: 1.2, center: null } });
        }
    });

    // Breadcrumb Click (Go Up One Level)
    crumb.addEventListener('click', () => {
        if (navHistory.length > 1) {
            navHistory.pop(); // Remove current
            const prev = navHistory[navHistory.length - 1]; // Get parent
            // Reload parent, but don't push to stack again
            loadMap(prev.code, prev.name, false, true);
        }
    });

    window.addEventListener('resize', () => {
        if (myChart) myChart.resize();
    });
});

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
    if (navHistory.length <= 1) {
        crumb.style.display = 'none';
    } else {
        crumb.style.display = 'block';
        // Show path: China > Hubei > Wuhan
        // Limit length if too long?
        const path = navHistory.map(item => item.name).join(' > ');
        crumb.innerText = path;
        crumb.style.cursor = 'pointer'; // Hint it's clickable to go back
    }
}

function updatePanel(adcode, name) {
    const data = mockData[adcode] || { ...mockData['default'], name: name };

    // Auto-generate some realistic looking data based on adcode hash if not mocked
    if (!mockData[adcode]) {
        const seed = parseInt(adcode) || 123;
        data.gmv15 = (seed % 100) + 20;
        data.gmv14 = data.gmv15 * 0.7;
        data.growth = ((data.gmv15 - data.gmv14) / data.gmv14 * 100).toFixed(1);
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
                    <div class="year-label">2015</div>
                    <div class="bar-bg">
                        <div class="bar-fill" style="width: 85%;"></div>
                    </div>
                    <div class="stat-value">¥${data.gmv15}亿</div>
                </div>
                <div class="stat-bar-container">
                    <div class="year-label">2014</div>
                    <div class="bar-bg">
                        <div class="bar-fill prev-year" style="width: ${data.gmv14 / data.gmv15 * 85}%;"></div>
                    </div>
                    <div class="stat-value">¥${(data.gmv14).toFixed(1)}亿</div>
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
                   <span>1. Area A</span> <span style="color:#fff;">¥${(data.gmv15 * 0.4).toFixed(1)}亿</span>
               </li>
               <li style="display:flex; justify-content:space-between; margin-bottom:5px;">
                   <span>2. Area B</span> <span style="color:#fff;">¥${(data.gmv15 * 0.25).toFixed(1)}亿</span>
               </li>
               <li style="display:flex; justify-content:space-between; margin-bottom:5px;">
                   <span>3. Area C</span> <span style="color:#fff;">¥${(data.gmv15 * 0.15).toFixed(1)}亿</span>
               </li>
           </ul>
        </div>
    `;

    document.getElementById('region-info').innerHTML = panelHTML;
}
