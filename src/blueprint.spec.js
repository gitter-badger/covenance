import test from 'tape'
import {Blueprint, Blueprints, is_Blueprint} from './blueprint'
import {is_type} from './utilities'


test('should throw when creating with wrong signature', t => {
  t.throws(() => {
    Blueprint()
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.throws(() => {
    Blueprint(1, 2, 3)
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.end()
});

test('should not throw when creating with right signature', t => {
  t.doesNotThrow(() => {
    Blueprint({attribute: 'string', predicate: () => {}})
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.doesNotThrow(() => {
    Blueprint('string', () => {})
  }, /Expected \{attribute: \[string], predicate: \[function]}, or \(\[string], \[function]\)\.$/);
  t.end()
});

test('should create many Blueprints with positional tuple arguments', t => {
  let blueprints = Blueprints(['blueprint1', () => {}], ['blueprint2', () => {}]);

  t.ok(Array.isArray(blueprints));
  for (let blueprint of blueprints) {
    t.ok(is_Blueprint(blueprint))
  }
  t.end()
});

test('should create many Blueprints with positional object arguments', t => {
  let blueprints = Blueprints(
    {attribute: 'blueprint1', predicate: () => {}},
    {attribute: 'blueprint2', predicate: () => {}}
  );

  t.ok(Array.isArray(blueprints));
  for (let blueprint of blueprints) {
    t.ok(is_Blueprint(blueprint))
  }
  t.end()
});

test('should create many Blueprints with mixed positional arguments', t => {
  let blueprints = Blueprints(
    ['blueprint1', () => {}],
    {attribute: 'blueprint2', predicate: () => {}}
  );

  t.ok(Array.isArray(blueprints));
  for (let blueprint of blueprints) {
    t.ok(is_Blueprint(blueprint))
  }
  t.end()
});

test('should throw when creating with wrong types', t => {
  t.throws(() => {
    Blueprint({attribute: 1, predicate: () => {}})
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    Blueprint({attribute: 'string', predicate: []})
  }, new RegExp(`Expected ${[]} to be a function`));
  t.throws(() => {
    Blueprint(1, () => {})
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    Blueprint('string', [])
  }, new RegExp(`Expected ${[]} to be a function`));
  t.end();
});

test('should read properties', t => {
  let [attribute, predicate] = ['foo', is_type('string')];
  let scheme = Blueprint({attribute, predicate});

  t.equals(scheme.attribute, attribute);
  t.equals(scheme.predicate, predicate);
  t.end()
});

test('should not set properties again', t => {
  let scheme = Blueprint({attribute: 'foo', predicate: () => {}});

  t.throws(() => {
    scheme.attribute = 'bar'
  }, /attribute is immutable/);
  t.throws(() => {
    scheme.predicate = () => {}
  }, /predicate is immutable/);
  t.end()
});