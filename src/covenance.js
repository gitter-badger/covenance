import mixin_a_lot from 'mixin-a-lot';
import {ABC} from './abc'
import {covenanted, COVENANCE_KEY} from './covenanted'
import {Covenants} from './covenants';
import {merge_own, is_function} from './utilities'


const EXECUTE_PROPERTY = 'covenant';
const EXECUTE_ALIASES = [
  'execute',
  'assert'
];

let covenance = {
  [EXECUTE_PROPERTY](fn, options = {}) {
    let ok_fn = () => {
      if (!is_function(fn)) {
        throw new Error(`Expected function type to covenant, got ${fn}`)
      }
      if (!fn.prototype[COVENANCE_KEY] && !fn[COVENANCE_KEY]) {
        throw new Error('Found no static or prototype covenance.')
      }
    };
    // glue covenant-specific options back to mixin-a-lot
    //
    // modifies original options
    let clean_options = () => {
      let {
        pre_covenant,
        post_covenant,
        pre_check_covenants,
        post_check_covenants
      } = options;
      let hook = (hookspec) => {
        if (is_function(hookspec)) {
          return {check_covenants: hookspec};
        }
        return undefined
      };
      merge_own(options,
      {
        premix: pre_covenant,
        postmix: post_covenant
      },
      {
        before_hook: hook(pre_check_covenants),
        after_hook: hook(post_check_covenants)
      });
      return options
    };
    ok_fn();
    let mix_options = clean_options();
    if (fn.prototype[COVENANCE_KEY]) {
      mixin_a_lot.mix(fn.prototype, covenanted, mix_options);
    }
    if (fn[COVENANCE_KEY]) {
      mixin_a_lot.mix(fn, covenanted, mix_options);
    }
  },

  of() {
    return Covenants.of(...arguments)
  }
};

for (let execute_alias of EXECUTE_ALIASES) {
  covenance[execute_alias] = covenance[EXECUTE_PROPERTY]
}

export default {covenance, ABC}