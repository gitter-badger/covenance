import test from 'tape'
import {is_string, is_function, is_number} from './utilities'

import {ABC, ABCMeta} from './abc'
import {blueprints} from './blueprints'


test('should reject a spec without a class name', t => {
  t.throws(ABC, /Pass a valid ABC spec:[\.\n]+/);
  t.end()
});

test('should reject a spec with a non-standard class name', t => {
  for (let name of ['1', ' ', 'Example Name']) {
    t.throws(() => {
      ABC({name})
    }, new RegExp(`Expected ${name} to be pseudo-CamelCase\.+`));
  }
  for (let name of [null, undefined, {}, []]) {
    t.throws(() => {
      ABC({name})
    }, /Pass a valid ABC spec:[\.\n]+/);
  }
  t.end()
});

test('should reject a spec with no klass or proto objects', t => {
  let name = 'ExampleName';
  for (let spec of [{name}, {name, proto: []}, {name, klass: 1}]) {
    t.throws(() => {
      ABC(spec)
    }, /Pass a valid ABC spec:[\.\n]+/)
  }
  t.end()
});

test('should reject a spec with invalid klass or proto blueprints', t => {
  let name = 'ExampleName';
  let specs = [
    { // no blueprints at all
      name,
      proto: {}
    },
    { // null blueprints on klass, none on proto
      name,
      proto: {
        props: {
          foo: 1
        }
      },
      klass: {blueprints: null}
    },
    { // invalid blueprints on proto, none on klass
      name,
      proto: {blueprints: 1}
    },
    { // null blueprints on klass, none on proto
      name,
      klass: {blueprints: []}
    }
  ];
  for (let spec of specs) {
    t.throws(() => {
      ABC(spec)
    }, /Pass a valid ABC spec:[\.\n]+/)
  }
  t.end()
});

test('should accept a spec with at least one valid blueprint', t => {
  let spec = {
    name: 'ExampleName',
    proto: {
      props: {
        foo: 1
      }
    },
    klass: {
      blueprints: blueprints.create(['attribute', is_string])
    }
  };
  t.doesNotThrow(() => {
    ABC(spec)
  });
  t.end()
});


// Creates an Example ABC with:
//
//  - two proto specs with two abstract implementations
//  - two class specs with one abstract implementation
//
const ExampleABC = (name = 'ExampleABC') => {
  return ABC({
    name,
    proto: {
      blueprints: blueprints.create(
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
      blueprints: blueprints.create(
        ['static1', is_number],
        ['static2', is_function]
      ),
      props: {
        static1: 999
      }
    }
  });
};

test('should not be instantiable', t => {
  let ABC = ExampleABC();

  t.throws(() => {
    new ABC()
  }, /Can't instantiate abstract class$/);
  t.end()
});

test('should have the right name', t => {
  let ExampleName = ExampleABC('ExampleName');

  t.equals(ExampleName.name, 'ExampleName');
  t.end()
});

test('should be an instanceof ABCMeta', t => {
  t.ok(ExampleABC().prototype instanceof ABCMeta);
  t.end()
});

test('should not be implemented_by a non-function', t => {
  let ABC = ExampleABC();
  t.throws(() => {
    ABC.implemented_by(1)
  }, /Abstract classes can only be implemented by functions$/);
  t.end()
});

test('should not be implemented_by a non-subclass', t => {
  let ABC = ExampleABC();
  class NotASubclass {}
  t.throws(() => {
    ABC.implemented_by(NotASubclass)
  }, new RegExp(`${NotASubclass.name} is not a subclass of ${ABC.name}`));
  t.end()
});

test("should throw when implementation doesn't implement all proto blueprints", t => {
  let ABC = ExampleABC();

  t.throws(() => {
    class I extends ABC {
      get proto1() {
        return 'I_proto1';
      }
    }
    ABC.implemented_by(I);
  }, /Expected 'proto2' to be own property on target$/);
  t.end()
});

test("should throw when implementation doesn't implement all static blueprints", t => {
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
  }, /Expected 'static1' to be own property on target$/);
  t.end()
});

test('should be implemented_by a valid implementation', t => {
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

test('should allow an implementation to invoke base abstract methods/properties', t => {
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
  t.equals(I.static1, 1999);

  // Test own properties
  t.equals(i.proto1, 'I_proto1');
  t.equals(I.static2(), 'I_static2');

  t.end()
});