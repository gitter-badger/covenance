import test from 'tape'
import {blueprints} from './blueprints'
import {is_string, is_number, is_function} from './utilities'


test('should throw when blueprinting a non-function', t => {
  for (let target of [1, {}, 'string', false, null, undefined]) {
    t.throws(() => {
      blueprints.execute(target)
    }, /Expected function type to blueprint/)
  }
  t.end()
});

test('should throw when blueprinting without blueprints', t => {
  class Example {}

  t.throws(() => {
    blueprints.execute(Example)
  }, /Found no static or prototype blueprints.$/);
  t.end()
});

test('should throw when blueprinting with empty blueprints', t => {
  t.throws(() => {
    class Example {
      get blueprints() {
        return []
      }
    }
    blueprints.execute(Example)
  }, /Expected property 'blueprints' to be a non-empty Array$/);
  t.throws(() => {
    class Example {
      static get blueprints() {
        return []
      }
    }
    blueprints.execute(Example)
  }, /Expected property 'blueprints' to be a non-empty Array$/);
  t.end()
});

test('should throw when blueprinting with wrongly typed prototype blueprints', t => {
  t.throws(() => {
    class Example {
      get blueprints() {
        return [{}];
      }
    }
    blueprints.execute(Example)
  }, /^TypeError: Expected element '\[object Object]' of 'blueprints' to be a Blueprint/);
  t.end()
});

test('should throw when blueprinting with wrongly typed static blueprints', t => {
  t.throws(() => {
    class Example {
      static get blueprints() {
        return [1];
      }
    }
    blueprints.execute(Example)
  }, /^TypeError: Expected element '1' of 'blueprints' to be a Blueprint/);
  t.end()
});


test('should add a blueprint checking method on the prototype', t => {
  class Example {
    get blueprints() {
      return blueprints.create(['example', is_string])
    }

    get example() {
      return 'example'
    }
  }
  blueprints.execute(Example);

  t.ok(is_function(Example.prototype.ok_blueprints));
  t.end()
});

test('should add a blueprint checking method on the class', t => {
  class Example {
    static get blueprints() {
      return blueprints.create(['example', is_string])
    }

    static get example() {
      return 'example'
    }
  }

  blueprints.execute(Example);

  t.ok(is_function(Example.ok_blueprints));
  t.end()
});

test('should check instance blueprints', t => {
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.ok_blueprints()
    }

    get blueprints() {
      return blueprints.create(
        ['x', is_number],
        ['y', is_number]
      )
    }
  }
  blueprints.execute(Point);

  t.throws(() => {
    new Point(1, 'string')
  }, /^TypeError: 'y': 'string' failed blueprint check$/);
  t.end()
});

test('should check static blueprints', t => {
  class Example {
    static get blueprints() {
      return blueprints.create(['foo', is_string])
    }
  }
  blueprints.execute(Example);

  t.throws(() => {
    Example.foo = true;
    Example.ok_blueprints()
  }, /^TypeError: 'foo': 'true' failed blueprint check$/);
  t.throws(() => {
    delete Example.foo;
    Example.ok_blueprints()
  }, /^TypeError: 'foo': 'undefined' failed blueprint check$/);
  t.end()
});

test('should support a before_blueprint hook on static blueprints', t => {
  class Example {
    static get blueprints() {
      return blueprints.create(['foo', is_string])
    }
  }

  t.throws(() => {
    blueprints.execute(Example, {
      before_blueprint() {
        t.is(this, Example);
        delete this.blueprints
      }
    });
  }, /Expected property 'blueprints' to be a non-empty Array$/);
  t.end()
});

test('should support a before_blueprint hook on proto blueprints', t => {
  class Example {
    get blueprints() {
      return blueprints.create(['foo', is_string])
    }
  }

  t.throws(() => {
    blueprints.execute(Example, {
      before_blueprint() {
        t.is(this, Example.prototype);
        delete this.blueprints
      }
    })
  }, /Expected property 'blueprints' to be a non-empty Array$/);
  t.end()
});

