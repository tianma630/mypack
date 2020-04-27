// // babel核心库，实现核心的转换引擎
// let babel = require('babel-core');
// // 可以实现类型判断，生成AST节点等
// let types = require('babel-types');


const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const types = require('@babel/types');
const {transformFromAst} = require('@babel/core');



let code = `let sum = (a, b) => a + b`;
// let sum = function(a, b) {
//   return a + b
// }


const ast = babelParser.parse(code, {
  sourceType: "module"
});

traverse(ast, {
  ArrowFunctionExpression(path) {
    let node = path.node;
    let expression = node.body;
    let params = node.params;
    let returnStatement = types.returnStatement(expression);
    let block = types.blockStatement([
        returnStatement
    ]);
    let func = types.functionExpression(null,params, block,false, false);
    path.replaceWith(func);
  }
});

ast.program.body.unshift(types.expressionStatement(
  types.callExpression(
    types.memberExpression(
      types.identifier('__webpack_require__'),
      types.identifier('r')
    ), 
    [types.identifier('__webpack_exports__')]
  )
))

const result = transformFromAst(ast, null, {})

console.log(result.code);