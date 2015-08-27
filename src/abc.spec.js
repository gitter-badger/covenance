import test from 'tape'
import {is_type} from './utilities'

import ABC from './abc'
import blueprint from './blueprint'


const make_ABC = () => {
  return ABC.make({
    name: 'ABC',
    proto: {
      blueprints: blueprint.Blueprints(
        ['proto1', is_type('string')],
        ['proto2', is_type('function')]
      ),
      props: {
        proto1: 'proto1',
        proto2() {
          return 'proto2'
        }
      }
    },
    klass: {
      blueprints: blueprint.Blueprints(
        ['static1', is_type('number')],
        ['static2', is_type('function')]
      ),
      props: {
        static1: 1,
        static2() {
          throw new Error('static2 not implemented')
        }
      }
    }
  });
};

test('should copy name into toString()', t => {
  let ABC = make_ABC();

  t.equals(ABC.toString(), 'ABC');
  t.end()
});

test('should throw an error when instantiated directly', t => {
  let ABC = make_ABC();

  t.throws(() => {
    new ABC()
  }, /Can't instantiate abstract class$/);
  t.end()
});

test('should throw an error when implementation does not implement all props', t => {
  let ABC = make_ABC();

  t.throws(() => {
    class I {
      get proto1() {
        return 'I_proto1';
      }
    }
    ABC.implemented_by(I)
  }, /'proto2': 'undefined' failed blueprint check$/);

  t.throws(() => {
    class I {
      get proto1() {
        return 'I_proto1';
      }
      proto2() {}

      static static2() {
        return 'I_static2'
      }
    }
    ABC.implemented_by(I)
  }, /'static1': 'undefined' failed blueprint check$/);
  t.end()
});
//
//test('should allow an implementation to invoke a base abstract method', t => {
//  let ABC = make_ABC();
//  class Triangle {
//    get color() {
//      return `${super.color} triangle`
//    }
//
//    area() {
//      return super.area() + 1
//    }
//  }
//  ABC.implemented_by(Triangle);
//
//  let triangle = new Triangle();
//
//  t.equals(triangle.area(), 1001);
//  t.end()
//});
//
//test.skip('should allow an implementation to invoke a base abstract property', t => {
//  let ABC = make_ABC();
//  class Triangle {
//    get color() {
//      return `${super.color} + triangle`
//    }
//
//    area() {}
//  }
//  ABC.implemented_by(Triangle);
//
//  t.equals(new Triangle().color, 'black + triangle');
//  t.end()
//});

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