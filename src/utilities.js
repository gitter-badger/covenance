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

const inherit = (child, parent) => {
  for (let key in parent) {
    if (parent.hasOwnProperty(key)) {
      child[key] = parent[key];
    }
  }
  let ctor = () => {
    this.constructor = child;
  };
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};


export default {merge, is_type, inherit}