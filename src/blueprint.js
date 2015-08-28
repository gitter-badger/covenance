import mixin_a_lot from 'mixin-a-lot';
import Scheme from './scheme';
import {validates_blueprints, BLUEPRINTS_KEY} from './mixin'
import {merge_own, is_function} from './utilities'


const EXECUTE_PROPERTY = 'execute';
const EXECUTE_ALIASES = [
  'blueprint',
  'assert',
  'press',
  'print'
];

let blueprint = {
  [EXECUTE_PROPERTY](fn, options = {}) {
    // glue blueprint-specific options back to mixin-a-lot
    let api_options = () => {
      options = merge_own(options, {
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
    if (!is_function(fn)) {
      throw new Error(`Expected function type to blueprint, got ${fn}`)
    }
    if (fn.prototype[BLUEPRINTS_KEY]) {
      mixin_a_lot.mix(fn.prototype, validates_blueprints, api_options());
    }
    if (fn[BLUEPRINTS_KEY]) {
      mixin_a_lot.mix(fn, validates_blueprints, api_options());
    }
    if (!fn.prototype[BLUEPRINTS_KEY] && !fn[BLUEPRINTS_KEY]) {
      throw new Error('Found no static or prototype blueprints.')
    }
  },

  Blueprints() {
    return Scheme.Blueprints(...arguments)
  }
};

for (let execute_alias of EXECUTE_ALIASES) {
  blueprint[execute_alias] = blueprint[EXECUTE_PROPERTY]
}

export default blueprint





