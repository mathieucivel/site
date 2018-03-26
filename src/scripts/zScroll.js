'use strict';

const zElem = require('./zElem');
const zBox = require('./zBox');

const DEFAULT = {
  element: null,

  zOffset: 600,

  scrollMin: -1700,

  scrollMax: 2600,

  elem_options: {
    fogStart: -800,
    fogEnd: -2000,
    hideStart: 400,
    hideEnd: 800
  }
};

/**
 * Module to hook global Y scroll and apply
 * Z transform to children of an element
 * @param  {Object} [_options={}] options
 * @return {Object}               module object
 */
const zScroll = (_options = {}) => {
  //the factorized object
  let module = Object.assign({}, DEFAULT, _options);

  //current global Z position
  let zPos = 0;

  //current Z delta to apply
  let zDelta = 0;

  //Z constraints
  let zMax = module.scrollMax;
  let zMin = module.scrollMin;

  //animation frame request ID
  let afid = null;

  let initialized = false;
  let started = false;

  //whell event callback
  const onWheel = e => {
    zPos += e.deltaY;
    zDelta += e.deltaY;
    if (zPos > zMax) {
      zDelta += zMax - zPos;
      zPos = zMax;
    } else if (zPos < zMin) {
      zDelta += zMin - zPos;
      zPos = zMin;
    }
  };

  //main step, called each frame
  const step = () => {
    if (zDelta) {
      module.zElems.forEach(_zElem => {
        _zElem.tz += zDelta;
        if (_zElem.tz < 500 && _zElem.tz > 0) {
          module.showDescription(_zElem);
        }
        _zElem.draw();
      });
    }
    zDelta = 0;
    afid = window.requestAnimationFrame(step);
  };

  module.init = () => {
    if (initialized) return;
    module.$children = Array.from(module.element.children);
    module.zElems = module.$children.map(el => zElem(el, module.elem_options));

    //initial position of children
    // - translate to the center of their container
    // - apply a Z offset
    // - add hover and click events
    module.zElems.forEach((_zElem, i) => {
      _zElem.placeAtCenter(module.element.getBoundingClientRect().toJSON());
      _zElem.tz -= module.zOffset * i;
      _zElem.draw();

      //on click, move element to the front (and push/pull other)
      _zElem.onClick = function(e) {
        const delta = e.zElem.hideStart - e.zElem.tz;
        zPos += delta;
        module.zElems.forEach(zElem => zElem.animate({z: delta}));
        module.showDescription(e.zElem);
      };

      //TODO on hover, move the element up
      _zElem.onMouseEnter = function(e) {};
      _zElem.onMouseLeave = function(e) {};
    });

    initialized = true;
  };

  module.showDescription = _zElem => {
    const desc = _zElem.el.querySelector('.description').cloneNode(true);
    let container = document.getElementById('descriptions');
    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(desc);
    container.style.opacity = 1;
    return module;
  };

  module.hideDescription = () => {
    document.getElementById('descriptions').style.opacity = 0;
  };

  module.start = () => {
    if (started || !initialized) return;
    document.addEventListener('wheel', onWheel);
    afid = window.requestAnimationFrame(step);
    started = true;
    return module;
  };

  module.stop = () => {
    if (!started || !initialized) return;
    window.cancelAnimationFrame(afid);
    document.removeEventListener('wheel', onWheel);
    started = false;
    return module;
  };

  module.clean = () => {
    if (!initialized) return;
    module.zElems.forEach(_zElem => {
      _zElem.el.style.transform = '';
      _zElem.el.style.opacity = 1;
    });
  };

  module.reinit = () => {
    if (!initialized) return;
    module.zElems.forEach((_zElem, i) => {
      _zElem.reset();
      _zElem.placeAtCenter(module.element.getBoundingClientRect().toJSON());
      _zElem.tz -= module.zOffset * i;
      _zElem.draw();
    });
  };

  return module;
};

module.exports = zScroll;
