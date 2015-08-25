import blueprint from './blueprint'
import {enable as enable_blueprints} from './index'
import {is_type, inherit} from './utilities'


enable_blueprints();

export default {
  make({name, proto, cls}) {
    class A {
      constructor() {
        throw new Error("Can't instantiate abstract class")
      }
      static toString() {
        return name
      }
      static register(Impl) {
        if (typeof Impl!== 'function') {
          throw new Error('Expected function to register');
        }
        if (proto.blueprint) {
          Impl.prototype.blueprint = proto.blueprint;
          Impl.proto_blueprint();
          Impl.prototype.check_blueprint();
        }
        if (cls.blueprint) {
          Impl.blueprint = cls.blueprint;
          Impl.static_blueprint();
          Impl.check_blueprint();
        }
      }
    }
    if (proto && typeof proto.props === 'object') {
      let props = proto.props;
      for (let prop in props) {
        if (props.hasOwnProperty(prop)) {
          A.prototype[prop] = props[prop]
        }
      }
    }
    if (cls && typeof cls.props === 'object') {
      let props = cls.props;
      for (let prop in props) {
        if (props.hasOwnProperty(prop)) {
          A[prop] = props[prop]
        }
      }
    }
    return A;
  }
}