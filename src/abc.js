import blueprint from './blueprint'
import {check_blueprint} from './mixin'
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

      static implemented_by(klass) {
        if (A.prototype.blueprints) {
          check_blueprint(klass.prototype, A.prototype.blueprints)
        }
        if (A.blueprints) {
          check_blueprint(klass, A.blueprints)
        }
        return A
      }
    }
    if (proto) {
      _.extend(A.prototype, proto.props);
      if (proto.blueprints) {
        A.prototype.blueprints = proto.blueprints;
      }
    }
    if (klass) {
      _.extend(A, klass.props);
      if (klass.blueprints) {
        A.blueprints = klass.blueprints;
      }
    }
    return A;
  }
}