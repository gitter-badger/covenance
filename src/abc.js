import {blueprint_check, BLUEPRINTS_KEY} from './mixin'
import _ from 'underscore'


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

      static register(impl) {
        let own_properties = true;
        if (typeof impl !== 'function') {
          throw new Error(`Abstract class ${name} can only register functions`)
        }
        if (A.prototype[BLUEPRINTS_KEY]) {
          blueprint_check({
            target: impl.prototype,
            blueprints: A.prototype[BLUEPRINTS_KEY],
            own_properties
          })
        }
        if (A[BLUEPRINTS_KEY]) {
          blueprint_check({
            target: impl,
            blueprints: A[BLUEPRINTS_KEY],
            own_properties
          })
        }
        return impl
      }
    }
    if (proto) {
      _.extendOwn(A.prototype, proto.props);
      if (proto[BLUEPRINTS_KEY]) {
        A.prototype[BLUEPRINTS_KEY] = proto[BLUEPRINTS_KEY];
      }
    }
    if (klass) {
      _.extendOwn(A, klass.props);
      if (klass[BLUEPRINTS_KEY]) {
        A[BLUEPRINTS_KEY] = klass[BLUEPRINTS_KEY];
      }
    }
    return A;
  }
}