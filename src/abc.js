import {is_blueprinted, ok_blueprints, BLUEPRINTS_KEY} from './blueprinted'
import {merge_own, is_string, is_object_literal, is_function, assert_one_of} from './utilities'

const CLASSNAME_PATTERN = /^([A-Z][A-Za-z0-9]+)+$/;
const USAGE = `Pass an ABC spec:
  {
    name: [String],
    (proto,klass): {
      props: [Object],
      blueprints: [Array of Blueprints]
    }
  }`;

let __make_ABC__ = (name, proto, klass) => {
  // Some magic to dynamically generate the class name.
  // See http://stackoverflow.com/a/9479081/2419669.
  let ABC = new Function(`
    return function ${name}() {
      if (this.constructor === ${name}) {
        throw new Error("Can't instantiate abstract class")
      }
    };`)();
  // Copy the spec (static and proto props and blueprints) into the new ABC.
  merge_own(ABC.prototype, proto.props, {
    [BLUEPRINTS_KEY]: proto[BLUEPRINTS_KEY]
  });
  merge_own(ABC, klass.props,
    {
      [BLUEPRINTS_KEY]: klass[BLUEPRINTS_KEY]
    },
    {
    // Check that a subclass satisfies the ABC blueprints.
    //
    // Call this with the subclass whenever you subclass an ABC.
    implemented_by(fn) {
      let ok_fn = () => {
        if (!is_function(fn)) {
          throw new Error(`Abstract classes can only be implemented by functions`)
        } else if (!(fn.prototype instanceof this)) {
          throw new Error(`${fn.name} is not a subclass of ${name}`)
        }
      };
      ok_fn();
      // Verify the ABC contracts.
      //
      // The own flag should be true; we want to ignore
      // the blueprint props specified in ABC when validating the subclass.
      if (ABC.prototype[BLUEPRINTS_KEY]) {
        ok_blueprints(fn.prototype, ABC.prototype[BLUEPRINTS_KEY], true)
      }
      if (ABC[BLUEPRINTS_KEY]) {
        ok_blueprints(fn, ABC[BLUEPRINTS_KEY], true)
      }
      return fn
    }
  });
  return ABC;
};

export default {
  ABC({name, proto, klass} = {}) {
    // Verify valid class name, and at least proto or class are
    // objects with valid blueprints, consistent with blueprints.execute().
    let ok_spec = (name, proto, klass) => {
      if (!is_string(name)) {
        throw new Error(USAGE)
      } else if (!CLASSNAME_PATTERN.test(name)) {
        throw new Error(`Expected ${name} to be pseudo-CamelCase: ${CLASSNAME_PATTERN}`)
      } else if (!is_object_literal(proto) && !is_object_literal(klass)) {
        throw new Error(USAGE)
      }
      let is_obj_and_blueprinted = (thing) => {
        return () => {
          if (!thing) {
            throw new Error()
          }
          is_blueprinted(thing);
        }
      };
      // Pass if at least one of klass or proto was specified and blueprinted.
      assert_one_of(
        is_obj_and_blueprinted(proto),
        is_obj_and_blueprinted(klass),
        USAGE
      );
      return [name, proto, klass]
    };
    return __make_ABC__(...ok_spec(name, proto, klass));
  }
}