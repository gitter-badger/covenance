import blueprint from './blueprint'
import {check_blueprint} from './mixin'
import {enable as enable_blueprints} from './index'
import {is_type, inherit} from './utilities'
import _ from 'underscore'

enable_blueprints();

export default {
  make({name, proto, klass}) {
    class A {
      get blueprint() {
        return proto && proto.blueprint
      }

      static get blueprint() {
        return klass && klass.blueprint
      }

      constructor() {
        throw new Error("Can't instantiate abstract class")
      }

      static toString() {
        return name
      }

      static register(klass) {
        if (A.prototype.blueprint) {
          check_blueprint(klass.prototype, A.prototype.blueprint)
        }
        if (A.blueprint) {
          check_blueprint(klass, A.blueprint)
        }
        return A
      }
    }
    if (proto) {
      _.extend(A.prototype, proto.props);
      if (proto.blueprint) {
        A.proto_blueprint();
        A.prototype.check_blueprint()
      }
    }
    if (klass) {
      _.extend(A, klass.props)
      A.static_blueprint()
      A.check_blueprint()
    }
    return A;
  }
}