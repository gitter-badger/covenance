import blueprint from './blueprint'
import {blueprint_check, BLUEPRINTS_KEY} from './mixin'
import {enable as enable_blueprints} from './index'
import {is_type, inherit} from './utilities'
import _ from 'underscore'

enable_blueprints();

export default {
  make({name, proto, klass}) {
    class A {
      constructor() {
        throw new Error("Can't instantiate abstract class")
      }

      static toString() {
        return name
      }

      static implemented_by(impl) {
        if (A.prototype[BLUEPRINTS_KEY]) {
          blueprint_check({
            target: impl.prototype,
            blueprints: A.prototype[BLUEPRINTS_KEY]
          })
        }
        if (A[BLUEPRINTS_KEY]) {
          blueprint_check({target: impl, blueprints: A[BLUEPRINTS_KEY]})
        }
        return A
      }
    }
    if (proto) {
      _.extend(A.prototype, proto.props);
      if (proto[BLUEPRINTS_KEY]) {
        A.prototype[BLUEPRINTS_KEY] = proto[BLUEPRINTS_KEY];
      }
    }
    if (klass) {
      _.extend(A, klass.props);
      if (klass[BLUEPRINTS_KEY]) {
        A[BLUEPRINTS_KEY] = klass[BLUEPRINTS_KEY];
      }
    }
    return A;
  }
}