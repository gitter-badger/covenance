import mixin_a_lot from 'mixin-a-lot';
import {Blueprint} from './blueprint';
import {acts_as_blueprint} from './mixin'
import _ from 'underscore'


let ENABLED = false;

// glue blueprint-specific options back to mixin-a-lot
const extract_options = (options) => {
  options = _.extend(options, {
    premix: options.before_blueprint,
    postmix: options.after_blueprint
  });
  if (options.before_blueprint_check) {
    options.before_hook = ['check_blueprint']
  }
  if (options.after_blueprint_check) {
    options.after_hook = ['check_blueprint']
  }
  return options
};

export default {
  enable() {
    if (!ENABLED) {
      ENABLED = true;

      mixin_a_lot.enable_protomixing();
      mixin_a_lot.enable_staticmixing();

      Object.defineProperties(Function.prototype, {
        proto_blueprint: {
          enumerable: false,
          // cannot use fat arrow here, 'this' will be wrong
          value: function(options = {}) {
            this.proto_mix(acts_as_blueprint, extract_options(options));
          }
        },
        static_blueprint: {
          enumerable: false,
          value: function(options = {}) {
            this.static_mix(acts_as_blueprint, extract_options(options));
          }
        }
      });
      return true
    }
    return false
  },

  Blueprint
}





