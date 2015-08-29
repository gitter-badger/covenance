import mixin_a_lot from 'mixin-a-lot';
import Scheme from './scheme';


let ok_blueprints = (target, blueprints, own_properties = false) => {
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

  name: 'validates_blueprints',

  // Anything that acts as a blueprint must have a blueprints property.
  premix() {
    assert_has_blueprints(this);
  },

  ok_blueprints() {
    ok_blueprints(this, this[BLUEPRINTS_KEY]);
    // return the instance/class/prototype so that
    // after_ok_blueprints hook can consume it
    return this
  }

});

export default {
  validates_blueprints,
  BLUEPRINTS_KEY,
  ok_blueprints,
  assert_has_blueprints
}