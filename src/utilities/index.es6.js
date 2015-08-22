let merge = (obj1, obj2) => {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key]
    }
  }
  return obj1
};

let immutable_descriptor_set = (property) => {
  let privatized = Symbol(property);
  let dirty = false;

  return {
    [privatized]: {
      value: null,
      writable: true
    },

    [property]: {
      enumerable: true,
      get() {
        return this[privatized];
      },
      set(value) {
        if (dirty) {
          throw new Error(`${property} is immutable`)
        }
        dirty = true;
        this[privatized] = value
      }
    }
  }
};


export default {merge, immutable_descriptor_set}