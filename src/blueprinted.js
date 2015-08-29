import mixin_a_lot from 'mixin-a-lot';
import {blueprint as Blueprint} from './blueprint';


const BLUEPRINTS_KEY = 'blueprints';

// Verify that the target satisfies the specified Scheme.
//
// The properties specified by each Blueprint are not restricted to
// be own properties by default, this can be overriden by setting
// own_properties = true.
let ok_blueprints = (target, blueprints, own_properties = false) => {
  for (let blueprint of blueprints) {
    if (own_properties) {
      if (!target.hasOwnProperty(blueprint.attribute)) {
        throw new TypeError(`'${blueprint.attribute}' not found on target`)
      }
    } else if (!blueprint.predicate(target[blueprint.attribute])) {
      throw new TypeError(
        `'${blueprint.attribute}': '${target[blueprint.attribute]}' failed blueprint check`);
    }
  }
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
};

export default {
  BLUEPRINTS_KEY,
  blueprinted: mixin_a_lot.make_mixin({

    name: 'blueprinted',

    // Anything that acts as a blueprint must have a blueprints property.
    premix() {
      is_blueprinted(this);
    },

    ok_blueprints() {
      ok_blueprints(this, this[BLUEPRINTS_KEY]);
      // return the instance/class/prototype so that
      // after_ok_blueprints hook can consume it
      return this
    }

  }),
  ok_blueprints,
  is_blueprinted
}