import mixin_a_lot from 'mixin-a-lot';
import {Scheme, is_Scheme} from '../scheme';


let BLUEPRINT_NAME = 'blueprint';
let acts_as_blueprint =  mixin_a_lot.make_mixin({

  name: BLUEPRINT_NAME,

  premixing_hook() {
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

  validate_blueprint() {
    for (let scheme of this[BLUEPRINT_NAME]) {
      let check = `${scheme.predicate}(${this[scheme.attribute]})`;
      if (!eval(check)) {
        throw new Error(`Expected '${check}' to return true`);
      }
    }
  }

});


