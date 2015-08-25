import mixin_a_lot from 'mixin-a-lot';
import {Blueprint, is_Blueprint} from './blueprint';


const BLUEPRINT_NAME = 'blueprint';
const acts_as_blueprint = mixin_a_lot.make_mixin({

  name: BLUEPRINT_NAME,

  premix() {
    let blueprints = this[BLUEPRINT_NAME];

    if (!Array.isArray(blueprints)) {
      throw new TypeError(`Expected property '${BLUEPRINT_NAME}' to be an Array`)
    }
    for (let scheme of blueprints) {
      if (!(is_Blueprint(scheme))) {
        throw new TypeError(
          `Expected element '${scheme}' of '${BLUEPRINT_NAME}' to be a Blueprint`);
      }
    }
  },

  check_blueprint() {
    for (let scheme of this[BLUEPRINT_NAME]) {
      if (!scheme.predicate(this[scheme.attribute])) {
        throw new TypeError(
          `'${scheme.attribute}': '${this[scheme.attribute]}' failed blueprint check`);
      }
    }
  }
});

export default {acts_as_blueprint}