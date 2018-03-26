'use strict';

const DEFAULT = {
  // distance from left (origin of x position)
  left: 0,

  // distance from top (origin of y position)
  top: 0,

  //box width
  width: 0,

  //bow height
  height: 0,

  //current translation
  tx: 0,
  ty: 0,
  tz: 0
};

/**
 * Abstract Box factory with Z coordinate
 * @param  {Object} [box={}] Input object to be augmented
 * @return {Object}          Augmented object with box capabilities
 */
const zBox = (_box = {}) => ({
  ...DEFAULT,
  ..._box,

  /**
   * Return the center of this box
   * @return {Object} Coordinate in the form {x, y}
   */
  getCenter() {
    return {
      x: this.left + (this.tx || 0) + this.width / 2,
      y: this.top + (this.ty || 0) + this.height / 2
    };
  },

  /**
   * Place this box in the center of another box
   * @param  {Box} _box  A box
   * @return {Box}      This box
   */
  placeAtCenter(_box) {
    const current = zBox(this);
    const target = zBox(_box);
    const center_current = current.getCenter();
    const center_target = target.getCenter();
    this.tx += center_target.x - center_current.x;
    this.ty += center_target.y - center_current.y;
    return this;
  },

  /**
   * Return a CSS translate string corresponding to the current position
   * @return {String}   A CSS3 translate3d string
   */
  getCssTransform() {
    return `translate3d(${this.tx}px, ${this.ty}px, ${this.tz}px)`;
  }
});

module.exports = zBox;
