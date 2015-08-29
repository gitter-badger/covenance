# blueprint

[![Build Status](https://travis-ci.org/yangmillstheory/blueprint.svg?branch=master)](https://travis-ci.org/yangmillstheory/blueprint)

Abstract base and blueprinted classes in JavaScript.

## Introduction

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