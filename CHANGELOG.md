# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.1 - 1.1.4] - 2015-08-31
### Added

#### `covenant.validator`

* Don't run the `covenant.validator` when `covenant.attribute` isn't present on the target
* Add a test for the above
* Add content in README on how to properly define `covenant.validator`

#### README

* Improvements/fixes to README
* Add shorthand example for `implementation(Function fn)` in README
* Re-write tests to exemplify the above shorthand

## [1.1.0] - 2015-08-31
### Added
* Fixes some incorrect documentation in the README.
* Aliases `implemented_by` with `implementation` and `is_implemented` in the context of ABCs
* Removes the need to explicitly inherit from an ABC before calling `implementation(Function fn)`

## [1.0.2] - 2015-08-30
### Added
Initial release.
