import atob from '-/atob'
import A from '@/../examples/other.js'

import _ from 'lodash'

function B() {
  console.log('test lodash')
  const name = _.assign({}, { name: 'test' })
  console.log(name + '')
}

class C {
  @enumerable(false)
  method() {}
}

function enumerable(value) {
  return function (target, key, descriptor) {
    descriptor.enumerable = value
    return descriptor
  }
}

@isTestable(true)
class MyClass {
  constructor() {
    console.log('MyClass', this.isTestable)
  }
}

console.log(__ENV__)

function isTestable(value) {
  return function decorator(target) {
    target.isTestable = value
  }
}
class Foo extends mixin(Array) {}

function mixin(Super) {
  return class extends Super {
    mix() {}
  }
}

console.log(atob('test'))
console.log(A.name)

const ff = new Foo()
