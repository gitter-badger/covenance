import {merge, immutable_typed_descriptor} from '../utilities'


class Scheme {
  constructor({attribute, predicate}) {
    this.attribute = attribute;
    this.predicate = predicate;
  }
}


let descriptors = merge(
  immutable_typed_descriptor({property: 'attribute', type: 'string'}),
  immutable_typed_descriptor({property: 'predicate', type: 'function'}));

Object.defineProperties(Scheme.prototype, descriptors);


export default Scheme