import mixin_a_lot from 'mixin-a-lot';
import {blueprint as Blueprint} from './blueprint';


const BLUEPRINTS_KEY = 'blueprints';

// Verify that the target satisfies the specified blueprints.
//
// The properties specified by each Blueprint are not restricted to
// be own properties by default - this can be overridden by setting
// own = true.
let check_blueprints = (target, blueprints, own = false) => {
  for (let blueprint of blueprints) {
    if (own) {
      if (!target.hasOwnProperty(blueprint.attribute)) {
        throw new TypeError(`Expected '${blueprint.attribute}' to be own property on target`)
      }
    } else if (!blueprint.validator(target[blueprint.attribute])) {
      throw new TypeError(
        `'${blueprint.attribute}': '${target[blueprint.attribute]}' failed blueprint check`);
    }
  }
  return true
};

// verify that `thing` contains a valid blueprint
// specification, which is a non-empty Array of Blueprints.
let is_blueprinted = (thing) => {
  let blueprints = thing[BLUEPRINTS_KEY];

  if (!Array.isArray(blueprints) || !blueprints.length) {
    throw new TypeError(`Expected property '${BLUEPRINTS_KEY}' to be a non-empty Array`)
  }
  for (let blueprint of blueprints) {
    if (!(Blueprint.is(blueprint))) {
      throw new TypeError(
        `Expected element '${blueprint}' of '${BLUEPRINTS_KEY}' to be a Blueprint`);
    }
  }
  return true
};

export default {
  BLUEPRINTS_KEY,
  blueprinted: mixin_a_lot.make_mixin({

    name: 'blueprinted',

    // Anything that acts as a blueprint must have a blueprints property.
    premix() {
      is_blueprinted(this);
    },

    check_blueprints() {
      check_blueprints(this, this[BLUEPRINTS_KEY]);
      // return the instance/class/prototype so that
      // after_check_blueprints hook can consume it
      return this
    }

  }),
  check_blueprints,
  is_blueprinted
}