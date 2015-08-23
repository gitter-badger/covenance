import mixin_a_lot from 'mixin-a-lot';
import {Scheme, is_Scheme} from './scheme';


const BLUEPRINT_NAME = 'blueprint';
const acts_as_blueprint = mixin_a_lot.make_mixin({

  name: BLUEPRINT_NAME,

  premix() {
    let blueprints = this[BLUEPRINT_NAME];

    if (!Array.isArray(blueprints)) {
      throw new TypeError(`Expected property '${BLUEPRINT_NAME}' to be an Array`)
    }
    for (let scheme of blueprints) {
      if (!(is_Scheme(scheme))) {
        throw new TypeError(
          `Expected element '${scheme}' of '${BLUEPRINT_NAME}' to be a Scheme`);
      }
    }
  },

  postmix() {
    for (let scheme of this[BLUEPRINT_NAME]) {
      if (!scheme.predicate(this[scheme.attribute])) {
        throw new Error(`Expected '${check}' to return true`);
      }
    }
  }
});

let enabled = false;

export default {

  enable() {
    if (!enabled) {
      enabled = true;
      mixin_a_lot.enable_protomixing();
      mixin_a_lot.enable_staticmixing();

      Object.defineProperties(Function.prototype, {
        blueprint_proto: {
          enumerable: false,
          value: function(options) { // cannot use fat arrow here, 'this' will be wrong
            this.proto_mix(acts_as_blueprint, options)
          }
        },
        blueprint_static: {
          enumerable: false,
          value: function(options) {
            this.static_mix(acts_as_blueprint, options)
          }
        }
      });
      return true
    }
    return false
  },

  Scheme

}





