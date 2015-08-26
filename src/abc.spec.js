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
    get color() {
      return `${super.color} triangle`;
    }
  }

  t.throws(() => {
    Polygon.register(Triangle)
  }, /'area': 'undefined' failed blueprint check$/);

  class Square {
    area() {
      return 1
    }
  }

  t.throws(() => {
    Polygon.register(Square)
  }, /'color': 'undefined' failed blueprint check$/);
  t.end()
});

test('should allow an implementation to invoke a base abstract method', t => {
  let Polygon = make_polygon_ABC();
  class Triangle {
    get color() {
      return `${super.color} triangle`
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
    get color() {
      return `${super.color} + triangle`
    }

    area() {}
  }
  Polygon.register(Triangle);

  t.equals(new Triangle().color, 'black + triangle');
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