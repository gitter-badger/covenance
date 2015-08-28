import test from 'tape'
import blueprint from './blueprint'
import {is_string, is_number, is_function} from './utilities'


test('should throw when blueprinting a non-function', t => {
  for (let target of [1, {}, 'string', false, null, undefined]) {
    t.throws(() => {
      blueprint.execute_on(target)
    }, /Expected function type to blueprint/)
  }
  t.end()
});

test('should throw when blueprinting without `blueprints` property', t => {
  class Example {}

  t.throws(() => {
    blueprint.execute_on(Example)
  }, /Found no static or prototype blueprints.$/);
  t.end()
});

test('should throw when blueprinting with wrongly typed `blueprints`', t => {

  t.throws(() => {
    class Example {
      get blueprints() {
        return [{}];
      }
    }
    blueprint.execute_on(Example)
  }, /^TypeError: Expected element '\[object Object]' of 'blueprints' to be a Scheme/);
  t.throws(() => {
    class Example {
      static get blueprints() {
        return [1];
      }
    }
    blueprint.execute_on(Example)
  }, /^TypeError: Expected element '1' of 'blueprints' to be a Scheme/);
  t.end()
});

test('should check the prototype blueprints', t => {
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.blueprint_check()
    }

    get blueprints() {
      return blueprint.Blueprints(
        ['x', is_number],
        ['y', is_number]
      )
    }
  }
  blueprint.execute_on(Point);

  t.throws(() => {
    new Point(1, 'string')
  }, /^TypeError: 'y': 'string' failed blueprint check$/);
  t.end()
});

test('should check the static blueprints', t => {
  class Example {
    static get blueprints() {
      return blueprint.Blueprints(['foo', is_type_of('string')])
    }
  }
  blueprint.execute_on(Example);

  t.throws(() => {
    Example.foo = true;
    Example.blueprint_check()
  }, /^TypeError: 'foo': 'true' failed blueprint check$/);
  t.throws(() => {
    delete Example.foo;
    Example.blueprint_check()
  }, /^TypeError: 'foo': 'undefined' failed blueprint check$/);
  t.end()
});

test('should support a before_blueprint hook on static blueprints', t => {
  class Example {
    static get blueprints() {
      return blueprint.Blueprints(['foo', is_type_of('string')])
    }
  }

  t.throws(() => {
    blueprint.execute_on(Example, {
      before_blueprint() {
        delete this.blueprints
      }
    });
  }, /Expected property 'blueprints' to be an Array$/);
  t.end()
});

test('should support a before_blueprint hook on proto blueprints', t => {
  class Example {
    get blueprints() {
      return blueprint.Blueprints(['foo', is_string])
    }
  }

  t.throws(() => {
    blueprint.execute_on(Example, {
      before_blueprint() {
        delete this.blueprints
      }
    })
  }, /Expected property 'blueprints' to be an Array$/);
  t.end()
});

test('should support "before blueprint check" hook on static blueprints', t => {
  class Example {
    static get blueprints() {
      return blueprint.Blueprints(['foo', is_string])
    }
  }
  blueprint.execute_on(Example, {
    before_blueprint_check() {
      this.foo = 'name'
    }
  });

  t.doesNotThrow(() => {
    Example.blueprint_check()
  });
  t.equals(Example.foo, 'name');
  t.end()
});

test('should support "before blueprint check" hook on proto blueprints', t => {
  class Example {
    get blueprints() {
      return blueprint.Blueprints(['foo', is_string])
    }
  }
  blueprint.execute_on(Example, {
    before_blueprint_check() {
      // 'this' is the prototype; see:
      //
      //    https://github.com/yangmillstheory/mixin.a.lot#-mix-options--mixin-method-hooks
      this.foo = 'name'
    }
  });

  let foo = new Example();

  t.doesNotThrow(() => {
    foo.blueprint_check()
  });
  t.equals(foo.foo, 'name');
  t.end()
});

test('should support "after blueprint check" hook on static blueprints', t => {
  class Example {
    static get blueprints() {
      return blueprint.Blueprints(['foo', is_string])
    }
  }
  blueprint.execute_on(Example, {
    after_blueprint_check() {
      this.foo = 'after_foo'
    }
  });
  Example.foo = 'before_foo';
  Example.blueprint_check();

  t.equals(Example.foo, 'after_foo');
  t.end()
});

test('should support "after blueprint check" hook on proto blueprints', t => {
  class Example {
    get blueprints() {
      return blueprint.Blueprints(['foo', is_string])
    }
  }
  blueprint.execute_on(Example, {
    after_blueprint_check(instance) {
      // You can use the instance, or 'this', which is Example.prototype.
      instance.foo = 'after_foo'
    }
  });

  let f = new Example();
  f.foo ='before_foo';

  f.blueprint_check();

  t.equals(f.foo, 'after_foo');
  t.end()
});


test('should work with a mix of proto and static blueprints', t => {
  class Example {
    get blueprints() {
      return blueprint.Blueprints(
        ['proto_foo1', is_string],
        ['proto_foo2', is_number]
      )
    }

    static get blueprints() {
      return blueprint.Blueprints(
        ['static_foo1', is_string],
        ['static_foo2', is_number]
      )
    }
  }

  let f = new Example();

  blueprint.execute_on(Example, {
    after_blueprint_check(instance) {
      if (instance === Example) {
        this.static_foo1 = 'you win!'
      } else {
        instance.proto_foo1 = 'you win!'
      }
    }
  });

  t.throws(() => {
    Example.static_foo1 = 'string';
    Example.static_foo2 = 'string';

    f.proto_foo1 = 'string';
    f.proto_foo2 = 1;

    Example.blueprint_check()
  }, /^TypeError: 'static_foo2': 'string' failed blueprint check$/);

  t.throws(() => {
    Example.static_foo1 = 'string';
    Example.static_foo2 = 1;

    f.proto_foo1 = [];
    f.proto_foo2 = 1;

    f.blueprint_check()
  }, /^TypeError: 'proto_foo1': .+ failed blueprint check$/);

  Example.static_foo1 = 'string';
  Example.static_foo2 = 2;

  f.proto_foo1 = 'string';
  f.proto_foo2 = 1;

  t.doesNotThrow(() => {
    f.blueprint_check();
    Example.blueprint_check();
  });

  t.equals(f.proto_foo1, 'you win!');
  t.equals(Example.static_foo1, 'you win!');
  t.end()
});