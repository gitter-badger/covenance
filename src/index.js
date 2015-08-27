import mixin_a_lot from 'mixin-a-lot';
import {Blueprint} from './blueprint';
import {acts_as_blueprinted, BLUEPRINTS_KEY} from './mixin'
import _ from 'underscore'


let ENABLED = false;

// glue blueprint-specific options back to mixin-a-lot
const clean_options = (options) => {
  options = _.extend(options, {
    premix: options.before_blueprint,
    postmix: options.after_blueprint
  });
  if (options.before_blueprint_check) {
    options.before_hook = ['blueprint_check']
  }
  if (options.after_blueprint_check) {
    options.after_hook = ['blueprint_check']
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
        blueprint: {
          enumerable: true,
          value: function(options = {}) {
            if (this.prototype[BLUEPRINTS_KEY]) {
              this.proto_mix(acts_as_blueprinted, clean_options(options));
            }
            if (this[BLUEPRINTS_KEY]) {
              this.static_mix(acts_as_blueprinted, clean_options(options));
            }
            if (!this.prototype[BLUEPRINTS_KEY] && !this[BLUEPRINTS_KEY]) {
              throw new Error('Found no static or prototype blueprints.')
            }
          }
        }
      });
      return true
    }
    return false
  },

  Blueprint
}





