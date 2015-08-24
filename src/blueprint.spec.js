import test from 'tape'
import blueprint, {blueprinted, Scheme} from './blueprint'
import {is_type} from './utilities'

test('should enable blueprinting', t => {
  t.notOk(Function.prototype.proto_blueprint);
  t.notOk(Function.prototype.static_blueprint);

  t.ok(blueprint.enable());

  t.equals(typeof Function.prototype.proto_blueprint, 'function');
  t.equals(typeof Function.prototype.static_blueprint, 'function');
  t.end()
});

test('should enable blueprinting once', t => {
  t.notOk(blueprint.enable());
  t.end()
});

test('should throw when blueprinting without "blueprint" property', t => {
  class Example {}

  t.throws(() => {
    Example.proto_blueprint()
  }, /^TypeError: Expected property 'blueprint' to be an Array$/);
  t.throws(() => {
    Example.static_blueprint()
  }, /^TypeError: Expected property 'blueprint' to be an Array$/);
  t.end()
});

test('should throw when blueprinting with wrongly typed "blueprint"', t => {
  class E {}

  E.prototype.blueprint = ['proto_blueprint'];
  E.blueprint = ['static_blueprint'];

  t.throws(() => {
    E.proto_blueprint()
  }, /^TypeError: Expected element 'proto_blueprint' of 'blueprint' to be a Scheme$/);
  t.throws(() => {
    E.static_blueprint()
  }, /^TypeError: Expected element 'static_blueprint' of 'blueprint' to be a Scheme$/);
  t.end()
});

test('should check proto blueprint', t => {
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.check_blueprint()
    }
  }
  Point.prototype.blueprint = [
    Scheme({attribute: 'x', predicate: is_type('number')}),
    Scheme({attribute: 'y', predicate: is_type('number')})
  ];
  Point.proto_blueprint();

  t.throws(() => {
    new Point(1, 'string')
  }, /^TypeError: 'y': 'string' failed blueprint check$/);
  t.end()
});

test('should check static blueprint', t => {
  class Example {}
  Example.blueprint = [
    Scheme({attribute: 'shortname', predicate: is_type('string')})
  ];
  Example.static_blueprint();

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
  Example.blueprint = [
    Scheme({attribute: 'shortname', predicate: is_type('string')})
  ];

  t.doesNotThrow(() => {
    Example.static_blueprint({
      before_blueprint() {
        this.shortname = 'example'
      }
    });
  });
  t.equals(Example.shortname, 'example');
  t.end()
});

test('should support a before_blueprint hook on proto blueprint', t => {
  class Example {}
  Example.prototype.blueprint = [
    Scheme({attribute: 'shortname', predicate: is_type('string')})
  ];

  t.doesNotThrow(() => {
    Example.proto_blueprint({
      before_blueprint() {
        this.shortname = 'example'
      }
    });
  });
  t.equals(Example.prototype.shortname, 'example');
  t.end()
});

test.skip('should support before_check_hook option', t => {
});

test.skip('should support after_check_hook option', t => {
});