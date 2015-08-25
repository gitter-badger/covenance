import blueprint from './blueprint'
import {is_type, inherit} from './utilities'


let make_ABC = (blueprint) => {

};

class ABC {
  constructor() {
    throw new Error('Cannot instantiate abstract class ABC')
  }
}


export default {
  make({name, proto}) {
    class A {
      constructor() {
        throw new Error("Can't instantiate abstract class")
      }
      static toString() {
        return name
      }
    }
    if (typeof proto.props === 'object') {
      let props = proto.props;
      for (let prop in props) {
        if (props.hasOwnProperty(prop)) {
          A.prototype[prop] = props[prop]
        }
      }
    }
    return A;
  }
}