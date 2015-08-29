import test from 'tape'
import {is_string, is_function, is_number} from './utilities'

import {ABC, USAGE} from './abc'
import Scheme from './scheme'


test('should reject a spec without a class name', t => {
  t.throws(ABC, /Pass an ABC spec:[\.\n]+/);
  t.end()
});

test('should reject a spec with a non-standard class name', t => {
  for (let name of ['1', ' ', 'Example Name']) {
    t.throws(() => {
      ABC({name})
    }, new RegExp(`Expected ${name} to be pseudo-CamelCase\.+`));
  }
  for (let name of [null, undefined, {}]) {
    t.throws(() => {
      ABC({name})
    }, /Pass an ABC spec:[\.\n]+/);
  }
  t.end()
});

test('should reject a spec with no klass or proto objects', t => {
  let name = 'ExampleName';
  for (let spec of [{name}, {name, proto: []}, {name, klass: 1}]) {
    t.throws(() => {
      ABC(spec)
    }, /Pass an ABC spec:[\.\n]+/)
  }
  t.end()
});

test('should reject a spec with no klass or proto blueprints', t => {
  let name = 'ExampleName';
  let specs = [
    {
      name,
      proto: {}
    },
    {
      name,
      klass: {}
    },
    {
      name,
      proto: {blueprints: 1}
    },
    {
      name,
      klass: {blueprints: []}
    }
  ];
  for (let spec of specs) {
    t.throws(() => {
      ABC(spec)
    }, /Expected property 'blueprints' to be a non-empty Array/)
  }
  t.end()
});


const ExampleABC = (name = 'ExampleABC') => {
  return ABC({
    name,
    proto: {
      blueprints: Scheme.Blueprints(
        ['proto1', is_string],
        ['proto2', is_function]
      ),
      props: {
        proto1: 'proto1',
        proto2() {
          return 'proto2'
        }
      }
    },
    klass: {
      blueprints: Scheme.Blueprints(
        ['static1', is_number],
        ['static2', is_function]
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

test('should have the right name', t => {
  let ExampleName = ExampleABC('ExampleName');

  t.equals(ExampleName.name, 'ExampleName');
  t.end()
});

test('should throw an error when instantiated from the abstract base class', t => {
  let ABC = ExampleABC();

  t.throws(() => {
    new ABC()
  }, /Can't instantiate abstract class$/);
  t.end()
});

test("should throw an error when implementation doesn't implement all proto props", t => {
  let ABC = ExampleABC();

  t.throws(() => {
    class I extends ABC {
      get proto1() {
        return 'I_proto1';
      }
    }
    ABC.implemented_by(I);
  }, /'proto2' not found on target$/);
  t.end()
});

test("should throw an error when implementation doesn't implement all static props", t => {
  let ABC = ExampleABC();

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
    ABC.implemented_by(I);
  }, /'static1' not found on target$/);
  t.end()
});

test('should be implemented by a valid implementation', t => {
  let ABC = ExampleABC();
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
  t.end()
});

test('should allow an implementation to invoke a base abstract method', t => {
  let ABC = ExampleABC();
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

  ABC.implemented_by(I);

  let i = new I();

  // Test calling up to the base class
  t.equals(i.proto2(), 'proto2');
  t.equals(I.static1, 1001);

  // Test own properties
  t.equals(i.proto1, 'I_proto1');
  t.equals(I.static2(), 'I_static2');

  t.end()
});