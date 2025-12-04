import * as d3 from 'd3';

export class MapComponent {
    constructor(containerId, dataStream) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.dataStream = dataStream;
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.svg = null;
        this.projection = null;
        this.path = null;
        this.mapGroup = null;
        this.routesGroup = null;
        this.warehousesGroup = null;

        this.init();
    }

    async init() {
        this.svg = d3.select(`#${this.containerId}`)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .style('background', 'transparent');

        this.mapGroup = this.svg.append('g').attr('class', 'map-layer');
        this.routesGroup = this.svg.append('g').attr('class', 'routes-layer');
        this.warehousesGroup = this.svg.append('g').attr('class', 'warehouses-layer');

        // Load GeoJSON
        try {
            const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
            const geoData = await response.json();
            this.renderMap(geoData);
            this.addLegend(); // Add legend after map render
        } catch (error) {
            console.error('Error loading map data:', error);
            this.container.innerHTML = '<div class="error">Map Data Loading Failed</div>';
        }

        // Subscribe to data updates
        this.dataStream.subscribe(this.update.bind(this));

        // Handle Resize
        window.addEventListener('resize', () => this.resize());
    }

    renderMap(geoData) {
        // Filter out Antarctica to save space
        const features = geoData.features.filter(d => d.properties.name !== 'Antarctica' && d.id !== 'ATA');

        this.projection = d3.geoMercator()
            .center([0, 25]) // Center North to move map down further
            .scale(100)
            .translate([this.width / 2, this.height / 2]);

        this.path = d3.geoPath().projection(this.projection);

        this.mapGroup.selectAll('path')
            .data(features) // Use filtered features
            .enter()
            .append('path')
            .attr('d', this.path)
            .attr('fill', '#0f4c81')
            .attr('stroke', '#1e3a8a')
            .attr('stroke-width', 0.5)
            .style('opacity', 0.9);
    }

    update(data) {
        if (!this.projection) return;

        // Update Warehouses
        const warehouses = this.warehousesGroup.selectAll('.warehouse')
            .data(data.warehouses, d => d.id);

        warehouses.exit().remove();

        const warehousesEnter = warehouses.enter()
            .append('g')
            .attr('class', 'warehouse');

        warehousesEnter.append('circle')
            .attr('r', 4)
            .attr('fill', d => this.getStatusColor(d.status))
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5);

        // Add ripple effect for critical/warning
        warehousesEnter.filter(d => d.status !== 'normal')
            .append('circle')
            .attr('r', 4)
            .attr('fill', 'none')
            .attr('stroke', d => this.getStatusColor(d.status))
            .attr('stroke-width', 1)
            .attr('class', 'ripple')
            .append('animate')
            .attr('attributeName', 'r')
            .attr('from', 4)
            .attr('to', 15)
            .attr('dur', '1.5s')
            .attr('repeatCount', 'indefinite')
            .append('animate')
            .attr('attributeName', 'opacity')
            .attr('from', 1)
            .attr('to', 0)
            .attr('dur', '1.5s')
            .attr('repeatCount', 'indefinite');

        // Update positions
        warehouses.merge(warehousesEnter)
            .attr('transform', d => {
                const coords = this.projection([d.lon, d.lat]);
                return `translate(${coords[0]}, ${coords[1]})`;
            });

        // Update Routes
        const routes = this.routesGroup.selectAll('.route')
            .data(data.routes);

        routes.exit().remove();

        const routesEnter = routes.enter()
            .append('path')
            .attr('class', 'route')
            .attr('fill', 'none')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.8);

        routes.merge(routesEnter)
            .attr('stroke', d => this.getRouteColor(d.status))
            .attr('stroke-width', d => d.status === 'urgent' ? 3 : 2) // Thicker for urgent
            .style('filter', d => `drop-shadow(0 0 ${d.status === 'urgent' ? '5px' : '3px'} ${this.getRouteColor(d.status)})`) // Stronger glow for urgent
            .attr('d', d => {
                const from = data.warehouses.find(w => w.id === d.from);
                const to = data.warehouses.find(w => w.id === d.to);
                if (from && to) {
                    return this.generateCurve(from, to);
                }
                return '';
            });
    }

    generateCurve(source, target) {
        const sourceCoords = this.projection([source.lon, source.lat]);
        const targetCoords = this.projection([target.lon, target.lat]);

        const dx = targetCoords[0] - sourceCoords[0];
        const dy = targetCoords[1] - sourceCoords[1];
        const dr = Math.sqrt(dx * dx + dy * dy);

        // Quadratic Bezier: Start, Control, End
        // Control point is perpendicular to the midpoint
        const midX = (sourceCoords[0] + targetCoords[0]) / 2;
        const midY = (sourceCoords[1] + targetCoords[1]) / 2;

        // Curve height depends on distance
        const curveHeight = dr * 0.2;

        // Calculate normal vector
        const normX = -dy / dr;
        const normY = dx / dr;

        const controlX = midX + normX * curveHeight;
        const controlY = midY + normY * curveHeight;

        return `M${sourceCoords[0]},${sourceCoords[1]} Q${controlX},${controlY} ${targetCoords[0]},${targetCoords[1]}`;
    }

    getStatusColor(status) {
        switch (status) {
            case 'critical': return '#ff3333';
            case 'warning': return '#ff9900';
            default: return '#33ff33';
        }
    }

    getRouteColor(status) {
        switch (status) {
            case 'urgent': return '#ff3333'; // Red
            case 'delayed': return '#ff9900'; // Orange
            default: return '#00f2ff'; // Cyan
        }
    }

    addLegend() {
        const legendContainer = document.createElement('div');
        legendContainer.className = 'map-legend';
        legendContainer.innerHTML = `
            <div class="legend-title">图例</div>
            <div class="legend-section">
                <div class="legend-subtitle">仓库状态</div>
                <div class="legend-item"><span class="dot normal"></span>正常</div>
                <div class="legend-item"><span class="dot warning"></span>警告</div>
                <div class="legend-item"><span class="dot critical"></span>过载</div>
            </div>
            <div class="legend-section">
                <div class="legend-subtitle">航线状态</div>
                <div class="legend-item"><span class="line normal"></span>通畅</div>
                <div class="legend-item"><span class="line delayed"></span>延误</div>
                <div class="legend-item"><span class="line urgent"></span>加急</div>
            </div>
        `;
        this.container.appendChild(legendContainer);
    }

    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.svg.attr('viewBox', `0 0 ${this.width} ${this.height}`);

        if (this.projection) {
            this.projection.center([0, 25]).translate([this.width / 2, this.height / 2]);
            this.path.projection(this.projection);
            this.mapGroup.selectAll('path').attr('d', this.path);

            // Re-render routes and warehouses will happen on next update cycle
        }
    }
}
