require('./styles/main.css');

const debounce = require('debounce');
const zScroll = require('./scripts/zScroll');

const BREAK_WIDTH = 960;

let videoZScroll;

document.addEventListener('scroll', () => {
  window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  videoZScroll = zScroll({element: document.getElementById('portfolio')});
  //window.videoZScroll = videoZScroll;
  if (window.innerWidth > BREAK_WIDTH) {
    videoZScroll.init();
    videoZScroll.start();
  }
});

const onResize = _event => {
  if (window.innerWidth <= BREAK_WIDTH) {
    videoZScroll.stop();
    videoZScroll.clean();
  } else {
    videoZScroll.init();
    videoZScroll.clean();
    videoZScroll.reinit();
    videoZScroll.start();
  }
};

window.addEventListener('resize', debounce(onResize, 200));
