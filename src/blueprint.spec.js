import test from 'tape'
import {blueprint as bp} from './blueprint'
import {is_string} from './utilities'


test('should throw when creating with wrong spec', t => {
  t.throws(() => {
    bp.Blueprints()
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.throws(() => {
    bp.Blueprints(1, 2, 3)
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.end()
});

test('should not throw when creating with right spec', t => {
  t.doesNotThrow(() => {
    bp.Blueprints({attribute: 'string', predicate: () => {}})
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.doesNotThrow(() => {
    bp.Blueprints(['string', () => {}])
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.end()
});

test('should create Blueprints with positional tuples', t => {
  let blueprints = bp.Blueprints(
    ['blueprint1', () => {}],
    ['blueprint2', () => {}]
  );

  t.ok(Array.isArray(blueprints));
  t.equals(blueprints.length, 2);

  for (let blueprint of blueprints) {
    t.ok(bp.is(blueprint))
  }
  t.end()
});

test('should create Blueprints with positional objects', t => {
  let blueprints = bp.Blueprints(
    {attribute: 'blueprint1', predicate: () => {}},
    {attribute: 'blueprint2', predicate: () => {}}
  );

  t.ok(Array.isArray(blueprints));
  t.equals(blueprints.length, 2);

  for (let blueprint of blueprints) {
    t.ok(bp.is(blueprint))
  }
  t.end()
});

test('should create Blueprints with mixed positional arguments', t => {
  let blueprints = bp.Blueprints(
    ['blueprint1', () => {}],
    {attribute: 'blueprint2', predicate: () => {}}
  );

  t.ok(Array.isArray(blueprints));
  t.equals(blueprints.length, 2);

  for (let blueprint of blueprints) {
    t.ok(bp.is(blueprint))
  }
  t.end()
});

test('should return an immutable Array', t => {
  let blueprints = bp.Blueprints(
    ['blueprint1', () => {}],
    {attribute: 'blueprint2', predicate: () => {}}
  );

  blueprints.push(0); // in the Chrome runtime, this will throw

  t.equals(blueprints.length, 2);
  t.end()
});

test('should throw when creating with wrong types', t => {
  t.throws(() => {
    bp.Blueprints([{attribute: 1, predicate: () => {}}])
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    bp.Blueprints([{attribute: 'string', predicate: []}])
  }, new RegExp(`Expected ${[]} to be a function`));
  t.throws(() => {
    bp.Blueprints([1, () => {}])
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    bp.Blueprints(['string', []])
  }, new RegExp(`Expected ${[]} to be a function`));
  t.end();
});

test('should read properties', t => {
  let [attribute, predicate] = ['foo', is_string];
  let [blueprint]= bp.Blueprints([{attribute, predicate}]);

  t.equals(blueprint.attribute, attribute);
  t.equals(blueprint.predicate, predicate);
  t.end()
});

test('should not set properties again', t => {
  let [blueprint] = bp.Blueprints([{attribute: 'foo', predicate: () => {}}]);

  t.throws(() => {
    blueprint.attribute = 'bar'
  }, /attribute is immutable/);
  t.throws(() => {
    blueprint.predicate = () => {}
  }, /predicate is immutable/);
  t.end()
});