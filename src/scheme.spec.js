import test from 'tape'
import Scheme from './scheme'
import {is_type} from './utilities'


test('should throw when creating with wrong signature', t => {
  t.throws(() => {
    Scheme.of()
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.throws(() => {
    Scheme.of(1, 2, 3)
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.end()
});

test('should not throw when creating with right signature', t => {
  t.doesNotThrow(() => {
    Scheme.of({attribute: 'string', predicate: () => {}})
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.doesNotThrow(() => {
    Scheme.of('string', () => {})
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.end()
});

test('should create many Blueprints with positional tuple arguments', t => {
  let blueprints = Scheme.Blueprints(
    ['blueprint1', () => {}],
    ['blueprint2', () => {}]
  );

  t.ok(Array.isArray(blueprints));
  for (let scheme of blueprints) {
    t.ok(Scheme.is(scheme))
  }
  t.end()
});

test('should create many Blueprints with positional object arguments', t => {
  let blueprints = Scheme.Blueprints(
    {attribute: 'blueprint1', predicate: () => {}},
    {attribute: 'blueprint2', predicate: () => {}}
  );

  t.ok(Array.isArray(blueprints));
  for (let scheme of blueprints) {
    t.ok(Scheme.is(scheme))
  }
  t.end()
});

test('should create many Blueprints with mixed positional arguments', t => {
  let blueprints = Scheme.Blueprints(
    ['blueprint1', () => {}],
    {attribute: 'blueprint2', predicate: () => {}}
  );

  t.ok(Array.isArray(blueprints));
  for (let scheme of blueprints) {
    t.ok(Scheme.is(scheme))
  }
  t.end()
});

test('should throw when creating with wrong types', t => {
  t.throws(() => {
    Scheme.of({attribute: 1, predicate: () => {}})
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    Scheme.of({attribute: 'string', predicate: []})
  }, new RegExp(`Expected ${[]} to be a function`));
  t.throws(() => {
    Scheme.of(1, () => {})
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    Scheme.of('string', [])
  }, new RegExp(`Expected ${[]} to be a function`));
  t.end();
});

test('should read properties', t => {
  let [attribute, predicate] = ['foo', is_type('string')];
  let scheme = Scheme.of({attribute, predicate});

  t.equals(scheme.attribute, attribute);
  t.equals(scheme.predicate, predicate);
  t.end()
});

test('should not set properties again', t => {
  let scheme = Scheme.of({attribute: 'foo', predicate: () => {}});

  t.throws(() => {
    scheme.attribute = 'bar'
  }, /attribute is immutable/);
  t.throws(() => {
    scheme.predicate = () => {}
  }, /predicate is immutable/);
  t.end()
});