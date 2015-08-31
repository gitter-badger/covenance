import test from 'tape'
import {Covenants} from './covenants'
import {is_string} from './utilities'


test('should throw when creating with wrong spec', t => {
  t.throws(() => {
    Covenants.of()
  }, /Expected \{attribute: \[string], validator: \[function]}, or \(\[string], \[function]\)\.$/);
  t.throws(() => {
    Covenants.of(1, 2, 3)
  }, /Expected \{attribute: \[string], validator: \[function]}, or \(\[string], \[function]\)\.$/);
  t.end()
});

test('should not throw when creating with right spec', t => {
  t.doesNotThrow(() => {
    Covenants.of({attribute: 'string', validator: () => {}})
  }, /Expected \{attribute: \[string], validator: \[function]}, or \(\[string], \[function]\)\.$/);
  t.doesNotThrow(() => {
    Covenants.of(['string', () => {}])
  }, /Expected \{attribute: \[string], validator: \[function]}, or \(\[string], \[function]\)\.$/);
  t.end()
});

test('should create Covenants with positional tuples', t => {
  let covenants = Covenants.of(
    ['covenant1', () => {}],
    ['covenant2', () => {}]
  );

  t.ok(Array.isArray(covenants));
  t.equals(covenants.length, 2);

  for (let covenant of covenants) {
    t.ok(Covenants.is(covenant))
  }
  t.end()
});

test('should create Covenants with positional objects', t => {
  let covenants = Covenants.of(
    {attribute: 'covenant1', validator: () => {}},
    {attribute: 'covenant2', validator: () => {}}
  );

  t.ok(Array.isArray(covenants));
  t.equals(covenants.length, 2);

  for (let covenant of covenants) {
    t.ok(Covenants.of(covenant))
  }
  t.end()
});

test('should create Covenants with mixed positional arguments', t => {
  let covenants = Covenants.of(
    ['covenant1', () => {}],
    {attribute: 'covenant2', validator: () => {}}
  );

  t.ok(Array.isArray(covenants));
  t.equals(covenants.length, 2);

  for (let covenant of covenants) {
    t.ok(Covenants.is(covenant))
  }
  t.end()
});

test('should return an immutable Array', t => {
  let covenants = Covenants.of(
    ['covenant1', () => {}],
    {attribute: 'covenant2', validator: () => {}}
  );

  try {
    covenants.push(0);
  } catch (e) {
    // in some engines, this will throw; do nothing with the error
  } finally {
    t.equals(covenants.length, 2);
    t.end()
  }
});

test('should throw when creating with wrong types', t => {
  t.throws(() => {
    Covenants.of([{attribute: 1, validator: () => {}}])
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    Covenants.of([{attribute: 'string', validator: []}])
  }, new RegExp(`Expected ${[]} to be a function`));
  t.throws(() => {
    Covenants.of([1, () => {}])
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    Covenants.of(['string', []])
  }, new RegExp(`Expected ${[]} to be a function`));
  t.end();
});

test('should read properties', t => {
  let [attribute, validator] = ['foo', is_string];
  let [covenant]= Covenants.of([{attribute, validator}]);

  t.equals(covenant.attribute, attribute);
  t.equals(covenant.validator, validator);
  t.end()
});

test('should not set properties again', t => {
  let [covenant] = Covenants.of([{attribute: 'foo', validator: () => {}}]);

  t.throws(() => {
    covenant.attribute = 'bar'
  }, /attribute is immutable/);
  t.throws(() => {
    covenant.validator = () => {}
  }, /validator is immutable/);
  t.end()
});