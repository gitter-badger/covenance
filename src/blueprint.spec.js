import test from 'tape'
import blueprint, {blueprinted, Scheme} from './blueprint'
import {is_type} from './utilities'

test('should enable blueprinting', t => {
  t.notOk(Function.prototype.blueprint_proto);
  t.notOk(Function.prototype.blueprint_static);

  t.ok(blueprint.enable());

  t.equals(typeof Function.prototype.blueprint_proto, 'function');
  t.equals(typeof Function.prototype.blueprint_static, 'function');
  t.end()
});

test('should enable blueprinting once', t => {
  t.notOk(blueprint.enable());
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
  class E {}

  E.prototype.blueprint = ['proto_blueprint'];
  E.blueprint = ['static_blueprint'];

  t.throws(() => {
    E.blueprint_proto()
  }, /^TypeError: Expected element 'proto_blueprint' of 'blueprint' to be a Scheme$/);
  t.throws(() => {
    E.blueprint_static()
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
  Point.blueprint_proto();

  t.throws(() => {
    new Point(1, 'string')
  }, /^TypeError: 'y': 'string' failed blueprint check$/);
  t.end()
});

test('should check static blueprint', t => {
  class A {}
  A.blueprint = [
    Scheme({attribute: 'shortname', predicate: is_type('string')})
  ];
  A.blueprint_static();

  t.throws(() => {
    A.shortname = true;
    A.check_blueprint()
  }, /^TypeError: 'shortname': 'true' failed blueprint check$/);
  t.throws(() => {
    delete A.shortname;
    A.check_blueprint()
  }, /^TypeError: 'shortname': 'undefined' failed blueprint check$/);
  t.end()
});

test.skip('should support before_blueprint and after_blueprint hooks', t => {
});