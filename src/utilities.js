const merge_own = (obj1, obj2) => {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key]
    }
  }
  return obj1
};

const is_type_of = (type) => {
  return (thing) => {
    return typeof thing === type
  }
};

export default {
  merge_own,
  is_string: is_type_of('string'),
  is_function: is_type_of('function'),
  is_number: is_type_of('number')
}