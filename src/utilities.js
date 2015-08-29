const merge_own = (target, ...sources) => {
  let merge_one = (obj) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        target[key] = obj[key]
      }
    }
  };
  for (let source of sources) {
    merge_one(source)
  }
  return target
};

const is_type_of = (type) => {
  return (thing) => {
    return typeof thing === type
  }
};

let is_string = is_type_of('string');
let is_function = is_type_of('function');
let is_number = is_type_of('number');
let is_object_literal = (thing) => {
  let is_object = is_type_of('object');
  return is_object(thing) && !Array.isArray(thing)
};

const assert_some_fn = (message = '', ...fns) => {
  let ok_fn = (fn) => {
    if (!is_function(fn)) {
      throw new Error(`Expected function for ${fn}`)
    }
  };
  let fails = 0;
  for (let fn of fns) {
    try {
      ok_fn(fn) && fn()
    } catch (e) {
      fails++;
    }
  }
  if (fails === fns.length) {
    throw new Error(message || `All ${fns.length} functions failed`)
  }
};

export default {
  merge_own,
  assert_some_fn,
  is_string,
  is_function,
  is_number,
  is_object_literal
}