import test from 'tape'
import {immutable_descriptor_set} from './index.es6.js'

let test_property = 'test_property';

test('should create the property', t => {
  let obj = Object.defineProperties(
    {}, immutable_descriptor_set(test_property));

  t.ok(obj.hasOwnProperty(test_property));
  t.end()
});

test('should set the property', t => {
  let obj = Object.defineProperties(
    {}, immutable_descriptor_set(test_property));

  t.doesNotThrow(() => { obj[test_property] = true }, null);
  t.equals(obj[test_property], true);
  t.end()
});

test('should not set the property twice', t => {
  let obj = Object.defineProperties({}, immutable_descriptor_set(test_property));

  obj[test_property] = null;

  t.throws(() => {
    obj[test_property] = false
  }, new Error(`${test_property} is immutable`));
  t.end()
});