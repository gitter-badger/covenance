import test from 'tape'
import {Blueprint} from './blueprint'
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