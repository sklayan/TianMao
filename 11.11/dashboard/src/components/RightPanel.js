import * as d3 from 'd3';

export class RightPanel {
  constructor(containerId, dataStream) {
    this.container = document.getElementById(containerId);
    this.dataStream = dataStream;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="panel-card">
        <h3 class="panel-title">调度-轨迹对比</h3>
        <div id="chart-dispatch" class="chart-container"></div>
      </div>
      
      <div class="panel-card">
        <h3 class="panel-title">库存容量实时监控</h3>
        <div id="table-inventory" class="table-container">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>仓库</th>
                <th>容量</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody id="inventory-body"></tbody>
          </table>
        </div>
      </div>

      <div class="panel-card">
        <h3 class="panel-title">运输方式占比</h3>
        <div id="chart-transport" class="chart-container"></div>
      </div>
    `;

    this.renderCharts();
    this.dataStream.subscribe(this.update.bind(this));
  }

  renderCharts() {
    // Use requestAnimationFrame to ensure DOM is ready and layout is calculated
    requestAnimationFrame(() => {
      // Dispatch Chart (Dual Axis: Bar + Line)
      this.renderDispatchChart();
      // Transport Chart (Donut Chart with Legend)
      this.renderTransportChart();
      // Add Tooltip Container
      if (!document.getElementById('tooltip')) {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.visibility = 'hidden';
        tooltip.style.background = 'rgba(0,0,0,0.8)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '0.8rem';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '1000';
        document.body.appendChild(tooltip);
      }
    });
  }

  renderDispatchChart() {
    const container = document.getElementById('chart-dispatch');
    if (!container) return;
    container.innerHTML = '';

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    // Use clientWidth/Height with fallbacks
    const width = (container.clientWidth || 300) - margin.left - margin.right;
    const height = (container.clientHeight || 200) - margin.top - margin.bottom;

    const svg = d3.select(container).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${container.clientWidth || 300} ${container.clientHeight || 200}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Mock Data
    const data = [
      { range: '0-10m', standard: 120, actual: 140 },
      { range: '10-20m', standard: 132, actual: 130 },
      { range: '20-30m', standard: 101, actual: 125 },
      { range: '30-40m', standard: 134, actual: 145 },
      { range: '40-50m', standard: 90, actual: 110 },
    ];

    // X Axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.range))
      .padding(0.2);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .style('fill', '#a0a0a0')
      .style('font-size', '0.7rem');

    svg.select('.domain').remove();

    // Y Axis Left (Bar)
    const y1 = d3.scaleLinear()
      .domain([0, 200])
      .range([height, 0]);

    svg.append('g')
      .call(d3.axisLeft(y1).ticks(5))
      .selectAll('text')
      .style('fill', '#a0a0a0');

    svg.selectAll('.domain, .tick line').style('stroke', '#333');

    // Bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.range))
      .attr('width', x.bandwidth())
      .attr('y', d => y1(d.standard))
      .attr('height', d => height - y1(d.standard))
      .attr('fill', '#0099aa')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#00f2ff');
        const tooltip = document.getElementById('tooltip');
        tooltip.style.visibility = 'visible';
        tooltip.innerHTML = `标准: ${d.standard}<br>实际: ${d.actual}`;
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY - 20 + 'px';
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', '#0099aa');
        document.getElementById('tooltip').style.visibility = 'hidden';
      });

    // Line (Actual)
    const line = d3.line()
      .x(d => x(d.range) + x.bandwidth() / 2)
      .y(d => y1(d.actual))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#ff3333')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Dots
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.range) + x.bandwidth() / 2)
      .attr('cy', d => y1(d.actual))
      .attr('r', 4)
      .attr('fill', '#ff3333')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120}, -10)`);

    legend.append('rect').attr('width', 10).attr('height', 10).attr('fill', '#0099aa');
    legend.append('text').attr('x', 15).attr('y', 9).text('系统推荐').style('fill', '#fff').style('font-size', '0.7rem');

    legend.append('circle').attr('cx', 75).attr('cy', 5).attr('r', 4).attr('fill', '#ff3333');
    legend.append('text').attr('x', 85).attr('y', 9).text('实时轨迹').style('fill', '#fff').style('font-size', '0.7rem');
  }

  renderTransportChart() {
    const container = document.getElementById('chart-transport');
    if (!container) return;
    container.innerHTML = '';

    const rect = container.getBoundingClientRect();
    // Fallback to clientWidth/Height or default values if rect is 0
    const width = rect.width || container.clientWidth || 300;
    const height = rect.height || container.clientHeight || 200;
    const radius = Math.min(width, height) / 2 - 10;

    if (width <= 0 || height <= 0) return;

    const svg = d3.select(container).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 3},${height / 2})`);

    const data = { '陆运': 45, '海运': 25, '空运': 30 };
    const color = d3.scaleOrdinal()
      .domain(Object.keys(data))
      .range(['#00f2ff', '#bc13fe', '#ff9900']);

    const pie = d3.pie().value(d => d[1]);
    const data_ready = pie(Object.entries(data));

    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);

    svg.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data[0]))
      .attr('stroke', '#0b0f19')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .on('mouseover', function (event, d) {
        d3.select(this).style('opacity', 1).attr('transform', 'scale(1.05)');
        const tooltip = document.getElementById('tooltip');
        tooltip.style.visibility = 'visible';
        tooltip.innerHTML = `${d.data[0]}: ${d.data[1]}%`;
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY - 20 + 'px';
      })
      .on('mouseout', function () {
        d3.select(this).style('opacity', 0.8).attr('transform', 'scale(1)');
        document.getElementById('tooltip').style.visibility = 'hidden';
      });

    // Legend
    const legend = d3.select(container).select('svg').append('g')
      .attr('transform', `translate(${width * 0.65}, ${height * 0.3})`);

    Object.keys(data).forEach((key, i) => {
      const g = legend.append('g').attr('transform', `translate(0, ${i * 20})`);
      g.append('rect').attr('width', 10).attr('height', 10).attr('fill', color(key));
      g.append('text').attr('x', 15).attr('y', 9).text(key).style('fill', '#fff').style('font-size', '0.8rem');
    });
  }

  update(data) {
    // Update Inventory Table
    const tbody = document.getElementById('inventory-body');
    if (tbody) {
      tbody.innerHTML = '';
      const topWarehouses = [...data.warehouses].sort((a, b) => b.capacity - a.capacity).slice(0, 5);
      topWarehouses.forEach(w => {
        const statusText = {
          'critical': '过载',
          'warning': '警告',
          'normal': '正常'
        }[w.status] || w.status;

        const row = `
            <tr>
              <td>${w.name}</td>
              <td>${w.capacity}/100</td>
              <td style="color: ${this.getStatusColor(w.status)}; font-weight: bold;">${statusText}</td>
            </tr>
          `;
        tbody.innerHTML += row;
      });
    }
  }

  getStatusColor(status) {
    switch (status) {
      case 'critical': return 'var(--alert-red)';
      case 'warning': return 'var(--accent-orange)';
      default: return 'var(--success-green)';
    }
  }

  // Helper removed as we use CSS classes now
}
