const is_type_of = (type) => {
  return (thing) => {
    return typeof thing === type
  }
};

let is_string = is_type_of('string');
let is_function = is_type_of('function');
let is_number = is_type_of('number');
let is_boolean = is_type_of('boolean');
let is_object_literal = (thing) => {
  let is_object = is_type_of('object');
  return thing && is_object(thing) && !Array.isArray(thing)
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

// Merges own undefined keys from sources into sources.
const merge_own = function() {
  let parse_args = () => {
    let args = Array.prototype.slice.call(arguments);
    let overwrite;
    if (!is_boolean(args[args.length - 1])) {
      overwrite = true
    } else {
      overwrite = args.pop()
    }
    return [args[0], args.slice(1), overwrite]
  };
  let [target, sources, overwrite] = parse_args();
  let merge_one = (source) => {
    let merge_undefined = (target, key) => {
      if (source[key] !== undefined) {
        target[key] = source[key]
      }
    };
    if (!source) {
      return
    }
    for (let key of Object.getOwnPropertyNames(source)) {
      if (target.hasOwnProperty(key)) {
        if (overwrite) {
          merge_undefined(target, key)
        }
      } else {
        merge_undefined(target, key)
      }
    }
  };
  for (let source of sources) {
    merge_one(source)
  }
  return target
};

const abstract_inherit = (subfn, superfn) => {
  let proto_props = merge_own({}, subfn.prototype)
  subfn.prototype = Object.create(superfn.prototype, {
    constructor: {
      value: subfn,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  merge_own(subfn.prototype, proto_props);
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(subfn, superfn)
  } else {
    subfn.__proto__ = superfn;
  }
};

export default {
  appeal,
  abstract_inherit,
  is_string,
  is_function,
  is_number,
  is_boolean,
  is_object_literal,
  merge_own
}