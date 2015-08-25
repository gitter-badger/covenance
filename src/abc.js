import blueprint from './mixin'
import {Blueprint} from './blueprint'


let make_ABC = (blueprint) => {

};

class ABC {

  constructor() {
    if (this.constructor === ABC) {
      throw new Error('Cannot instantiate abstract class ABC')
    }
  }

  extends_abstract(klass) {
    if (typeof klass !== 'function') {
      throw new Error(`Expected function got ${typeof klass}`)
    }
  }
}

blueprint.enable();

ABC.blueprint = [Blueprint('blueprint', Array.isArray)];
ABC.blueprint_static();


class Abstract extends ABC {

}
