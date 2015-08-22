import test from 'tape'
import {immutable_descriptor_set} from './index.es6.js'

let test_property = 'test_property';

test('should create an immutable untyped property', t => {
  let obj = Object.defineProperties({}, immutable_descriptor_set(test_property));

  t.ok(obj.hasOwnProperty(test_property));
  t.end();
});


test('should allow setting property', t => {
  t.plan(2);

  let obj = Object.defineProperties({}, immutable_descriptor_set(test_property));

  t.doesNotThrow(() => { obj[test_property] = true }, null);
  t.equals(obj[test_property], true);
});

test('should not allow setting property twice', t => {
  let obj = Object.defineProperties({}, immutable_descriptor_set(test_property));

  obj[test_property] = true;

  t.throws(() => {
    obj[test_property] = false
  }, new Error(`${test_property} is immutable`));
  t.end()
});