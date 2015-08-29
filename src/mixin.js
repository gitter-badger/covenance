import mixin_a_lot from 'mixin-a-lot';
import Scheme from './scheme';


let blueprint_check = (target, blueprints, own_properties = false) => {
  for (let scheme of blueprints) {
    if (own_properties && !target.hasOwnProperty(scheme.attribute)) {
      throw new TypeError(`'${scheme.attribute}' not found on target`)
    } else if (!scheme.predicate(target[scheme.attribute])) {
      throw new TypeError(
        `'${scheme.attribute}': '${target[scheme.attribute]}' failed blueprint check`);
    }
  }
};

let assert_has_blueprints = (thing) => {
  let blueprints = thing[BLUEPRINTS_KEY];

  if (!Array.isArray(blueprints) || !blueprints.length) {
    throw new TypeError(`Expected property '${BLUEPRINTS_KEY}' to be a non-empty Array`)
  }
  for (let scheme of blueprints) {
    if (!(Scheme.is(scheme))) {
      throw new TypeError(
        `Expected element '${scheme}' of '${BLUEPRINTS_KEY}' to be a Scheme`);
    }
  }
};

const BLUEPRINTS_KEY = 'blueprints';
const validates_blueprints = mixin_a_lot.make_mixin({

  name: 'blueprinted',

  // Anything that acts as a blueprint must have a blueprints property.
  premix() {
    assert_has_blueprints(this);
  },

  blueprint_check() {
    blueprint_check(this, this[BLUEPRINTS_KEY]);

    // return the instance/class/prototype so that
    // after_blueprint_check hook can consume it
    return this
  }

});

export default {
  validates_blueprints,
  BLUEPRINTS_KEY,
  blueprint_check,
  assert_has_blueprints
}