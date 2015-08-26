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
        color: 'black',
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

test('should throw an error when implementation does not implement all props', t => {
  let Polygon = make_polygon_ABC();
  class Triangle {}
  Triangle.prototype.color = 'blue';

  t.throws(() => {
    Polygon.register(Triangle)
  }, /'area': 'undefined' failed blueprint check$/);
  t.end()
});

test('should allow an implementation to invoke a base abstract method', t => {
  let Polygon = make_polygon_ABC();
  class Triangle {
    constructor(base, height) {
      this.base = base;
      this.height = height;
    }
  }
  Triangle.prototype.color = 'blue';
  Triangle.prototype.area = function() {
    return this.base * this.height * 0.5;
  };
  Polygon.register(Triangle);

  let triangle = new Triangle(2, 2);

  t.throws(triangle.area(), 2);
  t.end()
});
//
//test.skip('should expose abstract methods to implementations', t => {
//
//});
//
//test.skip('should allow implementations to override abstract methods', t => {
//
//});