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

### `blueprints.execute()`

Import the module:

    import {blueprints} from 'blueprint'
    
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
    
Pre/post blueprinting hooks fire if `blueprints` exist on prototype.
 
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

Static blueprints can be specified simultaneously and accept the same hooks.

Each hook will be invoked with each context (prototype or function) that has `blueprints`.

The only difference is `this` in the hook body will point to the function.
 
### `blueprints.ABC(...)`

## API




