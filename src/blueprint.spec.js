import test from 'tape'
import {blueprint} from './blueprint'
import {is_string} from './utilities'


test('should throw when creating with wrong signature', t => {
  t.throws(() => {
    blueprint.Blueprints()
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.throws(() => {
    blueprint.Blueprints(1, 2, 3)
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.end()
});

test('should not throw when creating with right signature', t => {
  t.doesNotThrow(() => {
    blueprint.Blueprints({attribute: 'string', predicate: () => {}})
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.doesNotThrow(() => {
    blueprint.Blueprints(['string', () => {}])
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.end()
});

test('should create Blueprints with positional tuples', t => {
  let bs = blueprint.Blueprints(
    ['blueprint1', () => {}],
    ['blueprint2', () => {}]
  );

  t.ok(Array.isArray(bs));
  t.equals(bs.length, 2);

  for (let bp of bs) {
    t.ok(blueprint.is(bp))
  }
  t.end()
});

test('should create Blueprints with positional objects', t => {
  let bs = blueprint.Blueprints(
    {attribute: 'blueprint1', predicate: () => {}},
    {attribute: 'blueprint2', predicate: () => {}}
  );

  t.ok(Array.isArray(bs));
  t.equals(bs.length, 2);

  for (let bp of bs) {
    t.ok(blueprint.is(bp))
  }
  t.end()
});

test('should create Blueprints with mixed positional arguments', t => {
  let bs = blueprint.Blueprints(
    ['blueprint1', () => {}],
    {attribute: 'blueprint2', predicate: () => {}}
  );

  t.ok(Array.isArray(bs));
  t.equals(bs.length, 2);

  for (let bp of bs) {
    t.ok(blueprint.is(bp))
  }
  t.end()
});

test('should return an immutable Array', t => {
  let bs = blueprint.Blueprints(
    ['blueprint1', () => {}],
    {attribute: 'blueprint2', predicate: () => {}}
  );

  bs.push(0); // in the Chrome runtime, this will throw

  t.equals(bs.length, 2);
  t.end()
});

test('should throw when creating with wrong types', t => {
  t.throws(() => {
    blueprint.Blueprints([{attribute: 1, predicate: () => {}}])
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    blueprint.Blueprints([{attribute: 'string', predicate: []}])
  }, new RegExp(`Expected ${[]} to be a function`));
  t.throws(() => {
    blueprint.Blueprints([1, () => {}])
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    blueprint.Blueprints(['string', []])
  }, new RegExp(`Expected ${[]} to be a function`));
  t.end();
});

test('should read properties', t => {
  let [attribute, predicate] = ['foo', is_string];
  let [bp]= blueprint.Blueprints([{attribute, predicate}]);

  t.equals(bp.attribute, attribute);
  t.equals(bp.predicate, predicate);
  t.end()
});

test('should not set properties again', t => {
  let [bp] = blueprint.Blueprints([{attribute: 'foo', predicate: () => {}}]);

  t.throws(() => {
    bp.attribute = 'bar'
  }, /attribute is immutable/);
  t.throws(() => {
    bp.predicate = () => {}
  }, /predicate is immutable/);
  t.end()
});