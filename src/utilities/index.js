let merge = (obj1, obj2) => {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key]
    }
  }
  return obj1
};

let immutable_descriptor_set = property => {
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


export default {merge, immutable_descriptor_set}