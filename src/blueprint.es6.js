import mixin_a_lot from 'mixin-a-lot';
import Scheme from '../scheme';


let BLUEPRINT_PROPERTY = 'blueprint';
let blueprint =  mixin_a_lot.make_mixin({

  name: 'blueprint',

  premixing_hook() {
    let blueprints = this[BLUEPRINT_PROPERTY];

    if (!Array.isArray(blueprints)) {
      throw new Error(`Expected property '${BLUEPRINT_PROPERTY}' to be an Array`)
    }
    for (let scheme of blueprints) {
      if (!(scheme instanceof Scheme)) {
        throw new Error(
          `Expected element ${scheme} of ${BLUEPRINT_PROPERTY} to be a Scheme`);
      }
    }
  },

  validate_blueprint() {
    for (let scheme of this[BLUEPRINT_PROPERTY]) {
      let [predicate, attribute] = [scheme.predicate, scheme.attribute];
      let predicate_check = `${predicate}(${this[attribute]})`;
      if (!eval(predicate_check)) {
        throw new Error(`Expected '${predicate_check}' to return true`);
      }
    }
  }

});


