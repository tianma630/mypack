// function(module, __webpack_exports__, __webpack_require__)

// a.js
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, b , function() { return b; });
 __webpack_require__.d(__webpack_exports__, c, function() { return c; });
 __webpack_require__.d(__webpack_exports__, plus, function() { return plus; });
 __webpack_exports__[defalut] = (1);
 const b = 2;
 const c = 3;
 const plus = function(a, b) {
     return a + b;
    }


// b.js

__webpack_require__.r(__webpack_exports__);
__webpack_exports__["default"] = (function (a) {
     return  a * a;
});


// entry.js
__webpack_require__.r(__webpack_exports__);
var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/a.js"); 
var _b__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/b.js");


let ret = Object(_a__WEBPACK_IMPORTED_MODULE_0__["plus"])(_a__WEBPACK_IMPORTED_MODULE_0__["default"], _a__WEBPACK_IMPORTED_MODULE_0__["b"]) + _a__WEBPACK_IMPORTED_MODULE_0__["c"] * _b__WEBPACK_IMPORTED_MODULE_1__["default"];

console.log(ret);
