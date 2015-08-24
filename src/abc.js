import blueprint from './blueprint'
import {Scheme} from './scheme'


class ABC {

  constructor() {
    if (this.constructor === ABC) {
      throw new Error('Cannot instantiate abstract class ABC')
    }
  }

  static register(klass) {
    if (typeof klass !== 'function') {
      throw new Error(`Expected function got ${typeof klass}`)
    }
  }
}

blueprint.enable();

ABC.blueprint = [Scheme('blueprint', Array.isArray)];
ABC.blueprint_static();


class Abstract extends ABC {

}
