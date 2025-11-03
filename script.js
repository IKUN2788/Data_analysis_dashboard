// 初始化时间显示
function updateTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const t = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  document.getElementById('current-time').textContent = t;
  document.getElementById('last-update').textContent = t;
}
setInterval(updateTime, 1000); updateTime();

// 连接数轻微波动
(function bumpConnections(){
  const el = document.getElementById('connection-count');
  setInterval(()=>{
    const base = 1247; const delta = Math.floor(Math.random()*20-10);
    el.textContent = (base + delta).toLocaleString();
  }, 1500);
})();

// Chart.js 主图表
const ctx = document.getElementById('main-chart').getContext('2d');
let currentType = 'line';
function genData(len=12, base=100, volatility=20){
  const arr = []; let val = base + Math.random()*20;
  for(let i=0;i<len;i++){ val += (Math.random()-0.5)*volatility; arr.push(Math.max(0, Math.round(val))); }
  return arr;
}
const labels = Array.from({length: 12}, (_,i)=>`T-${11-i}`);
const baseData = genData();
let chart = new Chart(ctx, {
  type: currentType,
  data: {
    labels,
    datasets: [{
      label: '访问量',
      data: baseData,
      borderColor: '#00eaff',
      backgroundColor: 'rgba(0,234,255,0.15)',
      borderWidth: 2,
      tension: 0.35,
      fill: true,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#7fa7ff' }, grid: { color: 'rgba(127,167,255,0.1)'} },
      y: { ticks: { color: '#7fa7ff' }, grid: { color: 'rgba(127,167,255,0.1)'}, beginAtZero: true }
    },
    plugins: {
      legend: { labels: { color: '#d7e3ff' } },
      tooltip: { backgroundColor: 'rgba(13,19,38,0.95)', titleColor: '#00eaff', bodyColor: '#d7e3ff', borderColor: 'rgba(127,167,255,0.3)', borderWidth: 1 }
    }
  }
});

// 切换图表类型
const buttons = document.querySelectorAll('.chart-btn');
buttons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const type = btn.dataset.chart;
    if(type !== currentType){
      currentType = type;
      const data = genData();
      chart.destroy();
      
      // 为不同图表类型创建不同的配置
      let chartConfig = {
        type: currentType,
        data: {
          labels,
          datasets: [{
            label: '访问量',
            data,
            borderColor: '#00eaff',
            backgroundColor: 'rgba(0,234,255,0.15)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#d7e3ff' } },
            tooltip: { 
              backgroundColor: 'rgba(13,19,38,0.95)', 
              titleColor: '#00eaff', 
              bodyColor: '#d7e3ff', 
              borderColor: 'rgba(127,167,255,0.3)', 
              borderWidth: 1 
            }
          }
        }
      };

      // 根据图表类型调整配置
      if (type === 'line') {
        chartConfig.data.datasets[0].tension = 0.35;
        chartConfig.data.datasets[0].fill = true;
        chartConfig.options.scales = {
          x: { ticks: { color: '#7fa7ff' }, grid: { color: 'rgba(127,167,255,0.1)'} },
          y: { ticks: { color: '#7fa7ff' }, grid: { color: 'rgba(127,167,255,0.1)'}, beginAtZero: true }
        };
      } else if (type === 'bar') {
        chartConfig.data.datasets[0].backgroundColor = 'rgba(0,234,255,0.6)';
        chartConfig.data.datasets[0].borderColor = '#00eaff';
        chartConfig.options.scales = {
          x: { ticks: { color: '#7fa7ff' }, grid: { color: 'rgba(127,167,255,0.1)'} },
          y: { ticks: { color: '#7fa7ff' }, grid: { color: 'rgba(127,167,255,0.1)'}, beginAtZero: true }
        };
      } else if (type === 'doughnut') {
        chartConfig.data.datasets[0].backgroundColor = [
          '#00eaff', '#7a5cff', '#ff00e6', '#00ff9c', '#ffb02e', '#ff4d6d',
          '#00d4ff', '#9d7cff', '#ff33ea', '#33ffaa', '#ffc04e', '#ff6d8d'
        ];
        chartConfig.data.datasets[0].borderColor = '#0d1326';
        chartConfig.data.datasets[0].borderWidth = 2;
        delete chartConfig.options.scales; // 饼图不需要坐标轴
      }
      
      chart = new Chart(ctx, chartConfig);
    }
  });
});

