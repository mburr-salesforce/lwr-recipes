import { copyFileSync } from 'fs';
import { log } from 'console';

// Copy the Chart.js script to the assets dir
copyFileSync('../../node_modules/chart.js/dist/chart.min.js', 'src/assets/chart.min.js');
log('>> done copying the Chart.js resources');
