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
  return thing && is_object(thing) && !Array.isArray(thing)
};

// Merges own undefined keys from sources into sources.
const merge_own = (target, ...sources) => {
  let merge_one = (obj) => {
    if (!obj) {
      return
    }
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] !== undefined) {
          target[key] = obj[key]
        }
      }
    }
  };
  for (let source of sources) {
    merge_one(source)
  }
  return target
};

// Invoke each of the specified functions, throwing an error
// only if all invocations threw an error.
//
// Signature:
//
//    (...fns, message)
//
// `message` is optional; each `fn` should be a function.
const appeal = function() {
  let parse_arguments = () => {
    let args = Array.prototype.slice.call(arguments);
    let msg;
    let fns;
    if (is_string(args[args.length - 1])) {
      msg = args.pop();
    } else {
      msg = ''
    }
    fns = args;
    return [fns, msg]
  };
  let ok_fn = (fn) => {
    if (!is_function(fn)) {
      throw new Error(`Expected function for ${fn}`)
    }
  };
  let [fns, msg] = parse_arguments();
  let fails = 0;
  for (let fn of fns) {
    ok_fn(fn);
    try {
      fn()
    } catch (e) {
      fails++;
    }
  }
  if (fails === fns.length) {
    throw new Error(msg || `All ${fns.length} functions failed`)
  }
};

export default {
  merge_own,
  appeal,
  is_string,
  is_function,
  is_number,
  is_object_literal
}