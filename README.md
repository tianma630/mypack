webpack的打包原理可以查看这篇文章 [webpack如何实现模块化打包](https://github.com/tianma630/note-book/issues/9)

该打包工具参考的是webpack打包后的代码结构，通过ast进行模块处理和代码转换，再将代码放入webpack的代码模版中进行运行

## 使用

配置文件：mypack.config.js

运行根目录下的index.js脚本即可