import mixin_a_lot from 'mixin-a-lot';
import {ABC} from './abc'
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
    let ok_fn = () => {
      if (!is_function(fn)) {
        throw new Error(`Expected function type to blueprint, got ${fn}`)
      }
      if (!fn.prototype[BLUEPRINTS_KEY] && !fn[BLUEPRINTS_KEY]) {
        throw new Error('Found no static or prototype blueprints.')
      }
    };
    // glue blueprint-specific options back to mixin-a-lot
    //
    // modifies original options
    let clean_options = () => {
      let {
        pre_blueprint,
        post_blueprint,
        pre_ok_blueprints,
        post_ok_blueprints
      } = options;
      let hook = (hookspec) => {
        if (is_function(hookspec)) {
          return {ok_blueprints: hookspec};
        }
        return undefined
      };
      merge_own(options,
      {
        premix: pre_blueprint,
        postmix: post_blueprint
      },
      {
        before_hook: hook(pre_ok_blueprints),
        after_hook: hook(post_ok_blueprints)
      });
      return options
    };
    ok_fn();
    let mix_options = clean_options();
    if (fn.prototype[BLUEPRINTS_KEY]) {
      mixin_a_lot.mix(fn.prototype, blueprinted, mix_options);
    }
    if (fn[BLUEPRINTS_KEY]) {
      mixin_a_lot.mix(fn, blueprinted, mix_options);
    }
  },

  create() {
    return blueprint.Blueprints(...arguments)
  }

};

for (let execute_alias of EXECUTE_ALIASES) {
  blueprints[execute_alias] = blueprints[EXECUTE_PROPERTY]
}

export default {blueprints, ABC}





