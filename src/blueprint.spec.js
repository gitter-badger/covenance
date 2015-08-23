import test from 'tape'
import blueprint, {blueprinted, Scheme} from './blueprint'


blueprint.enable();

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
