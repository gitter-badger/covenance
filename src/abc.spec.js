import test from 'tape'
import {is_type} from './utilities'

import ABC from './abc'
import blueprint from './blueprint'


const make_polygon_ABC = () => {
  return ABC.make({
    name: 'Polygon',
    proto: {
      blueprint: blueprint.Blueprints(
        ['color', is_type('string')],
        ['area', is_type('function')]
      ),
      props: {
        color: null,
        area() {
          throw new Error('area() not implemented');
        }
      }
    }
  });
};

test('should copy name into toString()', t => {
  let Polygon = make_polygon_ABC();

  t.equals(Polygon.toString(), 'Polygon');
  t.end()
});

test('should throw an error when instantiated directly', t => {
  let Polygon = make_polygon_ABC();

  t.throws(() => {
    new Polygon()
  }, /Can't instantiate abstract class$/);
  t.end()
});

test('should copy proto props to the base class', t => {
  let Polygon = make_polygon_ABC();

  t.equals(Polygon.prototype.color, null);
  t.throws(Polygon.prototype.area, /area\(\) not implemented$/);
  t.end()
});

test('should throw an error when implementation does not implement all props', t => {
  let Polygon = make_polygon_ABC();
  class Triangle {}
  Triangle.prototype.color = 'blue';

  t.throws(() => {
    Polygon.register(Triangle)
  }, /'area': 'undefined' failed blueprint check$/);
  t.end()
});

//test.skip('should throw an error when implementation does not satisfy blueprint', t => {
//
//});
//
//test.skip('should expose abstract methods to implementations', t => {
//
//});
//
//test.skip('should allow implementations to override abstract methods', t => {
//
//});