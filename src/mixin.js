import mixin_a_lot from 'mixin-a-lot';
import {Blueprint, is_Blueprint} from './blueprint';


const BLUEPRINT_KEY = 'blueprint';
const acts_as_blueprint = mixin_a_lot.make_mixin({

  name: 'acts_as_blueprint',

  premix() {
    let blueprints = this[BLUEPRINT_KEY];

    if (!Array.isArray(blueprints)) {
      throw new TypeError(`Expected property '${BLUEPRINT_KEY}' to be an Array`)
    }
    for (let scheme of blueprints) {
      if (!(is_Blueprint(scheme))) {
        throw new TypeError(
          `Expected element '${scheme}' of '${BLUEPRINT_KEY}' to be a Blueprint`);
      }
    }
  },

  check_blueprint(context = this) {
    for (let scheme of this[BLUEPRINT_KEY]) {
      if (!scheme.predicate(context[scheme.attribute])) {
        throw new TypeError(
          `'${scheme.attribute}': '${context[scheme.attribute]}' failed blueprint check`);
      }
    }
  }

});

export default {acts_as_blueprint}