import test from 'tape'
import {is_type} from './utilities'

import {ABC} from './abc'
import blueprint from './blueprint'


const make_ABC = () => {
  return ABC({
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

test('should allow an implementation to invoke a base abstract method', t => {
  let ABC = make_ABC();
  class I extends ABC {
    get proto1() {
      return 'I_proto1'
    }
    proto2() {
      return super.proto2()
    }
    static get static1() {
      return super.static1 + 1000
    }
    static static2() {
      return 'I_static2'
    }
  }

  t.doesNotThrow(() => {
    ABC.implemented_by(I);
  });

  let i = new I();

  // Test calling up to the base class
  t.equals(i.proto2(), 'proto2');
  t.equals(I.static1, 1001);

  // Test own properties
  t.equals(i.proto1, 'I_proto1');
  t.equals(I.static2(), 'I_static2');

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