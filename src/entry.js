import a, {b, c, plus} from './a.js';
import d from './b.js';

let ret = plus(a, b) + d(c);

console.log(ret);
