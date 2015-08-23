import {merge, immutable_descriptor_set} from '../utilities'


class Scheme {
  constructor({attribute, predicate}) {
    this.attribute = attribute;
    this.predicate = predicate;
  }

  static of({attribute, predicate}) {
    if (typeof attribute !== 'string') {
      throw new Error(`Expected ${attribute} to be a string`)
    } else if (typeof predicate !== 'function') {
      throw new Error(`Expected ${predicate} to be a function`)
    }
    return new this({attribute, predicate})
  }
}

let attribute_descriptor = immutable_descriptor_set('attribute');
let predicate_descriptor = immutable_descriptor_set('predicate');
let descriptors = merge(attribute_descriptor, predicate_descriptor);

Object.defineProperties(Scheme.prototype, descriptors);


export default {Scheme: Scheme.of.bind(Scheme)}