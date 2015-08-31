import {merge_own, is_object_literal, is_string, is_function} from './utilities'
import frosty from 'frosty'


class Covenant {
  constructor({attribute, validator}) {
    this.attribute = attribute;
    this.validator = validator;
  }
}

frosty.freeze(Covenant.prototype, 'attribute', 'validator');

const USAGE = `
Expected {attribute: [string], validator: [function]}, or ([string], [function]).`;

let __make_covenant__ = function() {
  // use function() to create new arguments scope
  let ok_spec = (attribute, validator) => {
    if (!is_string(attribute)) {
      throw new Error(`Expected ${attribute} to be a string`)
    } else if (!is_function(validator)) {
      throw new Error(`Expected ${validator} to be a function`)
    }
    return {attribute, validator}
  };
  let parse_spec = (spec) => {
    let attribute, validator;
    if (spec.length === 2) {
      attribute = spec[0];
      validator = spec[1];
    } else if (spec.length === 1) {
      let named_spec = spec[0];
      if (!is_object_literal(named_spec)) {
        throw new Error(USAGE)
      } else {
        attribute = named_spec.attribute;
        validator = named_spec.validator;
      }
    } else {
      throw new Error(USAGE)
    }
    return [attribute, validator];
  };
  return new Covenant(ok_spec(...parse_spec(arguments)))
};

export default {
  Covenants: {
    // This is the only exported way to create Covenants.
    //
    // Returns an immutable Array of Covenants.
    of(...specs) {
      if (!specs.length) {
        throw new Error(USAGE)
      }
      return Object.freeze(specs.map((spec) => {
        if (Array.isArray(spec)) {
          return __make_covenant__(...spec);
        } else if (is_object_literal(spec)) {
          return __make_covenant__(spec);
        } else {
          throw new Error(USAGE)
        }
      }));
    },

    is(thing) {
      return thing instanceof Covenant
    }
  }
};