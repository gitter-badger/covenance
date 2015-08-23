import mixin_a_lot from 'mixin-a-lot';
import {Scheme, is_Scheme} from '../scheme';


const BLUEPRINT_NAME = 'blueprint';
export default mixin_a_lot.make_mixin({

  name: BLUEPRINT_NAME,

  premix() {
    let blueprints = this[BLUEPRINT_NAME];

    if (!Array.isArray(blueprints)) {
      throw new Error(`Expected property '${BLUEPRINT_NAME}' to be an Array`)
    }
    for (let scheme of blueprints) {
      if (!(is_Scheme(scheme))) {
        throw new Error(
          `Expected element ${scheme} of ${BLUEPRINT_NAME} to be a Scheme`);
      }
    }
  },

  check_blueprints() {
    for (let scheme of this[BLUEPRINT_NAME]) {
      if (!scheme.predicate(this[scheme.attribute])) {
        throw new Error(`Expected '${check}' to return true`);
      }
    }
  }

});


