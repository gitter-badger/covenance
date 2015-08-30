# blueprint

[![Build Status](https://travis-ci.org/yangmillstheory/blueprint.svg?branch=master)](https://travis-ci.org/yangmillstheory/blueprint)

Abstract base and blueprinted classes in JavaScript. 

Developed in [ES6 & Babel](http://babeljs.io/), tested with [tape](https://github.com/substack/tape), built with [gulpjs](http://gulpjs.com/), distributed via [NPM](fixme).

## Concepts

**Blueprint**

A `Blueprint` is a *specification for a valid object property*. 

It's defined by two read-only attributes: `attribute` and `validator`.  These are 
the property name, and the property validator, respectively.

**blueprinting**

If a `Function` and/or its prototype has a property `blueprints` that is an 
`Array` of `Blueprints`, that function can be *blueprinted*.

Blueprinting the function gives it a method called `ok_blueprints` that validates
the `Blueprints` that exist on the function and/or its prototype.

**ABCMeta**

It's often useful for a collection of classes to share `Blueprints` - this gives
us the notion of an *Abstract Base Class*, or *ABC*. 

The framework provides a way of creating such classes - which are modeled as subclasses 
of the immutable type `ABCMeta`.

## Install

    $ npm install --save blueprint
    
    
## Usage

Import the module:

    import {blueprints} from 'blueprint'

### `blueprints.execute()`
    
Blueprint a class:

    import {is_number} from './utilities'
    
    class Point {
      get blueprints() {
        return blueprints.create(
          ['x', is_number],
          ['y', is_number]
        )
      }
        
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.ok_blueprints()
      }
    }
    
    // validates blueprints property exists on Point 
    // and/or Point.prototype, then mixes in ok_blueprints method
    blueprints.execute(Point)
    
    new Point(1, 'string') // throws "'y': 'string' failed blueprint check"
    
<a name="execute-hooks">Pre/post blueprinting hooks fire if `blueprints` exist on prototype.</a>
 
In the hook body, `this` is the prototype.

    blueprints.execute(Point, {
      pre_blueprint() {
        // fires before blueprints validation
      }
    })
    
    blueprints.execute(Point, {
      post_blueprint() {
        // fires after blueprints validation
        // this is the prototype or function
      }
    })

Pre/post blueprint validation hooks fire before/after an `ok_blueprints` invocation. 

In the hook body, `this` is the prototype.

    blueprints.execute(Point, {
      pre_ok_blueprints() {
        // fires before an ok_blueprints() invocation
      }
    })
    
    blueprints.execute(Point, {
      post_ok_blueprints() {
        // fires after an ok_blueprints() invocation
      }
    })

**Static blueprints can be specified simultaneously and accept the same hooks.**

Each hook will be invoked with each context (prototype or function) that has `blueprints`.

The only difference is `this` in the hook body will point to the function.
 
### <a name='abc'></a> `blueprints.ABC(...)`

Create an *abstract base class*.
    
    import {is_string, is_function, is_number} from './utilities'

    let MyABC = blueprints.ABC({
      ABC({
        name: 'MyABC',
        proto: {
          blueprints: blueprints.create(
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
          blueprints: blueprints.create(
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
    // not extending ABC will cause this to throw
    //
    // this verifies that Impl satisfies the blueprint specifications
    ABC.implemented_by(Impl)
    
Only subclasses of an ABC can implement the ABC, and they must satisfy the 
prototype and/or class blueprints, even if the base class provides abstract implementations.

Of course, implementations can utilize the base class implementations.

## API

### `blueprints.create(...)`

Create an immutable `Array` of `Blueprints` for blueprinting classes. 

Each positional argument can either be an object `{attribute: [String], validator: [Function]}` or a
tuple `[[String] attribute, [Function] validator]`.

### `blueprints.execute(Function fn, [Object options])`

Register `Blueprints` on a function `fn`. `fn` must have `blueprints` defined on itself
or its prototype. 

Adds an [`ok_blueprints()`](#ok-blueprints) method to `fn`.

Options can be an object with keys `pre_blueprint` and/or `post_blueprint` mapping 
to functions, [as discussed above](#execute-hooks).

### <a name='ok-blueprints'></a> `blueprinted_fn.ok_blueprints()`

Validates that the blueprint specification given in `blueprints` are satisfied in `blueprinted_fn`
and/or `blueprinted_fn.prototype`.

Options can be an object with keys `pre_ok_blueprints` and/or `post_ok_blueprints` mapping 
to functions, [as discussed above](#execute-hooks).


### `blueprints.ABC(Object spec)`

Return a subclass of `ABCMeta` with the provided spec, which should include a `name`
mapping to a `String`, and either a `proto` object or `klass` object with a `blueprints`
key mapping to an `Array` of `Blueprints`.

`proto` and/or `klass` can each contain a `props` object that will be copied into 
the prototype of the resulting ABC's prototype and/or ABC.
 
The returned function will also have a method [`implemented_by`](#implemented-by). 

### <a name='implemented-by'></a> `{ABCMeta MyABC}.implemented_by(Function fn)`

Call this whenever implement an `ABCMeta` to ensure that the contract specified by the `ABCMeta` is satisified.
 
It has no side effects besides throwing errors in case your implementation isn't valid.

**See the [tests](https://github.com/yangmillstheory/blueprint/blob/master/src/abc.spec.js), 
and the [discussion above](#abc) for more detail.**

## Contributing

**Development is in `snake_case` ES6.**

Get the source.

    $ git clone git@github.com:yangmillstheory/blueprint

Install dependencies.
    
    $ npm install
    
Compile sources.

    $ node_modules/.bin/gulp build
    
Run tests.

    $ npm test

## License

MIT © 2015, Victor Alvarez
