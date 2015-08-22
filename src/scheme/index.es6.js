import {merge, immutable_descriptor} from '../utilities'


class Scheme {
  constructor({attribute, predicate}) {
    this.attribute = attribute;
    this.predicate = predicate;
  }
}

let attribute_descriptor = immutable_descriptor('attribute', {type: 'string'});
let predicate_descriptor = immutable_descriptor('predicate', {type: 'string'});
let descriptors = merge(attribute_descriptor, predicate_descriptor);

Object.defineProperties(Scheme.prototype, descriptors);


export default Scheme