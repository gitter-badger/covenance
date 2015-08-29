import mixin_a_lot from 'mixin-a-lot';
import {blueprinted, BLUEPRINTS_KEY} from './blueprinted'
import {blueprint} from './blueprint';
import {merge_own, is_function} from './utilities'


const EXECUTE_PROPERTY = 'execute';
const EXECUTE_ALIASES = [
  'blueprint',
  'assert',
  'press',
  'print'
];

let blueprints = {
  [EXECUTE_PROPERTY](fn, options = {}) {
    // glue blueprint-specific options back to mixin-a-lot
    let parsed_options = () => {
      options = merge_own(options, {
        premix: options.before_blueprint,
        postmix: options.after_blueprint
      });
      if (is_function(options.before_ok_blueprints)) {
        options.before_hook = {ok_blueprints: options.before_ok_blueprints}
      }
      if (is_function(options.after_ok_blueprints)) {
        options.after_hook = {ok_blueprints: options.after_ok_blueprints}
      }
      return options
    };
    if (!is_function(fn)) {
      throw new Error(`Expected function type to blueprint, got ${fn}`)
    }
    if (fn.prototype[BLUEPRINTS_KEY]) {
      mixin_a_lot.mix(fn.prototype, blueprinted, parsed_options());
    }
    if (fn[BLUEPRINTS_KEY]) {
      mixin_a_lot.mix(fn, blueprinted, parsed_options());
    }
    if (!fn.prototype[BLUEPRINTS_KEY] && !fn[BLUEPRINTS_KEY]) {
      throw new Error('Found no static or prototype blueprints.')
    }
  },

  create() {
    return blueprint.Blueprints(...arguments)
  }
};

for (let execute_alias of EXECUTE_ALIASES) {
  blueprints[execute_alias] = blueprints[EXECUTE_PROPERTY]
}

export default {blueprints}





