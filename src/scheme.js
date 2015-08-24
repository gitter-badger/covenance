import {merge} from './utilities'
import frosty from './frosty'


class Scheme {
  constructor({attribute, predicate}) {
    this.attribute = attribute;
    this.predicate = predicate;
  }
}

frosty.freeze(Scheme.prototype, 'attribute', 'predicate');

const USAGE = `
Expected {attribute: [string], predicate: [function]}, or ([string], [function]).`;

let check_args = (attribute, predicate) => {
  if (typeof attribute !== 'string') {
    throw new Error(`Expected ${attribute} to be a string`)
  } else if (typeof predicate !== 'function') {
    throw new Error(`Expected ${predicate} to be a function`)
  }
};

export default {
  Scheme(...args) {
    let attribute, predicate;
    if (args.length === 2) {
      attribute = args[0];
      predicate = args[1];
    } else if (args.length === 1) {
      let named = args[0];
      if (typeof named !== 'object') {
        throw new Error(USAGE)
      } else {
        attribute = named.attribute;
        predicate = named.predicate;
      }
    } else {
      throw new Error(USAGE)
    }
    check_args(attribute, predicate);
    return new Scheme({attribute, predicate})
  },

  is_Scheme(thing) {
    return thing instanceof Scheme
  }
}