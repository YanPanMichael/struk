/*!
* @bilibili-live/bbuilder with v0.2.1
* Author: panyan <panyan@bilibili.com>
* Built on 2021-08-16, 18:23:08
* Released under the ISC License Copyright (c) 2021-2021
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('lodash')) :
    typeof define === 'function' && define.amd ? define(['lodash'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global._));
}(this, (function (_) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var ___default = /*#__PURE__*/_interopDefaultLegacy(_);

    function B() {
      console.log('test typescript');

      ___default['default'].assign({}, {
        name: 'test'
      });
    }

    B();

})));
