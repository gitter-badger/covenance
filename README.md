# covenance

[![Build Status](https://travis-ci.org/yangmillstheory/covenance.svg?branch=master)](https://travis-ci.org/yangmillstheory/covenance)

Abstract base and covenanted classes in JavaScript. 

Developed in [ES6 & Babel](http://babeljs.io/), tested with [tape](https://github.com/substack/tape), built with [gulpjs](http://gulpjs.com/), distributed via [NPM](fixme).

## Concepts

**Covenant**

A `Covenant` is a ***specification for a valid object property***. 

It's defined by two read-only attributes: `attribute` and `validator`.  These are 
the property name, and the property validator, respectively.

**covenanting**

If a `Function` and/or its prototype has a property `covenance` that is an 
`Array` of `Covenants` (the result of calling [this method](#create-covenants)), then that function can be *covenanted*.

Covenanting the function gives it a method called `check_covenants` that validates
the `Covenants` that exist on the function and/or its prototype.

**ABCMeta**

It's often useful for a collection of classes to **share** `Covenants` - this gives
us the notion of an ***Abstract Base Class***, or ***ABC***. 

**covenance** provides a way of creating such classes - which are modeled as subclasses 
of the immutable type `ABCMeta`.

## Install

    $ npm install --save covenance
    
    
## Usage

Import the module:

    import {covenance} from 'covenance'

### `covenance.covenant(Function fn)`
    
Covenant a class:

    import {is_number} from './utilities'
    
    class Point {
      get covenance() {
        return covenance.of(
          ['x', is_number],
          ['y', is_number]
        )
      }
        
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.check_covenants()
      }
    }
    
    // validates 'covenance' property exists on Point 
    // and/or Point.prototype, then mixes in check_covenants method
    covenance.covenant(Point)
    
    new Point(1, 'string') // throws "'y': 'string' failed covenant check"
    
<a name="covenant-hooks">Pre/post covenanting hooks fire if `covenance` exists on prototype and/or `Function`.</a>
 
In the hook body, `this` is the prototype or `Function`.

    covenance.covenant(Point, {
      pre_covenant() {
        // fires before 'covenance' property check and adding 'check_covenants'
      }
    })
    
    covenance.covenant(Point, {
      post_covenant() {
        // fires after 'covenance' property check and adding 'check_covenants'
        // 'this' is the prototype or function
      }
    })

<a name='check-covenants-hooks'>Pre/post covenant check hooks fire before/after a `check_covenants` invocation.</a> 

In the hook body, `this` is the prototype or `Function`.

    covenance.execute(Point, {
      pre_check_covenants() {
        // fires before a check_covenants() invocation
      }
    })
    
    covenance.execute(Point, {
      post_check_covenants() {
        // fires after a check_covenants() invocation
      }
    })

**Covenants can be specified on the prototype and function simultaneously, the hook API is the same.**

**Each hook will be invoked for each context (prototype or function) that has `covenance`. In invocations, `this` will point to either the prototype or function.**
 
### <a name='abc'></a> `covenance.ABC(...)`

Create an *abstract base class*.
    
    import {is_string, is_function, is_number} from './utilities'

    let MyABC = covenance.ABC({
      ABC({
        name: 'MyABC',
        proto: {
          covenance: covenance.of(
            ['proto1', is_string],
            ['proto2', is_function]
          ),
          // optional abstract implementations, subclasses can call up
          props: {
            proto1: 'proto1',
            proto2() {
              return 'proto2'
            }
          }
        },
        klass: {
          covenance: covenance.of(
            ['static1', is_number],
            ['static2', is_function]
          ),
          // optional abstract implementations, subclasses can call up
          props: {
            static1: 999
          }
        }
      });
      
      
      MyABC.name  // 'MyABC'
      new MyABC() // Error - can't instantiate abstract class
      
Implement the ABC and register the implementation. 

    class Impl extends MyABC {
      get proto1() {
        return `Impl_proto1_${this._proto1}`'
      }
      proto2() {
        return super.proto2()
      }
      static get static1() {
        return super.static1 + 1000
      }
      static static2() {
        return 'Impl_static2'
      }
    }
    
    // removing any of the properties above or
    // not extending MyABC will cause this to throw
    //
    // this call verifies that Impl satisfies the covenance
    ABC.implemented_by(Impl)
    
**Only subclasses of an ABC can implement it, and they must satisfy all `Covenants` in the prototype and/or class `covenance`, even if the ABC provides its own implementations.**

**As demonstrated above, however, implementations can utilize the base class implementations in their own implementations.**

## API

### <a name='create-covenants'></a> covenance.of(...)

Returns an immutable `Array` of `Covenants` for covenanting classes. 

Each positional argument can either be an object `{attribute: [String], validator: [Function]}` or a
tuple `[[String] attribute, [Function] validator]`.

***This is the only way to create a valid `covenance` on a `Function` or its prototype.***

### <a name='covenant'></a> covenance.covenant(Function fn, [Object options])

Register `Covenants` on a function `fn`. `fn` must have a `covenance` property defined on itself
or its prototype.

Adds a [check_covenants()](#check-covenants) method to `fn`.

Options can be an object with any combination of keys `pre_covenant`, `post_covenant`, 
`pre_check_covenants`, `post_check_covenants` mapping to functions, as discussed above 
[here](#covenant-hooks) and [here](#check-covenants-hooks).

**Aliases**: `assert, execute`

### <a name='check-covenants'></a> fn.check_covenants()

Only available for functions that have been [covenanted](#covenant).

Validates that the `covenance` is satisfied in `fn` and/or `fn.prototype`.

### covenance.ABC(Object spec)

Return a subclass of `ABCMeta` with the provided spec, which should include a `name`
mapping to a `String`, and either a `proto` object or `klass` object with a `covenance`
key mapping to an `Array` of `Covenants`.

`proto` and/or `klass` can each contain a `props` object that will be copied into 
the prototype of the ABC and/or itself.
 
In addition to any `props`, the ABC will have a method [implemented_by](#implemented-by). 

### <a name='implemented-by'></a> {ABCMeta MyABC}.implemented_by(Function fn)

Call this whenever you implement an `ABCMeta` to ensure that its `covenance` is satisfied.
 
It has no side effects besides throwing errors in case your implementation isn't valid.

**See the [tests](https://github.com/yangmillstheory/covenance/blob/master/src/abc.spec.js), 
and the [discussion above](#abc) for more detail.**

## Contributing

**Development is in `snake_case` ES6.**

Get the source.

    $ git clone git@github.com:yangmillstheory/covenance

Install dependencies.
    
    $ npm install
    
Compile sources.

    $ node_modules/.bin/gulp build
    
Run tests.

    $ npm test

## License

MIT © 2015, Victor Alvarez