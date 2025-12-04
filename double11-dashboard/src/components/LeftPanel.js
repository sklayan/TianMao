import * as d3 from 'd3';

export class LeftPanel {
  constructor(containerId, dataStream) {
    this.container = document.getElementById(containerId);
    this.dataStream = dataStream;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="panel-card">
        <h3 class="panel-title">全局资源态势</h3>
        <div class="resource-status">
          <div class="status-header">
            <span>总仓利用率</span>
            <span class="highlight-value" id="utilization-text">0%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" id="total-utilization" style="width: 0%"></div>
          </div>
          <div class="status-details">
            <div class="detail-item">
              <span class="detail-number alert" id="high-load-count">0</span>
              <span class="detail-label">高负载仓库</span>
            </div>
            <div class="detail-item">
              <span class="detail-number success" id="idle-count">0</span>
              <span class="detail-label">空闲资源仓库</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <h3 class="panel-title">实时调度监控</h3>
        <div class="monitor-grid">
          <div class="monitor-row main">
            <span>今日调度任务总数</span>
            <span class="monitor-value blue" id="total-tasks">0</span>
          </div>
          <div class="monitor-row">
            <span>正在进行</span>
            <span class="monitor-value orange" id="active-tasks">0</span>
          </div>
          <div class="monitor-row">
            <span>等待执行</span>
            <span class="monitor-value" id="pending-tasks">0</span>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <h3 class="panel-title">性能指标</h3>
        <div class="kpi-grid">
          <div class="kpi-row">
            <span class="kpi-label">平均响应时间 (ms)</span>
            <div class="kpi-data">
              <span class="kpi-value blue" id="avg-response">0</span>
              <span class="trend up">+1.2%</span>
            </div>
          </div>
          <div class="kpi-row">
            <span class="kpi-label">调度成功率 (%)</span>
            <div class="kpi-data">
              <span class="kpi-value success" id="success-rate">99.9</span>
              <span class="trend">保持高位</span>
            </div>
          </div>
          <div class="kpi-row">
            <span class="kpi-label">成本节约 (%)</span>
            <div class="kpi-data">
              <span class="kpi-value orange">3.7</span>
              <span class="trend">高于目标值</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.dataStream.subscribe(this.update.bind(this));
  }

  update(data) {
    // Update Utilization
    const util = data.globalStats.warehouseUtilization;
    const utilBar = document.getElementById('total-utilization');
    const utilText = document.getElementById('utilization-text');

    if (utilBar && utilText) {
      utilBar.style.width = `${util}%`;
      utilBar.style.backgroundColor = util > 90 ? 'var(--alert-red)' : (util > 70 ? 'var(--accent-orange)' : 'var(--accent-blue)');
      utilText.innerText = `${util.toFixed(1)}%`;
    }

    // Update Counts
    // Update Counts
    const highLoad = data.warehouses.filter(w => w.status === 'critical' || w.status === 'warning').length;
    const idle = data.warehouses.filter(w => w.status === 'normal').length;

    const highLoadEl = document.getElementById('high-load-count');
    const idleEl = document.getElementById('idle-count');
    if (highLoadEl) highLoadEl.innerText = highLoad;
    if (idleEl) idleEl.innerText = idle;

    // Update Tasks
    const totalTasks = Math.floor(data.globalStats.totalOrders / 100000);
    const activeTasks = data.globalStats.activeTrucks;

    const totalEl = document.getElementById('total-tasks');
    const activeEl = document.getElementById('active-tasks');
    const pendingEl = document.getElementById('pending-tasks');

    if (totalEl) totalEl.innerText = totalTasks.toLocaleString();
    if (activeEl) activeEl.innerText = activeTasks.toLocaleString();
    if (pendingEl) pendingEl.innerText = Math.floor(activeTasks * 0.5).toLocaleString();

    // Update KPI
    const avgRespEl = document.getElementById('avg-response');
    if (avgRespEl) avgRespEl.innerText = Math.floor(100 + Math.random() * 50);

    // Update Cost Savings (Mock data)
    const costSavingsEl = document.querySelector('.kpi-value.orange');
    if (costSavingsEl) {
      // Simulate slight fluctuation around 3.7
      const val = (3.7 + (Math.random() * 0.2 - 0.1)).toFixed(1);
      costSavingsEl.innerText = val;
    }
  }
}
