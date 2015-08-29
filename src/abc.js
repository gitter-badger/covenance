import {assert_has_blueprints, ok_blueprints, BLUEPRINTS_KEY} from './validates_blueprints'
import {merge_own, is_string, is_object_literal, is_function} from './utilities'

const CLASSNAME_PATTERN = /^([A-Z][A-Za-z0-9]+)+$/;
const USAGE = `Pass an ABC spec:
  {
    name: [String],
    (proto,klass): {
      props: [Object],
      blueprints: [Array of Blueprints]
    }
  }`;

export default {
  ABC({name, proto, klass} = {}) {
    if (!is_string(name)) {
      throw new Error(USAGE)
    } else if (!CLASSNAME_PATTERN.test(name)) {
      throw new Error(`Expected ${name} to be pseudo-CamelCase: ${CLASSNAME_PATTERN}`)
    } else if (!is_object_literal(proto) && !is_object_literal(klass)) {
      throw new Error(USAGE)
    }
    (proto && assert_has_blueprints(proto));
    (klass && assert_has_blueprints(klass));
    let abc = new Function(`
      return function ${name}() {
        if (this.constructor === ${name}) {
          throw new Error("Can't instantiate abstract class")
        }
      };`)();
    abc.implemented_by = (fn) => {
      if (!is_function(fn)) {
        throw new Error(`Abstract class ${name} can only be implemented by functions`)
      }
      if (abc.prototype[BLUEPRINTS_KEY]) {
        ok_blueprints(fn.prototype, abc.prototype[BLUEPRINTS_KEY], true)
      }
      if (abc[BLUEPRINTS_KEY]) {
        ok_blueprints(fn, abc[BLUEPRINTS_KEY], true)
      }
      return fn
    };
    if (proto) {
      merge_own(abc.prototype, proto.props);
      if (proto[BLUEPRINTS_KEY]) {
        abc.prototype[BLUEPRINTS_KEY] = proto[BLUEPRINTS_KEY];
      }
    }
    if (klass) {
      merge_own(abc, klass.props);
      if (klass[BLUEPRINTS_KEY]) {
        abc[BLUEPRINTS_KEY] = klass[BLUEPRINTS_KEY];
      }
    }
    return abc;
  },

  USAGE
}