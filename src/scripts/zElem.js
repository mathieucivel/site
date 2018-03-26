'use strict';

const zBox = require('./zBox');
const getBoundingClientRect = require('./getBoundingClientRect');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULTS = {
  fogStart: -1000,

  fogEnd: -2000,

  hideStart: 500,

  hideEnd: 800,

  //event callbacks
  onClick: () => null,
  onMouseEnter: () => null,
  onMouseLeave: () => null,
  onFrontHide: () => null
};

/**
 * Compose zBox factory to add Z interactions to a DOM Element
 * @param  {Element} [_element] DOM Element
 * @return {Object}
 */
const makeZElem = (_element, _options) => {
  let zElem = Object.assign(
    {el: _element},
    zBox(getBoundingClientRect(_element)),
    DEFAULTS,
    _options
  );

  zElem.el.addEventListener('click', e => {
    e.zElem = zElem;
    zElem.onClick.call(this, e);
  });

  zElem.el.addEventListener('mouseenter', e => {
    e.zElem = zElem;
    zElem.onMouseEnter.call(this, e);
  });

  zElem.el.addEventListener('mouseleave', e => {
    e.zElem = zElem;
    zElem.onMouseLeave.call(this, e);
  });

  zElem.animate = ({x = 0, y = 0, z = 0}, _ms = 200) => {
    zElem.tx += x;
    zElem.ty += y;
    zElem.tz += z;
    zElem.el.style.transition = `transform ${_ms}ms ease`;
    zElem.el.style.transform = zElem.getCssTransform();
    delay(_ms).then(() => {
      zElem.el.style.transition = '';
      zElem.draw();
    });
  };

  zElem.draw = () => {
    zElem.el.style.transform = zElem.getCssTransform();

    //front hiding
    if (zElem.tz > zElem.hideStart) {
      const opacity = (zElem.hideEnd - zElem.tz) / (zElem.tz - zElem.hideStart);
      zElem.el.style.opacity = opacity;
      zElem.el.style['pointer-events'] = opacity <= 0.02 ? 'none' : 'all';
    } else if (zElem.tz < zElem.fogStart) {
      //back hiding
      const opacity = (zElem.fogEnd - zElem.tz) / (zElem.tz - zElem.fogStart);
      zElem.el.style.opacity = opacity;
    } else {
      zElem.el.style.opacity = 1;
    }

    zElem.hidden = zElem.el.style.opacity < 0.05;
  };

  zElem.reset = () => {
    Object.assign(zElem, getBoundingClientRect(zElem.el));
    zElem.tx = 0;
    zElem.ty = 0;
    zElem.tz = 0;
  };

  return zElem;
};

module.exports = makeZElem;
