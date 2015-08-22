import merge from 'utilities'


class Scheme {
  constructor({attribute, predicate}) {
    this.attribute = attribute;
    this.predicate = predicate;
  }
}

let immutable_typed_descriptor = ({property, type}) => {
  let set_immutably = (key, value) => {
    if (this[key] === null) {
      this[key] = value;
    } else {
      throw new Error(`${key} is immutable`);
    }
  };

  let descriptor = {};
  let privatized = `_${property}`;

  descriptor[privatized] = {
    value: null,
    writable: true
  };
  descriptor[property] = {
    enumerable: true,
    get() {
      return this[privatized];
    },
    set(value) {
      if (typeof value !== type) {
        throw new Error(`Expected ${value} to be a ${type}`);
      }
      set_immutably(privatized, value);
    }
  }
};


let scheme_descriptors = merge(
  immutable_typed_descriptor({property: 'attribute', type: 'string'}),
  immutable_typed_descriptor({property: 'predicate', type: 'function'}));


Object.defineProperties(Scheme.prototype, scheme_descriptors);


export default Scheme