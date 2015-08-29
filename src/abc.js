import {is_blueprinted, ok_blueprints, BLUEPRINTS_KEY} from './blueprinted'
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
    // Verify valid class name, and at least proto or class are
    // objects with valid blueprints, consistent with blueprints.execute().
    let ok_spec = () => {
      if (!is_string(name)) {
        throw new Error(USAGE)
      } else if (!CLASSNAME_PATTERN.test(name)) {
        throw new Error(`Expected ${name} to be pseudo-CamelCase: ${CLASSNAME_PATTERN}`)
      } else if (!is_object_literal(proto) && !is_object_literal(klass)) {
        throw new Error(USAGE)
      }
      (klass && is_blueprinted(klass));
      (proto && is_blueprinted(proto));
    };

    ok_spec();

    // Some magic to dynamically generate the class name.
    // See http://stackoverflow.com/a/9479081/2419669.
    let ABC = new Function(`
      return function ${name}() {
        if (this.constructor === ${name}) {
          throw new Error("Can't instantiate abstract class")
        }
      };`)();

    // Copy the spec (props and blueprints) into the newly generated ABC.
    if (proto) {
      merge_own(ABC.prototype, proto.props);
      if (proto[BLUEPRINTS_KEY]) {
        ABC.prototype[BLUEPRINTS_KEY] = proto[BLUEPRINTS_KEY];
      }
    }
    if (klass) {
      merge_own(ABC, klass.props);
      if (klass[BLUEPRINTS_KEY]) {
        ABC[BLUEPRINTS_KEY] = klass[BLUEPRINTS_KEY];
      }
    }
    return merge_own(ABC, {
      // Check that a subclass satisfies the abstract contracts.
      // Call this with the subclass whenever you subclass an ABC.
      implemented_by(fn) {
        let ok_fn = () => {
          if (!is_function(fn)) {
            throw new Error(`Abstract class ${name} cannot be implemented by a non-function`)
          } else if (!(fn.prototype instanceof this)) {
            throw new Error(`${fn.name} is not a subclass of ${name}`)
          }
        };

        ok_fn();

        // Verify the ABC contracts.
        //
        // The own_properties flag should be true; we want to ignore
        // the blueprint props specified in the ABC when validating the subclass.
        if (ABC.prototype[BLUEPRINTS_KEY]) {
          ok_blueprints(fn.prototype, ABC.prototype[BLUEPRINTS_KEY], true)
        }
        if (ABC[BLUEPRINTS_KEY]) {
          ok_blueprints(fn, ABC[BLUEPRINTS_KEY], true)
        }
        return fn
      }
    });
  }
}