test('should allow a "before ok_blueprint" hook on static blueprints', t => {
  class Example {
    static get blueprints() {
      return blueprints.create(['foo', is_string])
    }
  }
  blueprints.execute(Example, {
    before_ok_blueprints() {
      t.is(this, Example);
      this.foo = 'name'
    }
  });

  t.doesNotThrow(() => {
    Example.ok_blueprints()
  });
  t.equals(Example.foo, 'name');
  t.end()
});

test('should allow a "before ok_blueprint" hook on proto blueprints', t => {
  class Example {
    get blueprints() {
      return blueprints.create(['foo', is_string])
    }
  }
  blueprints.execute(Example, {
    before_ok_blueprints() {
      t.is(this, Example.prototype);
      this.foo = 'foo'
    }
  });

  let e = new Example();

  t.doesNotThrow(() => {
    // won't throw, since 'foo' is now defined on the prototype
    e.ok_blueprints()
  });
  t.equals(Example.prototype.foo, 'foo');
  t.end()
});

test('should allow an "after ok_blueprint" hook on static blueprints', t => {
  class Example {
    static get blueprints() {
      return blueprints.create(['foo', is_string])
    }
  }
  blueprints.execute(Example, {
    after_ok_blueprints(klass) {
      t.is(klass, Example);
      t.is(this, Example);
      this.foo = 'after_foo'
    }
  });
  Example.foo = 'before_foo';
  Example.ok_blueprints();

  t.equals(Example.foo, 'after_foo');
  t.end()
});


test('should allow an "after ok_blueprint" hook on prototype blueprints', t => {
  class Example {
    get blueprints() {
      return blueprints.create(['foo', is_string])
    }
  }
  let e = new Example();
  e.foo ='before_foo';

  blueprints.execute(Example, {
    after_ok_blueprints(instance) {
      t.is(instance, e);
      t.is(this, Example.prototype);
      instance.foo = 'after_foo'
    }
  });

  e.ok_blueprints();

  t.equals(e.foo, 'after_foo');
  t.notok(Example.prototype.foo); // was set on the instance
  t.end()
});


test('should work with a mix of prototype and static blueprints', t => {
  class Example {
    get blueprints() {
      return blueprints.create(
        ['proto_foo1', is_string],
        ['proto_foo2', is_number]
      )
    }

    static get blueprints() {
      return blueprints.create(
        ['static_foo1', is_string],
        ['static_foo2', is_number]
      )
    }
  }

  let e = new Example();

  blueprints.execute(Example, {
    after_ok_blueprints(thing) {
      if (thing === Example) {
        this.static_foo1 = 'you win!'
      } else if (thing === e) {
        thing.proto_foo1 = 'you win!'
      }
    }
  });

  t.throws(() => {
    Example.static_foo1 = 'string';
    Example.static_foo2 = 'string';

    e.proto_foo1 = 'string';
    e.proto_foo2 = 1;

    Example.ok_blueprints()
  }, /^TypeError: 'static_foo2': 'string' failed blueprint check$/);

  t.throws(() => {
    Example.static_foo1 = 'string';
    Example.static_foo2 = 1;

    e.proto_foo1 = [];
    e.proto_foo2 = 1;

    e.ok_blueprints()
  }, /^TypeError: 'proto_foo1': .+ failed blueprint check$/);


  // now conform the specified blueprints

  Example.static_foo1 = 'string';
  Example.static_foo2 = 2;

  e.proto_foo1 = 'string';
  e.proto_foo2 = 1;

  t.doesNotThrow(() => {
    e.ok_blueprints();
    Example.ok_blueprints();
  });

  t.equals(e.proto_foo1, 'you win!');
  t.equals(Example.static_foo1, 'you win!');
  t.end()
});