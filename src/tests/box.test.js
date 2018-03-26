const makeBox = require('../scripts/box');

test('box center at origin', () => {
  const actual = makeBox({width: 100, height: 200}).getCenter();
  const expected = {x: 50, y: 100};
  expect(actual).toEqual(expected);
});

test('box center', () => {
  const box = {x: 20, y: 60, width: 100, height: 200};
  const actual = makeBox().getCenter.call(box);
  const expected = {x: 70, y: 160};
  expect(actual).toEqual(expected);
});

test('box place at center', () => {
  let box = {width: 100, height: 100};
  const container = {x: 20, y: 60, width: 400, height: 800};
  const expected = {x: 170, y: 410, width: 100, height: 100};
  makeBox().placeAtCenter.call(box, container);
  expect(box).toEqual(expected);
});

test('box css move to', () => {
  const box = {x: 100, y: 150};
  const target = {x: 20, y: 60, z: -200};
  const result = makeBox().cssMoveTo.call(box, target);
  const expected = 'translate3d(-80px, -90px, -200px)';
  expect(result).toEqual(expected);
});
