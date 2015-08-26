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
      static register(klass, klassname) {
        const USAGE = 'Expected (class, classname) to register';
        if (typeof klass !== 'function') {
          throw new Error(USAGE);
        } else if (typeof  klassname !== 'string') {
          throw new Error(USAGE);
        }
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
      if (proto.props) {
        _.extend(A.prototype, proto.props)
      }
      if (proto.blueprint) {
        A.prototype.blueprint = proto.blueprint
      }
    }
    if (klass) {
      if (klass.props) {
        _.extend(A, klass.props)
      }
      if (klass.blueprint) {
        A.blueprint = klass.blueprint
      }
    }
    return A;
  }
}