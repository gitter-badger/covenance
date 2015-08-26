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
          return 1000
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
  class Triangle {
    constructor(color) {
      this._color = color
    }

    get color() {
      return `${this._color} triangle`;
    }
  }

  t.throws(() => {
    Polygon.register(Triangle)
  }, /'area': 'undefined' failed blueprint check$/);
  t.end()
});

test('should allow an implementation to invoke a base abstract method', t => {
  let Polygon = make_polygon_ABC();
  class Triangle {
    set color(color) {
      this._color = color
    }
    get color() {
      return `${this._color} triangle`
    }

    area() {
      return super.area() + 1
    }
  }
  Polygon.register(Triangle);

  let triangle = new Triangle();

  t.equals(triangle.area(), 1001);
  t.end()
});

test('should allow an implementation to invoke a base abstract property', t => {
  let Polygon = make_polygon_ABC();
  class Triangle {
    set color(color) {
      this._color = color
    }
    get color() {
      return `${super.color} + ${this._color}`
    }

    area() {}
  }
  Polygon.register(Triangle);

  let triangle = new Triangle(2, 2);
  triangle.color = 'blue';

  t.equals(triangle.color, 'black + blue');
  t.end()
});

test.skip('should throw an error when implementation does not satisfy blueprint', t => {

});
//
//test.skip('should expose abstract methods to implementations', t => {
//
//});
//
//test.skip('should allow implementations to override abstract methods', t => {
//
//});