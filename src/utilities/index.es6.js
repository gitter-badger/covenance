let merge = (obj1, obj2) => {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key]
    }
  }
  return obj1
};

let immutable_descriptor = (property, {type}) => {
  let set_immutably = (key, value) => {
    if (this[key] === null) {
      this[key] = value
    } else {
      throw new Error(`${key} is immutable`)
    }
  };

  let privatized = `__${property}`;

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
        if (typeof type === 'string') {
          if (typeof value !== type) {
            throw new Error(`Expected ${value} to be a ${type}`);
          }
        }
        set_immutably(privatized, value);
      }
    }
  }
};


export default {merge, immutable_descriptor}