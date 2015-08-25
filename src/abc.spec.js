import test from 'tape'
import {is_type} from './utilities'

import ABC from './abc'
import blueprint from './blueprint'


const make_polygon_ABC = () => {
  return ABC.make({
    name: 'Polygon',
    proto: {
      blueprint: blueprint.Blueprints(
        ['sides', is_type('number')],
        ['area', is_type('function')]
      ),
      props: {
        sides: NaN,
        area() {
          return Number.NEGATIVE_INFINITY;
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

  t.ok(isNaN(Polygon.prototype.sides));
  t.equals(Polygon.prototype.area(), Number.NEGATIVE_INFINITY);
  t.end()
});
//
//test.skip('should throw an error when implementation has no blueprint', t => {
//
//});
//
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