export class DataStream {
  constructor() {
    this.listeners = [];
    this.intervalId = null;
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  start() {
    this.intervalId = setInterval(() => {
      const data = this.generateData();
      this.notify(data);
    }, 5000); // Update every 5 seconds (slower)
  }

  stop() {
    clearInterval(this.intervalId);
  }

  notify(data) {
    this.listeners.forEach(listener => listener(data));
  }

  generateData() {
    // Static list of warehouses (extended)
    const cities = [
      { id: 'shanghai', name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
      { id: 'guangzhou', name: 'Guangzhou', lat: 23.1291, lon: 113.2644 },
      { id: 'beijing', name: 'Beijing', lat: 39.9042, lon: 116.4074 },
      { id: 'newyork', name: 'New York', lat: 40.7128, lon: -74.0060 },
      { id: 'london', name: 'London', lat: 51.5074, lon: -0.1278 },
      { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
      { id: 'sydney', name: 'Sydney', lat: -33.8688, lon: 151.2093 },
      { id: 'moscow', name: 'Moscow', lat: 55.7558, lon: 37.6173 },
      { id: 'cairo', name: 'Cairo', lat: 30.0444, lon: 31.2357 },
      { id: 'saopaulo', name: 'Sao Paulo', lat: -23.5505, lon: -46.6333 },
      { id: 'losangeles', name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
      { id: 'dubai', name: 'Dubai', lat: 25.2048, lon: 55.2708 },
      { id: 'frankfurt', name: 'Frankfurt', lat: 50.1109, lon: 8.6821 },
      { id: 'singapore', name: 'Singapore', lat: 1.3521, lon: 103.8198 },
      { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
      { id: 'johannesburg', name: 'Johannesburg', lat: -26.2041, lon: 28.0473 },
      { id: 'paris', name: 'Paris', lat: 48.8566, lon: 2.3522 },
      { id: 'berlin', name: 'Berlin', lat: 52.5200, lon: 13.4050 },
      { id: 'bangkok', name: 'Bangkok', lat: 13.7563, lon: 100.5018 },
      { id: 'seoul', name: 'Seoul', lat: 37.5665, lon: 126.9780 },
      { id: 'jakarta', name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
      { id: 'istanbul', name: 'Istanbul', lat: 41.0082, lon: 28.9784 },
      { id: 'mexicocity', name: 'Mexico City', lat: 19.4326, lon: -99.1332 },
      { id: 'toronto', name: 'Toronto', lat: 43.6532, lon: -79.3832 },
      { id: 'madrid', name: 'Madrid', lat: 40.4168, lon: -3.7038 },
      { id: 'chicago', name: 'Chicago', lat: 41.8781, lon: -87.6298 },
      { id: 'hongkong', name: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
      { id: 'taipei', name: 'Taipei', lat: 25.0330, lon: 121.5654 },
      { id: 'riyadh', name: 'Riyadh', lat: 24.7136, lon: 46.6753 },
      { id: 'buenosaires', name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 }
    ];

    // Generate dynamic status and capacity
    // Use a persistent map if possible, or just deterministic random based on time?
    // For now, just random but less variance to keep it stable-ish?
    // Or just fully random as before but slower interval.

    const warehouses = cities.map(city => {
      // Random capacity between 40 and 98
      const capacity = Math.floor(Math.random() * 58) + 40;
      let status = 'normal';
      if (capacity > 90) status = 'critical';
      else if (capacity > 75) status = 'warning';

      return { ...city, capacity, status };
    });

    // Calculate utilization average
    const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
    const avgUtilization = totalCapacity / warehouses.length;

    // Static Routes (Flight lines don't change)
    const routes = [
      { from: 'shanghai', to: 'newyork', volume: 'high', status: 'delayed' },
      { from: 'guangzhou', to: 'sydney', volume: 'medium', status: 'normal' },
      { from: 'beijing', to: 'moscow', volume: 'low', status: 'normal' },
      { from: 'tokyo', to: 'shanghai', volume: 'high', status: 'urgent' },
      { from: 'london', to: 'cairo', volume: 'medium', status: 'normal' },
      { from: 'losangeles', to: 'tokyo', volume: 'high', status: 'urgent' }, // Changed to urgent
      { from: 'dubai', to: 'frankfurt', volume: 'high', status: 'normal' },
      { from: 'singapore', to: 'sydney', volume: 'medium', status: 'normal' },
      { from: 'mumbai', to: 'dubai', volume: 'medium', status: 'normal' },
      { from: 'newyork', to: 'london', volume: 'high', status: 'urgent' }, // Changed to urgent
      { from: 'frankfurt', to: 'beijing', volume: 'medium', status: 'delayed' },
      { from: 'johannesburg', to: 'cairo', volume: 'low', status: 'normal' },
      { from: 'saopaulo', to: 'losangeles', volume: 'medium', status: 'warning' },
      { from: 'shanghai', to: 'losangeles', volume: 'high', status: 'normal' },
      { from: 'tokyo', to: 'sydney', volume: 'medium', status: 'normal' },
      { from: 'london', to: 'newyork', volume: 'high', status: 'normal' },
      { from: 'dubai', to: 'mumbai', volume: 'medium', status: 'normal' },
      { from: 'frankfurt', to: 'moscow', volume: 'low', status: 'normal' },
      { from: 'singapore', to: 'tokyo', volume: 'medium', status: 'normal' },
      { from: 'cairo', to: 'dubai', volume: 'medium', status: 'normal' },
      { from: 'sydney', to: 'losangeles', volume: 'high', status: 'urgent' }, // Changed to urgent
      { from: 'beijing', to: 'tokyo', volume: 'high', status: 'normal' },
      { from: 'newyork', to: 'saopaulo', volume: 'medium', status: 'normal' },
      { from: 'moscow', to: 'london', volume: 'medium', status: 'normal' },
      { from: 'paris', to: 'berlin', volume: 'medium', status: 'normal' },
      { from: 'bangkok', to: 'singapore', volume: 'medium', status: 'normal' },
      { from: 'mexicocity', to: 'losangeles', volume: 'high', status: 'warning' },
      { from: 'toronto', to: 'newyork', volume: 'high', status: 'normal' },
      { from: 'madrid', to: 'paris', volume: 'medium', status: 'normal' },
      { from: 'jakarta', to: 'singapore', volume: 'medium', status: 'normal' },
      { from: 'buenosaires', to: 'saopaulo', volume: 'medium', status: 'normal' },
      { from: 'seoul', to: 'beijing', volume: 'high', status: 'urgent' },
      { from: 'istanbul', to: 'cairo', volume: 'medium', status: 'normal' },
      { from: 'chicago', to: 'newyork', volume: 'high', status: 'normal' },
      { from: 'hongkong', to: 'guangzhou', volume: 'high', status: 'urgent' },
      { from: 'taipei', to: 'hongkong', volume: 'medium', status: 'normal' },
      { from: 'riyadh', to: 'dubai', volume: 'medium', status: 'normal' },
    ];

    return {
      timestamp: new Date(),
      globalStats: {
        totalOrders: Math.floor(Math.random() * 1000000000) + 123000000,
        warehouseUtilization: avgUtilization,
        activeTrucks: Math.floor(Math.random() * 5000) + 1000,
      },
      warehouses: warehouses,
      routes: routes,
      events: [
        { time: new Date().toLocaleTimeString(), message: '订单 #774H 已送达上海分拨中心', type: 'success' },
        { time: new Date().toLocaleTimeString(), message: '高负载预警: 纽约转运中心负载率 > 90%', type: 'alert' },
        { time: new Date().toLocaleTimeString(), message: '新航线开通: 东京 - 上海 货运专线', type: 'info' },
        { time: new Date().toLocaleTimeString(), message: '实时: 广州仓出库效率提升 15%', type: 'success' },
        { time: new Date().toLocaleTimeString(), message: '延误: 伦敦-开罗 航班因天气延误', type: 'warning' },
      ]
    };
  }
}
