import test from 'tape'
import {covenance} from './covenance'
import {is_string, is_number, is_function} from './utilities'


test('should throw when covenanting a non-function', t => {
  for (let target of [1, {}, 'string', false, null, undefined]) {
    t.throws(() => {
      covenance.covenant(target)
    }, /Expected function type to covenant/)
  }
  t.end()
});

test('should throw when covenanting without covenants', t => {
  class Example {}

  t.throws(() => {
    covenance.covenant(Example)
  }, /Found no static or prototype covenance.$/);
  t.end()
});

  test('should throw when covenanting with empty covenants', t => {
    t.throws(() => {
      class Example {
        get covenance() {
          return []
        }
      }
      covenance.covenant(Example)
    }, /Expected property 'covenance' to be a non-empty Array$/);
    t.throws(() => {
      class Example {
        static get covenance() {
          return []
        }
      }
      covenance.covenant(Example)
    }, /Expected property 'covenance' to be a non-empty Array$/);
    t.end()
});

test('should throw when covenanting with wrongly typed covenants', t => {
  t.throws(() => {
    class Example {
      get covenance() {
        return [{}];
      }
    }
    covenance.covenant(Example)
  }, /^TypeError: Expected element '\[object Object]' of 'covenance' to be a Covenant/);
  t.throws(() => {
    class Example {
      static get covenance() {
        return [1];
      }
    }
    covenance.covenant(Example)
  }, /^TypeError: Expected element '1' of 'covenance' to be a Covenant/);
  t.end()
});

test('should add a covenant checking method on the prototype', t => {
  class Example {
    get covenance() {
      return covenance.of(['example', is_string])
    }
  }
  covenance.covenant(Example);

  t.ok(is_function(Example.prototype.check_covenants));
  t.end()
});

test('should add a covenant checking method on the class', t => {
  class Example {
    static get covenance() {
      return covenance.of(['example', is_string])
    }
  }

  covenance.covenant(Example);

  t.ok(is_function(Example.check_covenants));
  t.end()
});

test('should check instance covenants', t => {
  class Point {
    get covenance() {
      return covenance.of(
        ['x', is_number],
        ['y', is_number]
      )
    }

    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.check_covenants()
    }
  }
  covenance.covenant(Point);

  t.throws(() => {
    new Point(1, 'string')
  }, /^TypeError: 'y': 'string' failed covenant check$/);
  t.end()
});

test('should check static covenants', t => {
  class Example {
    static get covenance() {
      return covenance.of(['foo', is_string])
    }
  }
  covenance.covenant(Example);

  t.throws(() => {
    Example.check_covenants()
  }, /^TypeError: 'foo': 'undefined' failed covenant check$/);
  t.throws(() => {
    Example.foo = true;
    Example.check_covenants()
  }, /^TypeError: 'foo': 'true' failed covenant check$/);
  t.end()
});

test('should accept a pre_covenant hook on static covenants', t => {
  t.plan(2);
  class Example {
    static get covenance() {
      return covenance.of(['foo', is_string])
    }
  }

  t.throws(() => {
    covenance.covenant(Example, {
      pre_covenant() {
        t.is(this, Example);
        delete this.covenance
      }
    });
  }, /Expected property 'covenance' to be a non-empty Array$/);
});

test('should accept a pre_covenant hook on proto covenants', t => {
  t.plan(2);
  class Example {
    get covenance() {
      return covenance.of(['foo', is_string])
    }
  }

  t.throws(() => {
    covenance.covenant(Example, {
      pre_covenant() {
        t.is(this, Example.prototype);
        delete this.covenance
      }
    })
  }, /Expected property 'covenance' to be a non-empty Array$/);
});

test('should accept a post_covenant hook on static covenants', t => {
  t.plan(2);
  class Example {
    static get covenance() {
      return covenance.of(['foo', is_string])
    }
  }

  t.throws(() => {
    covenance.covenant(Example, {
      post_covenant() {
        t.is(this, Example);
        this.check_covenants();
      }
    });
  }, /'foo': 'undefined' failed covenant check$/);
});

test('should accept a post_covenant hook on proto covenants', t => {
  t.plan(2);
  class Example {
    get covenance() {
      return covenance.of(['foo', is_string])
    }
  }

  t.throws(() => {
    covenance.covenant(Example, {
      post_covenant() {
        t.is(this, Example.prototype);
        this.check_covenants()
      }
    })
  }, /'foo': 'undefined' failed covenant check$/);
});

test('should accept a "pre_check_covenants" hook on static covenants', t => {
  class Example {
    static get covenance() {
      return covenance.of(['foo', is_string])
    }
  }
  covenance.covenant(Example, {
    pre_check_covenants() {
      t.is(this, Example);
      this.foo = 'name'
    }
  });

  t.doesNotThrow(() => {
    Example.check_covenants()
  });
  t.equals(Example.foo, 'name');
  t.end()
});

test('should accept a "pre_check_covenants" hook on proto covenants', t => {
  class Example {
    get covenance() {
      return covenance.of(['foo', is_string])
    }
  }
  covenance.covenant(Example, {
    pre_check_covenants() {
      t.is(this, Example.prototype);
      this.foo = 'foo'
    }
  });

  let e = new Example();

  t.doesNotThrow(() => {
    // won't throw, defines 'foo' on the prototype first
    e.check_covenants()
  });
  t.equals(Example.prototype.foo, 'foo');
  t.end()
});

test('should accept an "post_check_covenants" hook on static covenants', t => {
  class Example {
    static get covenance() {
      return covenance.of(['foo', is_string])
    }
  }
  covenance.covenant(Example, {
    post_check_covenants(klass) {
      t.is(klass, Example);
      t.is(this, Example);
      this.foo = 'after_foo'
    }
  });
  Example.foo = 'before_foo';
  Example.check_covenants();

  t.equals(Example.foo, 'after_foo');
  t.end()
});


test('should accept an "post_check_covenants" hook on prototype covenants', t => {
  class Example {
    get covenance() {
      return covenance.of(['foo', is_string])
    }
  }
  let e = new Example();
  e.foo ='before_foo';

  covenance.covenant(Example, {
    post_check_covenants(instance) {
      t.is(instance, e);
      t.is(this, Example.prototype);
      instance.foo = 'after_foo'
    }
  });

  e.check_covenants();

  t.equals(e.foo, 'after_foo');
  t.notok(Example.prototype.foo); // was set on the instance
  t.end()
});


test('should work with a mix of prototype and static covenants', t => {
  class Example {
    get covenance() {
      return covenance.of(
        ['proto_foo1', is_string],
        ['proto_foo2', is_number]
      )
    }

    static get covenance() {
      return covenance.of(
        ['static_foo1', is_string],
        ['static_foo2', is_number]
      )
    }
  }

  let e = new Example();

  covenance.covenant(Example, {
    post_check_covenants(thing) {
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

    Example.check_covenants()
  }, /^TypeError: 'static_foo2': 'string' failed covenant check$/);

  t.throws(() => {
    Example.static_foo1 = 'string';
    Example.static_foo2 = 1;

    e.proto_foo1 = [];
    e.proto_foo2 = 1;

    e.check_covenants()
  }, /^TypeError: 'proto_foo1': .+ failed covenant check$/);


  // now conform the specified covenants

  Example.static_foo1 = 'string';
  Example.static_foo2 = 2;

  e.proto_foo1 = 'string';
  e.proto_foo2 = 1;

  t.doesNotThrow(() => {
    e.check_covenants();
    Example.check_covenants();
  });

  t.equals(e.proto_foo1, 'you win!');
  t.equals(Example.static_foo1, 'you win!');
  t.end()
});