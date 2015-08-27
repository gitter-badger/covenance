import mixin_a_lot from 'mixin-a-lot';
import {Blueprint, is_Blueprint} from './blueprint';

const blueprint_check = ({target, blueprints}) => {
  for (let scheme of blueprints) {
    if (!scheme.predicate(target[scheme.attribute])) {
      throw new TypeError(
        `'${scheme.attribute}': '${target[scheme.attribute]}' failed blueprint check`);
    }
  }
};

const BLUEPRINTS_KEY = 'blueprints';
const acts_as_blueprinted = mixin_a_lot.make_mixin({

  name: 'blueprinted',

  // Anything that acts as a blueprint must have a blueprints property.
  premix() {
    let blueprints = this[BLUEPRINTS_KEY];

    if (!Array.isArray(blueprints)) {
      throw new TypeError(`Expected property '${BLUEPRINTS_KEY}' to be an Array`)
    }
    for (let scheme of blueprints) {
      if (!(is_Blueprint(scheme))) {
        throw new TypeError(
          `Expected element '${scheme}' of '${BLUEPRINTS_KEY}' to be a Blueprint`);
      }
    }
  },

  blueprint_check() {
    blueprint_check({target: this, blueprints: this[BLUEPRINTS_KEY]});
    return this
  }

});

export default {acts_as_blueprinted, BLUEPRINTS_KEY, blueprint_check}