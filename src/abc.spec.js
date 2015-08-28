import test from 'tape'
import {is_type} from './utilities'

import {ABC} from './abc'
import scheme from './scheme'


const make_ABC = () => {
  return ABC({
    name: 'ABC',
    proto: {
      blueprints: scheme.Blueprints(
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
      blueprints: scheme.Blueprints(
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

test("should throw an error when implementation doesn't implement all proto props", t => {
  let ABC = make_ABC();

  t.throws(() => {
    class I extends ABC {
      get proto1() {
        return 'I_proto1';
      }
    }
    ABC.register(I)
  }, /'proto2': 'undefined' failed blueprint check$/);
  t.end()
});

test("should throw an error when implementation doesn't implement all static props", t => {
  let ABC = make_ABC();

  t.throws(() => {
    class I extends ABC {
      get proto1() {
        return 'I_proto1';
      }
      proto2() {}

      static static2() {
        return 'I_static2'
      }
    }
    ABC.register(I)
  }, /'static1': 'undefined' failed blueprint check$/);
  t.end()
});

test('should register a valid implementation', t => {
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
    ABC.register(I)
  });
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

  ABC.register(I)

  let i = new I();

  // Test calling up to the base class
  t.equals(i.proto2(), 'proto2');
  t.equals(I.static1, 1001);

  // Test own properties
  t.equals(i.proto1, 'I_proto1');
  t.equals(I.static2(), 'I_static2');

  t.end()
});