import test from 'tape'
import {immutable_descriptor_set} from './index'


let TEST_PROPERTY = 'test_property';

test('should create the property', t => {
  let obj = Object.defineProperties(
    {}, immutable_descriptor_set(TEST_PROPERTY));

  t.ok(obj.hasOwnProperty(TEST_PROPERTY));
  t.end()
});

test('should initialize the property to undefined', t => {
  let obj = Object.defineProperties({}, immutable_descriptor_set(TEST_PROPERTY));

  t.equals(obj[TEST_PROPERTY], undefined);
  t.end()
});

test('should not set the property to an undefined value', t => {
  let obj = Object.defineProperties(
    {}, immutable_descriptor_set(TEST_PROPERTY));

  t.throws(() => {
    obj[TEST_PROPERTY] = undefined
  }, new RegExp(`${TEST_PROPERTY} should be defined`));
  t.end()
});

test('should set the property to an defined value', t => {
  let obj = Object.defineProperties(
    {}, immutable_descriptor_set(TEST_PROPERTY));

  t.doesNotThrow(() => { obj[TEST_PROPERTY] = true }, null);
  t.equals(obj[TEST_PROPERTY], true);
  t.end()
});

test('should not set the property to different defined values twice', t => {
  let obj = Object.defineProperties({}, immutable_descriptor_set(TEST_PROPERTY));

  obj[TEST_PROPERTY] = null;

  t.throws(() => {
    obj[TEST_PROPERTY] = true
  }, new RegExp(`${TEST_PROPERTY} is immutable`));
  t.end()
});

test('should not set the property to the same defined value twice', t => {
  let obj = Object.defineProperties({}, immutable_descriptor_set(TEST_PROPERTY));

  obj[TEST_PROPERTY] = null;

  t.throws(() => {
    obj[TEST_PROPERTY] = null
  }, new RegExp(`${TEST_PROPERTY} is immutable`));
  t.end()
});