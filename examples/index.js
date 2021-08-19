class C {
    @enumerable(false)
    method() { }
}

function enumerable(value) {
    return function (target, key, descriptor) {
        descriptor.enumerable = value;
        return descriptor;
    };
}

@isTestable(true)
class MyClass { }

function isTestable(value) {
    return function decorator(target) {
        target.isTestable = value;
    };
}
