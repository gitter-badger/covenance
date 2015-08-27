import test from 'tape'
import blueprint, {Blueprint} from './index'
import {is_type} from './utilities'


test('should enable blueprinting', t => {
  blueprint.enable();

  t.equals(typeof Function.prototype.blueprint_proto, 'function');
  t.equals(typeof Function.prototype.blueprint_static, 'function');
  t.end()
});

test('should throw when blueprinting without "blueprint" property', t => {
  class Example {}

  t.throws(() => {
    Example.blueprint_proto()
  }, /^TypeError: Expected property 'blueprint' to be an Array$/);
  t.throws(() => {
    Example.blueprint_static()
  }, /^TypeError: Expected property 'blueprint' to be an Array$/);
  t.end()
});

test('should throw when blueprinting with wrongly typed "blueprint"', t => {
  class E {
    get blueprint() {
      return ['blueprint_proto'];
    }

    static get blueprint() {
      return ['blueprint_static'];
    }
  }

  t.throws(() => {
    E.blueprint_proto()
  }, /^TypeError: Expected element 'blueprint_proto' of 'blueprint' to be a Blueprint$/);
  t.throws(() => {
    E.blueprint_static()
  }, /^TypeError: Expected element 'blueprint_static' of 'blueprint' to be a Blueprint$/);
  t.end()
});

test('should check proto blueprint', t => {
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.check_blueprint()
    }

    get blueprint() {
      return [
        Blueprint('x', is_type('number')),
        Blueprint('y', is_type('number'))
      ]
    }
  }
  Point.blueprint_proto();

  t.throws(() => {
    new Point(1, 'string')
  }, /^TypeError: 'y': 'string' failed blueprint check$/);
  t.end()
});

test('should check static blueprint', t => {
  class Example {
    static get blueprint() {
      return [Blueprint('shortname', is_type('string'))]
    }
  }
  Example.blueprint_static();

  t.throws(() => {
    Example.shortname = true;
    Example.check_blueprint()
  }, /^TypeError: 'shortname': 'true' failed blueprint check$/);
  t.throws(() => {
    delete Example.shortname;
    Example.check_blueprint()
  }, /^TypeError: 'shortname': 'undefined' failed blueprint check$/);
  t.end()
});

test('should support a before_blueprint hook on static blueprint', t => {
  class Example {}

  t.doesNotThrow(() => {
    // won't complain about missing "blueprint" property, as above.
    // this isn't a recommended use case for this hook.
    Example.blueprint_static({
      before_blueprint() {
        this.blueprint = [Blueprint('shortname', is_type('string'))];
      }
    });
  });
  t.end()
});

test('should support a before_blueprint hook on proto blueprint', t => {
  class Example {}

  t.doesNotThrow(() => {
    // won't complain about missing "blueprint" property, as above.
    // this isn't a recommended use case for this hook.
    Example.blueprint_proto({
      before_blueprint() {
        this.blueprint = [Blueprint('shortname', is_type('string'))];
      }
    });
  });
  t.end()
});

test('should support "before blueprint check" hook on static blueprint', t => {
  class Example {
    static get blueprint() {
      return [Blueprint('shortname', is_type('string'))]
    }

    static before_check_blueprint() {
      this.shortname = 'name'
    }
  }
  Example.blueprint_static({before_check_blueprint: true});

  t.doesNotThrow(() => { Example.check_blueprint() });
  t.equals(Example.shortname, 'name');
  t.end()
});

test('should support "before blueprint check" hook on proto blueprint', t => {
  class Example {
    get blueprint() {
      return [Blueprint('shortname', is_type('string'))];
    }

    before_check_blueprint() {
      this.shortname = 'name'
    }
  }
  Example.blueprint_proto({before_check_blueprint: true});

  let e = new Example();

  t.doesNotThrow(() => {
    e.check_blueprint()
  });
  t.equals(e.shortname, 'name');
  t.end()
});

test('should support "after blueprint check" hook on static blueprint', t => {
  class Example {
    static after_check_blueprint() {
      this._shortname = 'after_name'
    }

    static get shortname() {
      return this._shortname
    }
    static set shortname(shortname) {
      this._shortname = shortname
    }

    static get blueprint() {
      return [Blueprint('shortname', is_type('string'))];
    }
  }
  Example.blueprint_static({after_check_blueprint: true});
  Example.shortname = 'before_name'

  t.doesNotThrow(() => { Example.check_blueprint() });
  t.equals(Example.shortname, 'after_name');
  t.end()
});

test('should support "after blueprint check" hook on proto blueprint', t => {
  class Example {
    after_check_blueprint() {
      this._shortname = 'after_name'
    }

    get blueprint() {
      return [Blueprint('shortname', is_type('string'))];
    }

    get shortname() {
      return this._shortname
    }
    set shortname(shortname) {
      this._shortname = shortname
    }
  }
  Example.blueprint_proto({after_check_blueprint: true});

  let e = new Example();
  e.shortname = 'before_name';

  t.doesNotThrow(() => { e.check_blueprint() });
  t.equals(e.shortname, 'after_name');
  t.end()
});