// 模拟关键指标数字滚动
function animateNumber(el, target, duration=800){
  const from = Number(String(el.textContent).replace(/[^\d.]/g,'')) || 0;
  const start = performance.now();
  const step = (now)=>{
    const p = Math.min(1, (now-start)/duration);
    const val = from + (target-from)*p;
    el.textContent = Number.isInteger(target) ? Math.round(val).toLocaleString() : `${val.toFixed(1)}%`;
    if(p<1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function randomizeMetrics(){
  animateNumber(document.getElementById('total-visits'), Math.floor(2400000 + Math.random()*120000));
  animateNumber(document.getElementById('active-users'), Math.floor(14000 + Math.random()*2000));
  const conv = 20 + Math.random()*10; // 20-30
  const convEl = document.getElementById('conversion-rate');
  convEl.textContent = `${conv.toFixed(1)}%`;
  const rt = 120 + Math.random()*80; // 120-200ms
  document.getElementById('response-time').textContent = `${Math.round(rt)}ms`;
}
setInterval(randomizeMetrics, 3000);
randomizeMetrics();

// 动态性能条
function randomizeBars(){
  document.querySelectorAll('.performance-metrics .metric').forEach((m)=>{
    const fill = m.querySelector('.metric-fill');
    const v = Math.floor(20 + Math.random()*70);
    fill.style.width = v + '%';
    const value = m.querySelector('.metric-value');
    if(value){ value.textContent = v + '%'; }
  });
}
setInterval(randomizeBars, 2500);
randomizeBars();

// 地图点信息轻微闪烁
setInterval(()=>{
  document.querySelectorAll('.map-point .point-info').forEach((el)=>{
    el.style.opacity = (0.8 + Math.random()*0.2).toString();
  })
}, 1200);

// 初始化 ECharts 世界地图
function initWorldMapECharts(){
  console.log('Initializing world map with ECharts...');
  
  const container = document.getElementById('world-geo');
  if (!container) {
    console.error('World geo container not found');
    return;
  }
  
  const fallbackImg = document.querySelector('.world-map img');
  if (!fallbackImg) {
    console.error('Fallback image not found');
    return;
  }

  if (typeof echarts === 'undefined') {
    console.error('ECharts library not loaded, showing fallback');
    fallbackImg.style.display = 'block';
    return;
  }

  console.log('ECharts library loaded successfully');
  const worldChart = echarts.init(container);
  
  // 内嵌的简化世界地图GeoJSON数据，确保服务器环境下也能正常加载
  const embeddedGeoData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "United States", "iso_a2": "US" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[-125, 50], [-125, 25], [-65, 25], [-65, 50], [-125, 50]]]
        }
      },
      {
        "type": "Feature", 
        "properties": { "name": "China", "iso_a2": "CN" },
        "geometry": {
          "type": "Polygon", 
          "coordinates": [[[75, 55], [135, 55], [135, 15], [75, 15], [75, 55]]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "United Kingdom", "iso_a2": "GB" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[-10, 60], [2, 60], [2, 50], [-10, 50], [-10, 60]]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Japan", "iso_a2": "JP" },
        "geometry": {
          "type": "Polygon", 
          "coordinates": [[[129, 46], [146, 46], [146, 30], [129, 30], [129, 46]]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Russia", "iso_a2": "RU" },
        "geometry": {
          "type": "Polygon", 
          "coordinates": [[[20, 80], [180, 80], [180, 50], [20, 50], [20, 80]]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Canada", "iso_a2": "CA" },
        "geometry": {
          "type": "Polygon", 
          "coordinates": [[[-140, 70], [-50, 70], [-50, 45], [-140, 45], [-140, 70]]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Brazil", "iso_a2": "BR" },
        "geometry": {
          "type": "Polygon", 
          "coordinates": [[[-75, 5], [-35, 5], [-35, -35], [-75, -35], [-75, 5]]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Australia", "iso_a2": "AU" },
        "geometry": {
          "type": "Polygon", 
          "coordinates": [[[110, -10], [155, -10], [155, -45], [110, -45], [110, -10]]]
        }
      }
    ]
  };

  const GEO_URLS = [
    'https://cdn.jsdelivr.net/npm/echarts/map/json/world.json',
    'https://fastly.jsdelivr.net/npm/echarts/map/json/world.json',
    'https://g.alicdn.com/datavis/echarts-assets/1.0.0/assets/geojson/world.json'
  ];

  async function tryFetchGeo(urls) {
    console.log('Trying to fetch external GeoJSON data...');
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`Trying to fetch from: ${url}`);
      try {
        const response = await fetch(url);
        console.log(`Fetch response status: ${response.status}`);
        if (response.ok) {
          const data = await response.json();
          console.log('External GeoJSON data fetched successfully');
          return data;
        }
      } catch (error) {
        console.error(`Failed to fetch from ${url}:`, error);
      }
    }
    console.log('All external sources failed, using embedded data');
    return embeddedGeoData;
  }

  tryFetchGeo(GEO_URLS).then(geoData => {
    console.log('Registering map with ECharts...');
    echarts.registerMap('world', geoData);
    
    const option = {
      backgroundColor: 'transparent',
      geo: {
        map: 'world',
        roam: false,
        itemStyle: {
          areaColor: 'rgba(0, 50, 100, 0.30)',
          borderColor: '#00eaff',
          borderWidth: 1.5,
          shadowBlur: 15,
          shadowColor: 'rgba(0, 234, 255, 0.5)'
        },
        emphasis: {
          itemStyle: { 
            areaColor: 'rgba(0, 234, 255, 0.35)',
            borderColor: '#00ffff',
            borderWidth: 2
          }
        }
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: 12,
          itemStyle: { 
            color: '#00eaff',
            shadowBlur: 20,
            shadowColor: 'rgba(0, 234, 255, 0.8)'
          },
          label: {
            show: true,
            position: 'top',
            color: '#d7e3ff',
            formatter: (p)=>{
              const name = p.name || '';
              const count = p.data.count || '';
              return `${name}\n${count}`;
            },
            backgroundColor: 'rgba(13,19,38,0.90)',
            borderColor: '#00eaff',
            borderWidth: 1,
            padding: [6, 8],
            borderRadius: 4,
            font: {
              size: 11,
              weight: 'bold'
            }
          },
          data: [
            { name: 'New York', value: [-74.0, 40.7], count: '2.1M' },
            { name: 'London', value: [0.1, 51.5], count: '1.8M' },
            { name: 'Beijing', value: [116.4, 39.9], count: '3.2M' },
            { name: 'Tokyo', value: [139.7, 35.7], count: '2.7M' }
          ]
        }
      ]
    };
    
    console.log('Setting chart options...');
    worldChart.setOption(option);
    console.log('World map initialized successfully');
  }).catch(error => {
    console.error('Error initializing world map:', error);
    // 即使出错也尝试使用内嵌数据
    console.log('Using embedded data as final fallback');
    echarts.registerMap('world', embeddedGeoData);
    const option = {
      backgroundColor: 'transparent',
      geo: {
        map: 'world',
        roam: false,
        itemStyle: {
          areaColor: 'rgba(0, 50, 100, 0.30)',
          borderColor: '#00eaff',
          borderWidth: 1.5,
          shadowBlur: 15,
          shadowColor: 'rgba(0, 234, 255, 0.5)'
        },
        emphasis: {
          itemStyle: { 
            areaColor: 'rgba(0, 234, 255, 0.35)',
            borderColor: '#00ffff',
            borderWidth: 2
          }
        }
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: 12,
          itemStyle: { 
            color: '#00eaff',
            shadowBlur: 20,
            shadowColor: 'rgba(0, 234, 255, 0.8)'
          },
          label: {
            show: true,
            position: 'top',
            color: '#d7e3ff',
            formatter: (p)=>{
              const name = p.name || '';
              const count = p.data.count || '';
              return `${name}\n${count}`;
            },
            backgroundColor: 'rgba(13,19,38,0.90)',
            borderColor: '#00eaff',
            borderWidth: 1,
            padding: [6, 8],
            borderRadius: 4,
            font: {
              size: 11,
              weight: 'bold'
            }
          },
          data: [
            { name: 'New York', value: [-74.0, 40.7], count: '2.1M' },
            { name: 'London', value: [0.1, 51.5], count: '1.8M' },
            { name: 'Beijing', value: [116.4, 39.9], count: '3.2M' },
            { name: 'Tokyo', value: [139.7, 35.7], count: '2.7M' }
          ]
        }
      ]
    };
    worldChart.setOption(option);
  });
}

document.addEventListener('DOMContentLoaded', initWorldMapECharts);