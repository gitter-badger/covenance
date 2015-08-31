import mixin_a_lot from 'mixin-a-lot';
import {Covenants} from './covenants';


const COVENANCE_KEY = 'covenance';

// Verify that the target satisfies the specified covenance.
//
// The properties specified by each Covenant are not restricted to
// be own properties by default - this can be overridden by setting
// own = true.
let check_covenants = (target, covenance, own = false) => {
  for (let covenant of covenance) {
    if (own) {
      if (!target.hasOwnProperty(covenant.attribute)) {
        throw new TypeError(`Expected '${covenant.attribute}' to be own property on target`)
      }
    } else if (!covenant.validator(target[covenant.attribute])) {
      throw new TypeError(
        `'${covenant.attribute}': '${target[covenant.attribute]}' failed covenant check`);
    }
  }
  return true
};

// verify that `thing` contains a valid covenance
// which is a non-empty Array of Covenants.
let is_covenanted = (thing) => {
  let covenance = thing[COVENANCE_KEY];

  if (!Array.isArray(covenance) || !covenance.length) {
    throw new TypeError(`Expected property '${COVENANCE_KEY}' to be a non-empty Array`)
  }
  for (let covenant of covenance) {
    if (!(Covenants.is(covenant))) {
      throw new TypeError(
        `Expected element '${covenant}' of '${COVENANCE_KEY}' to be a Covenant`);
    }
  }
  return true
};

export default {
  COVENANCE_KEY,
  covenanted: mixin_a_lot.make_mixin({

    name: 'covenanted',

    // Anything that acts as a covenant must have a covenance property.
    premix() {
      is_covenanted(this);
    },

    check_covenants() {
      check_covenants(this, this[COVENANCE_KEY]);
      // return the instance/class/prototype so that
      // after_check_covenants hook can consume it
      return this
    }

  }),
  check_covenants,
  is_covenanted
}