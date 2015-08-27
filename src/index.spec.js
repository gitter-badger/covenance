import test from 'tape'
import blueprint, {Blueprint} from './index'
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
      return [
        Blueprint('x', is_type('number')),
        Blueprint('y', is_type('number'))
      ]
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
      return [Blueprint('foo', is_type('string'))];
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

    static before_blueprint_check() {
      this.foo = 'name'
    }
  }
  Foo.blueprint({before_blueprint_check: true});

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

    before_blueprint_check() {
      this.foo = 'name'
    }
  }
  Foo.blueprint({before_blueprint_check: true});

  let e = new Foo();

  t.doesNotThrow(() => {
    e.blueprint_check()
  });
  t.equals(e.foo, 'name');
  t.end()
});

test('should support "after blueprint check" hook on static blueprints', t => {
  class Foo {
    static after_blueprint_check() {
      this.foo = 'after_foo'
    }

    static get foo() {
      return this.__foo__
    }
    static set foo(foo) {
      this.__foo__ = foo
    }

    static get blueprints() {
      return [Blueprint('foo', is_type('string'))];
    }
  }
  Foo.blueprint({after_blueprint_check: true});
  Foo.foo = 'before_foo';
  Foo.blueprint_check();

  t.equals(Foo.foo, 'after_foo');
  t.end()
});

test('should support "after blueprint check" hook on proto blueprints', t => {
  class Foo {
    after_blueprint_check() {
      this.foo = 'after_foo'
    }

    get blueprints() {
      return [Blueprint('foo', is_type('string'))];
    }

    get foo() {
      return this.__foo__
    }
    set foo(foo) {
      this.__foo__ = foo
    }
  }
  Foo.blueprint({after_blueprint_check: true});

  let e = new Foo();
  e.foo = 'before_foo';
  e.blueprint_check();

  t.equals(e.foo, 'after_foo');
  t.end()
});