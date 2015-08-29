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

let __construct__ = function() { // use function() to create new arguments scope
  let ok_spec = (attribute, predicate) => {
    if (!is_string(attribute)) {
      throw new Error(`Expected ${attribute} to be a string`)
    } else if (!is_function(predicate)) {
      throw new Error(`Expected ${predicate} to be a function`)
    }
    return {attribute, predicate}
  };
  let parse_spec = () => {
    let attribute, predicate;
    if (arguments.length === 2) {
      attribute = arguments[0];
      predicate = arguments[1];
    } else if (arguments.length === 1) {
      let named_spec = arguments[0];
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
  return new Blueprint(ok_spec(...parse_spec(...arguments)))
};

export default {
  blueprint: {
    // Returns an immutable Array of Blueprints.
    Blueprints(...specs) {
      if (!specs.length) {
        throw new Error(USAGE)
      }
      return Object.freeze(specs.map((spec) => {
        if (Array.isArray(spec)) {
          return __construct__(...spec);
        } else if (is_object_literal(spec)) {
          return __construct__(spec);
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