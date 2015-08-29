import {merge_own, is_object_literal, is_string, is_function} from './utilities'
import frosty from 'frosty'


class Blueprint {
  constructor({attribute, predicate}) {
    this.attribute = attribute;
    this.predicate = predicate;
  }
}

frosty.freeze(Blueprint.prototype, 'attribute', 'predicate');

const USAGE = `
Expected {attribute: [string], predicate: [function]}, or ([string], [function]).`;

let __make_blueprint__ = function() {
  // use function() to create new arguments scope
  let ok_spec = (attribute, predicate) => {
    if (!is_string(attribute)) {
      throw new Error(`Expected ${attribute} to be a string`)
    } else if (!is_function(predicate)) {
      throw new Error(`Expected ${predicate} to be a function`)
    }
    return {attribute, predicate}
  };
  let parse_spec = (spec) => {
    let attribute, predicate;
    if (spec.length === 2) {
      attribute = spec[0];
      predicate = spec[1];
    } else if (spec.length === 1) {
      let named_spec = spec[0];
      if (!is_object_literal(named_spec)) {
        throw new Error(USAGE)
      } else {
        attribute = named_spec.attribute;
        predicate = named_spec.predicate;
      }
    } else {
      throw new Error(USAGE)
    }
    return [attribute, predicate];
  };
  return new Blueprint(ok_spec(...parse_spec(arguments)))
};

export default {
  blueprint: {
    // This is the only exported way to create Blueprints.
    //
    // Returns an immutable Array of Blueprints.
    Blueprints(...specs) {
      if (!specs.length) {
        throw new Error(USAGE)
      }
      return Object.freeze(specs.map((spec) => {
        if (Array.isArray(spec)) {
          return __make_blueprint__(...spec);
        } else if (is_object_literal(spec)) {
          return __make_blueprint__(spec);
        } else {
          throw new Error(USAGE)
        }
      }));
    },

    is(thing) {
      return thing instanceof Blueprint
    }
  }
}