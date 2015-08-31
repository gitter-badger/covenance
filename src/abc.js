import {is_covenanted, check_covenants, COVENANCE_KEY} from './covenanted'
import {
  merge_own,
  is_string,
  is_object_literal,
  is_function,
  appeal,
  inherit
} from './utilities'

const CLASSNAME_PATTERN = /^([A-Z][A-Za-z0-9]+)+$/;
const USAGE = `Pass a valid ABC spec:
  {
    name: [String],
    (proto,klass): {
      props: [Object],
      covenance: [Array of Covenants]
    }
  }`;

class ABCMeta {}
Object.freeze(ABCMeta);

let __make_ABC__ = (name, proto = {}, klass = {}) => {
  // Some magic to dynamically generate the class name.
  // See http://stackoverflow.com/a/9479081/2419669.
  let ABC = new Function(`
    return function ${name}() {
      if (this.constructor === ${name}) {
        throw new Error("Can't instantiate abstract class")
      }
    };`)();
  inherit(ABC, ABCMeta);
  // Copy the spec (static and proto props and covenance) into the new ABC.
  merge_own(ABC.prototype, proto.props, {
    [COVENANCE_KEY]: proto[COVENANCE_KEY]
  });
  merge_own(ABC, klass.props,
    {
      [COVENANCE_KEY]: klass[COVENANCE_KEY]
    },
    {
    // Check that a subclass satisfies the ABC covenance.
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
      // The "own" flag is true because we want to ignore
      // the covenance attributes specified in ABC when validating the subclass.
      if (ABC.prototype[COVENANCE_KEY]) {
        check_covenants(fn.prototype, ABC.prototype[COVENANCE_KEY], true)
      }
      if (ABC[COVENANCE_KEY]) {
        check_covenants(fn, ABC[COVENANCE_KEY], true)
      }
      return fn
    }
  });
  return ABC;
};

export default {
  ABC({name, proto, klass} = {}) {
    // Verify valid class name, and one of proto or
    // klass are objects with valid covenance.
    let ok_spec = (name, proto, klass) => {
      if (!is_string(name)) {
        throw new Error(USAGE)
      } else if (!CLASSNAME_PATTERN.test(name)) {
        throw new Error(`Expected ${name} to be pseudo-CamelCase: ${CLASSNAME_PATTERN}`)
      }
      if (!is_object_literal(proto) && !is_object_literal(klass)) {
        throw new Error(USAGE)
      }
      let exists_and_covenanted = (thing) => {
        return () => {
          if (!thing) {
            throw new Error()
          }
          is_covenanted(thing);
        }
      };
      // Pass if at least one of klass or proto was specified and covenanted.
      appeal(
        exists_and_covenanted(proto),
        exists_and_covenanted(klass),
        USAGE
      );
      return [name, proto, klass]
    };
    return __make_ABC__(...ok_spec(name, proto, klass));
  },

  ABCMeta
}