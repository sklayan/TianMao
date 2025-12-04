import { DataStream } from './data/DataStream.js';
import { MapComponent } from './components/Map.js';
import { LeftPanel } from './components/LeftPanel.js';
import { RightPanel } from './components/RightPanel.js';
import { BottomPanel } from './components/BottomPanel.js';

// Initialize Data Stream
const dataStream = new DataStream();

// Initialize Components
const map = new MapComponent('map-container', dataStream);
const leftPanel = new LeftPanel('left-panel', dataStream);
const rightPanel = new RightPanel('right-panel', dataStream);
const bottomPanel = new BottomPanel('bottom-panel', dataStream);

// Start Data Stream
dataStream.start();

console.log('Dashboard Initialized');
