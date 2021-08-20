// import A from '~/index';
class C {
    // @enumerable(false)
    method() { }
}

function enumerable(value) {
    return function (target, key, descriptor) {
        descriptor.enumerable = value;
        return descriptor;
    };
}

// @isTestable(true)
class MyClass { 
    constructor() {
        console.log('MyClass')
    }
}

console.log(__ENV__);
function isTestable(value) {
    return function decorator(target) {
        target.isTestable = value;
    };
}
class Foo extends mixin(Array) {}

function mixin(Super) {
  return class extends Super {
    mix() {}
  };
}

const ff = new Foo();