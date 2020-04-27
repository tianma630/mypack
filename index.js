const path = require('path');
const fs = require('fs-extra');
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default;
const {transformFromAst} = require('@babel/core');
const types = require('@babel/types');

(function(config) {
  const entry = config.entry;
  const output = path.join(config.output.path, config.output.filename);
  const dirname = path.dirname(entry);
  let param = ''; // 合并的代码，是webpack模块化方法需要的参数

  // 获取绝对路径
  function getAbsPath(value) {
    return './' + path.join(dirname, value);
  }

  // 按文件解析代码
  function _pack(filename) {
    const content = fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

    const ast = parser.parse(content, {
      sourceType: "module"
    });

    // 开头插入代码 __webpack_require__.r(__webpack_exports__);
    ast.program.body.unshift(types.expressionStatement(
      types.callExpression(
        types.memberExpression(
          types.identifier('__webpack_require__'),
          types.identifier('r')
        ), 
        [types.identifier('__webpack_exports__')]
      )
    ));

    const dependMap = {}; // 存储依赖
    let index = 0; // import 计数

    traverse(ast, {
      // export default
      ExportDefaultDeclaration: path => {
        const declaration = path.node.declaration;
        let right = declaration;
        if (types.isFunctionDeclaration(declaration)) {
          right = types.functionExpression(null, declaration.params, declaration.body);
        }
        const expressionStatement = types.expressionStatement(
          types.assignmentExpression(
            '=',
            types.memberExpression(
              types.identifier('__webpack_exports__'),
              types.stringLiteral('default'),
              true
            ),
            right
          )
        );
        path.replaceWith(expressionStatement);
      },
      // 1、export a = 1; 2、export {a};
      ExportNamedDeclaration: path => {
        const declaration = path.node.declaration; // 第1种情况
        const specifiers = path.node.specifiers; // 第2种情况

        if (declaration) {
          const nodes = [];
          declaration.declarations.forEach(d => {
            let name = d.id.name;
            const expressionStatement = types.expressionStatement(
              types.callExpression(
                types.memberExpression(
                  types.identifier('__webpack_require__'),
                  types.identifier('d')
                ), 
                [
                  types.identifier('__webpack_exports__'), 
                  types.stringLiteral(name), 
                  types.functionExpression(
                    null, [], types.blockStatement([
                      types.returnStatement(types.identifier(name))
                    ])
                  )
                ]
              )
            );
            nodes.push(expressionStatement);
          })
          nodes.push(declaration);
          
          path.replaceWithMultiple(nodes);
        } else if (specifiers) {
          // todo 第2种情况待处理
        }
      },
      // import
      ImportDeclaration: apath => {
        const specifiers = apath.node.specifiers;
        const source = apath.node.source;
        const basename = path.basename(source.value, '.js');
        const absPath = getAbsPath(source.value);

        const dependName = `_${basename}__WEBPACK_IMPORTED_MODULE_${index ++}__`;
        let variableDeclaration = types.variableDeclaration('var', [
          types.variableDeclarator(
            types.identifier(dependName),
            types.callExpression(
              types.identifier('__webpack_require__'),
              [
                types.stringLiteral(absPath)
              ]
            )
          )
        ]);

        if (specifiers) {
          specifiers.forEach(s => {
            if (types.isImportDefaultSpecifier(s)) {
              dependMap[s.local.name] = [dependName, 'default'];
            } else {
              dependMap[s.local.name] = [dependName, s.local.name];
            }
          });
        }

        apath.replaceWith(variableDeclaration);

        _pack(absPath);
      },
      // a -> _a__WEBPACK_IMPORTED_MODULE_0__["a"]
      enter: path => {
        if (types.isIdentifier(path) && (!types.isMemberExpression(path.parent) || path.parent.object == path) && dependMap[path.node.name]) {
          const [obj, prop] = dependMap[path.node.name];

          const memberExpression = types.memberExpression(
            types.identifier(obj),
            types.stringLiteral(prop),
            true,
          );

          path.replaceWith(memberExpression);
        }
      }
    });

    const code = transformFromAst(ast, null, {}).code.replace(/(\n)/g, (r, $1) => {
      return '\\n';
    });

    param += '\'' + filename + '\': (function(module, __webpack_exports__, __webpack_require__) { eval(\'' + code + '\');}),';
  }

  _pack(entry);

  // 合并代码并写入新的文件
  renderWebpackTemplate(output, {entry, param});

  console.log('代码打包成功:', output);

})(require('./mypack.config.js'));

/**
 * 使用webpack的模块生成新的代码文件
 * @param {string} output 出口文件
 *  @param {string} entry 入口文件
 *  @param {string} param 合并的代码  
 */
function renderWebpackTemplate(output, {entry, param}) {
  fs.writeFileSync(output, `
    /******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/
    /******/ 		// Check if module is in cache
    /******/ 		if(installedModules[moduleId]) {
    /******/ 			return installedModules[moduleId].exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = installedModules[moduleId] = {
    /******/ 			i: moduleId,
    /******/ 			l: false,
    /******/ 			exports: {}
    /******/ 		};
    /******/
    /******/ 		// Execute the module function
    /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ 		// Flag the module as loaded
    /******/ 		module.l = true;
    
    /******/
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/ 	__webpack_require__.d = function(exports, name, getter) {
    /******/ 		if(!__webpack_require__.o(exports, name)) {
    /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
    /******/ 		}
    /******/ 	};
    /******/
    /******/ 	// define __esModule on exports
    /******/ 	__webpack_require__.r = function(exports) {
    /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    /******/ 		}
    /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
    /******/ 	};
    /******/
    /******/ 	// create a fake namespace object
    /******/ 	// mode & 1: value is a module id, require it
    /******/ 	// mode & 2: merge all properties of value into the ns
    /******/ 	// mode & 4: return value when already ns object
    /******/ 	// mode & 8|1: behave like require
    /******/ 	__webpack_require__.t = function(value, mode) {
    /******/ 		if(mode & 1) value = __webpack_require__(value);
    /******/ 		if(mode & 8) return value;
    /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    /******/ 		var ns = Object.create(null);
    /******/ 		__webpack_require__.r(ns);
    /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
    /******/ 		return ns;
    /******/ 	};
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/ 	__webpack_require__.n = function(module) {
    /******/ 		var getter = module && module.__esModule ?
    /******/ 			function getDefault() { return module['default']; } :
    /******/ 			function getModuleExports() { return module; };
    /******/ 		__webpack_require__.d(getter, 'a', getter);
    /******/ 		return getter;
    /******/ 	};
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /******/
    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";
    /******/
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(__webpack_require__.s = "${entry}");
    /******/ })
    /************************************************************************/
    /******/ ({
    
    ${param}
    
    /******/ });
  `);
}
