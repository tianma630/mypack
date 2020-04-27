(function(modules) { // webpackBootstrap
	// The module cache
	var installedModules = {};
	// The require function
	function __webpack_require__(moduleId) {
		// Check if module is in cache
		if(installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		// Create a new module (and put it into the cache)
		var module = installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		};
		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// Flag the module as loaded
		module.l = true;
		// Return the exports of the module
		return module.exports;
	}
	// define getter function for harmony exports
	__webpack_require__.d = function(exports, name, getter) {
		if(!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, { enumerable: true, get: getter });
		}
	};
	// define __esModule on exports
	__webpack_require__.r = function(exports) {
		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
		}
		Object.defineProperty(exports, '__esModule', { value: true });
	};
	__webpack_require__.o = function(object, property) { 
		return Object.prototype.hasOwnProperty.call(object, property); 
	};
	return __webpack_require__(__webpack_require__.s = "./src/entry.js");
})
({
  "./src/a.js": (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return b; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return c; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"plus\", function() { return plus; });\n/* harmony default export */ __webpack_exports__[\"default\"] = (1);\n\nconst b = 2;\n\nconst c = 3;\n\nconst plus = function(a, b) {\n  return a + b;\n}\n\n//# sourceURL=webpack:///./src/a.js?");
  }),
  
  "./src/b.js": (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (a) {\n  return  a * a;\n});;\n\n//# sourceURL=webpack:///./src/b.js?");
  }),
  
  "./src/entry.js": (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a */ \"./src/a.js\");\n/* harmony import */ var _b__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./b */ \"./src/b.js\");\n\n\n\nlet ret = Object(_a__WEBPACK_IMPORTED_MODULE_0__[\"plus\"])(_a__WEBPACK_IMPORTED_MODULE_0__[\"default\"], _a__WEBPACK_IMPORTED_MODULE_0__[\"b\"]) + Object(_b__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(_a__WEBPACK_IMPORTED_MODULE_0__[\"c\"]);\n\nconsole.log(ret);\n\n\n\n// (function(a, b) {\n//   let ret = a(1, 2) + b(2, 3);\n\n//   console.log(ret);\n// })(\n// {a: function(a, b) {\n//   return a + b;\n// }}, \n// function(a, b) {\n//   return a * b;\n// }\n// )\n\n\n//# sourceURL=webpack:///./src/entry.js?");
  })
  
});