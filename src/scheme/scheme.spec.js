import test from 'tape'
import {Scheme} from './index'


test('should throw when creating with wrong types', t => {
  t.throws(() => {
    Scheme({attribute: 1, predicate: () => {}})
  }, new RegExp(`Expected ${1} to be a string`));
  t.throws(() => {
    Scheme({attribute: 'string', predicate: []})
  }, new RegExp(`Expected ${[]} to be a function`));
  t.end();
});

test('should read properties', t => {
  let [attribute, predicate] = ['foo', is('string')];
  let scheme = Scheme({attribute, predicate});

  t.equals(scheme.attribute, attribute);
  t.equals(scheme.predicate, predicate);
  t.end()
});

test('should not set attribute again', t => {
  let scheme = Scheme({attribute: 'foo', predicate: () => {}});

  t.throws(() => {
    scheme.attribute = 'bar'
  }, /attribute is immutable/);
  t.end()
});

test('should not set predicate again', t => {
  let scheme = Scheme({attribute: 'foo', predicate: () => {}});

  t.throws(() => {
    scheme.predicate = () => {}
  }, /predicate is immutable/);
  t.end()
});