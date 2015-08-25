import blueprint from './blueprint'
import {is_type, inherit} from './utilities'


let make_ABC = (blueprint) => {

};

class ABC {
  constructor() {
    throw new Error('Cannot instantiate abstract class ABC')
  }

  static make() {
  }
}


export default ABC