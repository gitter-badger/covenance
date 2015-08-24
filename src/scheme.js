import {merge} from './utilities'
import frosty from './frosty'


class Scheme {
  constructor({attribute, predicate}) {
    this.attribute = attribute;
    this.predicate = predicate;
  }

  static value_of({attribute, predicate} = {}) {
    if (attribute === undefined || predicate === undefined) {
      throw new Error('Expected {attribute: [string], predicate: [function]}')
    } else if (typeof attribute !== 'string') {
      throw new Error(`Expected ${attribute} to be a string`)
    } else if (typeof predicate !== 'function') {
      throw new Error(`Expected ${predicate} to be a function`)
    }
    return new this({attribute, predicate})
  }
}

frosty.freeze(Scheme.prototype, 'attribute', 'predicate');

export default {
  Scheme: Scheme.value_of.bind(Scheme),

  is_Scheme(thing) {
    return thing instanceof Scheme
  }
}