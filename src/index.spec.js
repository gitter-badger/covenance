import test from 'tape'
import blueprint, {Blueprints, Blueprint} from './index'
import {is_type} from './utilities'


test('should enable blueprinting', t => {
  blueprint.enable();

  t.equals(typeof Function.prototype.blueprint, 'function');
  t.end()
});

test('should throw when blueprinting without "blueprint" property', t => {
  class Foo {}

  t.throws(() => {
    Foo.blueprint()
  }, /Found no static or prototype blueprints.$/);
  t.end()
});

test('should throw when blueprinting with wrongly typed "blueprint"', t => {

  t.throws(() => {
    class E {
      get blueprints() {
        return [{}];
      }
    }
    E.blueprint()
  }, /^TypeError: Expected element '\[object Object]' of 'blueprints' to be a Blueprint$/);
  t.throws(() => {
    class E {
      static get blueprints() {
        return [1];
      }
    }
    E.blueprint()
  }, /^TypeError: Expected element '1' of 'blueprints' to be a Blueprint$/);
  t.end()
});

test('should check proto blueprint', t => {
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.blueprint_check()
    }

    get blueprints() {
      return Blueprints(['x', is_type('number')], ['y', is_type('number')])
    }
  }
  Point.blueprint();

  t.throws(() => {
    new Point(1, 'string')
  }, /^TypeError: 'y': 'string' failed blueprint check$/);
  t.end()
});

test('should check static blueprint', t => {
  class Foo {
    static get blueprints() {
      return [Blueprint('foo', is_type('string'))]
    }
  }
  Foo.blueprint();

  t.throws(() => {
    Foo.foo = true;
    Foo.blueprint_check()
  }, /^TypeError: 'foo': 'true' failed blueprint check$/);
  t.throws(() => {
    delete Foo.foo;
    Foo.blueprint_check()
  }, /^TypeError: 'foo': 'undefined' failed blueprint check$/);
  t.end()
});

test('should support a before_blueprint hook on static blueprints', t => {
  class Foo {
    static get blueprints() {
      return [Blueprint('foo', is_type('string'))]
    }
  }

  t.throws(() => {
    Foo.blueprint({
      before_blueprint() {
        delete this.blueprints
      }
    });
  }, /Expected property 'blueprints' to be an Array$/);
  t.end()
});

test('should support a before_blueprint hook on proto blueprints', t => {
  class Foo {
    get blueprints() {
      return [Blueprint('foo', is_type('string'))]
    }
  }

  t.throws(() => {
    Foo.blueprint({
      before_blueprint() {
        delete this.blueprints
      }
    })
  }, /Expected property 'blueprints' to be an Array$/);
  t.end()
});

test('should support "before blueprint check" hook on static blueprints', t => {
  class Foo {
    static get blueprints() {
      return [Blueprint('foo', is_type('string'))]
    }
  }
  Foo.blueprint({
    before_blueprint_check() {
      this.foo = 'name'
    }
  });

  t.doesNotThrow(() => {
    Foo.blueprint_check()
  });
  t.equals(Foo.foo, 'name');
  t.end()
});

test('should support "before blueprint check" hook on proto blueprints', t => {
  class Foo {
    get blueprints() {
      return [Blueprint('foo', is_type('string'))];
    }
  }
  Foo.blueprint({
    before_blueprint_check() {
      // 'this' is the prototype; see:
      //
      //    https://github.com/yangmillstheory/mixin.a.lot#-mix-options--mixin-method-hooks
      this.foo = 'name'
    }
  });

  let foo = new Foo();

  t.doesNotThrow(() => {
    foo.blueprint_check()
  });
  t.equals(foo.foo, 'name');
  t.end()
});

test('should support "after blueprint check" hook on static blueprints', t => {
  class Foo {
    static get blueprints() {
      return [Blueprint('foo', is_type('string'))];
    }
  }
  Foo.blueprint({
    after_blueprint_check() {
      this.foo = 'after_foo'
    }
  });
  Foo.foo = 'before_foo';
  Foo.blueprint_check();

  t.equals(Foo.foo, 'after_foo');
  t.end()
});

test('should support "after blueprint check" hook on proto blueprints', t => {
  class Foo {
    get blueprints() {
      return [Blueprint('foo', is_type('string'))];
    }
  }
  Foo.blueprint({
    after_blueprint_check(instance) {
      // You can use the instance, or 'this', which is Foo.prototype.
      instance.foo = 'after_foo'
    }
  });

  let f = new Foo();
  f.foo ='before_foo';

  f.blueprint_check();

  t.equals(f.foo, 'after_foo');
  t.end()
});


test('should work with a mix of proto and static blueprints', t => {
  class Foo {
    get blueprints() {
      return Blueprints(
        ['proto_foo1', is_type('string')],
        ['proto_foo2', is_type('number')]
      )
    }

    static get blueprints() {
      return Blueprints(
        ['static_foo1', is_type('string')],
        ['static_foo2', is_type('number')]
      )
    }
  }

  let f = new Foo();

  Foo.blueprint({
    after_blueprint_check(instance) {
      if (instance === Foo) {
        this.static_foo1 = 'you win!'
      } else {
        instance.proto_foo1 = 'you win!'
      }
    }
  });

  t.throws(() => {
    Foo.static_foo1 = 'string';
    Foo.static_foo2 = 'string';

    f.proto_foo1 = 'string';
    f.proto_foo2 = 1;

    Foo.blueprint_check()
  }, /^TypeError: 'static_foo2': 'string' failed blueprint check$/);

  t.throws(() => {
    Foo.static_foo1 = 'string';
    Foo.static_foo2 = 1;

    f.proto_foo1 = [];
    f.proto_foo2 = 1;

    f.blueprint_check()
  }, /^TypeError: 'proto_foo1': .+ failed blueprint check$/);

  Foo.static_foo1 = 'string';
  Foo.static_foo2 = 2;

  f.proto_foo1 = 'string';
  f.proto_foo2 = 1;

  t.doesNotThrow(() => {
    f.blueprint_check();
    Foo.blueprint_check();
  });

  t.equals(f.proto_foo1, 'you win!');
  t.equals(Foo.static_foo1, 'you win!');
  t.end()
});