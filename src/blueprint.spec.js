import test from 'tape'
import blueprint, {blueprinted, Scheme} from './blueprint'


blueprint.enable();

test('should throw when blueprinting without "blueprints" property', t => {
  class Foo {}
  t.ok(Foo instanceof Function, 'Foo is a function');
  t.ok(Function.prototype.hasOwnProperty('proto_mix'), 'Function:: has proto_mix');
  t.ok(Foo.proto_mix !== undefined, 'Foo has proto_mix');

  t.throws(() => {
    class Foo {}
    Foo.blueprint_proto()
  }, /Expected property 'blueprint' to be an Array/);
  t.end()
});
