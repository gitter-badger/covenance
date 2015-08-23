const merge = (obj1, obj2) => {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key]
    }
  }
  return obj1
};

const is_type = (type) => {
  return (thing) => {
    return typeof thing === type
  }
};

const immutable_descriptor_set = property => {
  let privatized = Symbol(property);
  let UNINITIALIZED = undefined;

  return {
    [privatized]: {
      value: UNINITIALIZED,
      writable: true
    },

    [property]: {
      enumerable: true,
      get() {
        return this[privatized];
      },
      set(value) {
        if (this[privatized] !== UNINITIALIZED) {
          throw new Error(`${property} is immutable`)
        } else if (value === UNINITIALIZED) {
          throw new Error(`${property} should be defined`)
        }
        this[privatized] = value
      }
    }
  }
};


export default {merge, is_type, immutable_descriptor_set}