import {blueprint_check, BLUEPRINTS_KEY} from './mixin'
import {merge_own} from './utilities'


export default {
  ABC({name, proto, klass}) {
    class A {
      constructor() {
        if (this.constructor === A) {
          throw new Error("Can't instantiate abstract class")
        }
      }

      static toString() {
        return name
      }

      static cast(impl) {
        if (typeof impl !== 'function') {
          throw new Error(`Abstract class ${name} can only cast functions`)
        }
        if (A.prototype[BLUEPRINTS_KEY]) {
          blueprint_check(impl.prototype, A.prototype[BLUEPRINTS_KEY], true)
        }
        if (A[BLUEPRINTS_KEY]) {
          blueprint_check(impl, A[BLUEPRINTS_KEY], true)
        }
        return impl
      }
    }
    if (proto) {
      merge_own(A.prototype, proto.props);
      if (proto[BLUEPRINTS_KEY]) {
        A.prototype[BLUEPRINTS_KEY] = proto[BLUEPRINTS_KEY];
      }
    }
    if (klass) {
      merge_own(A, klass.props);
      if (klass[BLUEPRINTS_KEY]) {
        A[BLUEPRINTS_KEY] = klass[BLUEPRINTS_KEY];
      }
    }
    return A;
  }
}