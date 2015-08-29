# blueprint

[![Build Status](https://travis-ci.org/yangmillstheory/blueprint.svg?branch=master)](https://travis-ci.org/yangmillstheory/blueprint)

Abstract base and blueprinted classes in JavaScript.

## Introduction

### Concepts

**Blueprint**

A `Blueprint` is a notion of a *validated object property*. 

It's defined by two read-only attributes: `attribute` and `validator`.  These are 
the property name, and the property validator, respectively.

**Executing Blueprints**

If a `blueprints` property exists and is valid on a `Function` and/or its prototype, that
function can be *blueprinted*.

Blueprinting the function gives it a method called `ok_blueprints` that validates
the `Blueprints` that exist on the function and/or its prototype.

**ABCMeta**

Sometimes, it's useful for a collection of classes to share `Blueprints` - this gives
us the notion of an *Abstract Base Class*, or *ABC*. 

This framework provides a way of creating such classes - which are modeled as subclasses 
of the immutable type `ABCMeta`.

## Install

    $ npm install --save blueprint