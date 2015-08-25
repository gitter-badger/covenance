//import test from 'tape'
//import {is_type} from './utilities'
//import ABC from './abc'
//import blueprint from './blueprint'
//
//
//test('should thrown an error when instantiated directly', t => {
//  let Polygon = ABC.make({
//    proto: {
//      blueprint: blueprint.Blueprints([
//        'sides', is_type('number'),
//        'area', is_type('function')
//      ]),
//      props: {
//        sides: NaN,
//        area() {
//          return Number.NEGATIVE_INFINITY;
//        }
//      }
//    }
//  });
//
//  t.throws(() => {
//    new Polygon()
//  }, /Cannot instantiate abstract class$/)
//});
//
//test.skip('should throw an error when implementation has no blueprint', t => {
//
//});
//
//test.skip('should throw an error when implementation does not satisfy blueprint', t => {
//
//});
//
//test.skip('should expose abstract methods to implementations', t => {
//
//});
//
//test.skip('should allow implementations to override abstract methods', t => {
//
//});