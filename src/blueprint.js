import mixin_a_lot from 'mixin-a-lot';
import scheme from './scheme';
import {validates_blueprints, BLUEPRINTS_KEY} from './mixin'
import {merge, is_type} from './utilities'


let is_function = is_type('function');

// glue blueprint-specific options back to mixin-a-lot
const glue_api_options = (options) => {
  options = merge(options, {
    premix: options.before_blueprint,
    postmix: options.after_blueprint
  });
  if (is_function(options.before_blueprint_check)) {
    options.before_hook = {blueprint_check: options.before_blueprint_check}
  }
  if (is_function(options.after_blueprint_check)) {
    options.after_hook = {blueprint_check: options.after_blueprint_check}
  }
  return options
};

export default {
  execute_on(fn, options = {}) {
    if (!is_function(fn)) {
      throw new Error(`Expected function type to blueprint, got ${fn}`)
    }
    if (fn.prototype[BLUEPRINTS_KEY]) {
      mixin_a_lot.mix(fn.prototype, validates_blueprints, glue_api_options(options));
    }
    if (fn[BLUEPRINTS_KEY]) {
      mixin_a_lot.mix(fn, validates_blueprints, glue_api_options(options));
    }
    if (!fn.prototype[BLUEPRINTS_KEY] && !fn[BLUEPRINTS_KEY]) {
      throw new Error('Found no static or prototype blueprints.')
    }
  },

  Blueprints: scheme.Blueprints.bind(scheme)
}





