一. 前端是基于 node 环境，主要架构是由 angular6(交互框架)+Material(UI 框架)组成;
(node 8.x 、npm 5.x 版本以上，更老的版本可能会出现错误，更新的版本则没问题。)

二. 生产环境==>安装以及使用:
项目根目录下找到 dist 文件夹,dist 文件夹里面就是生产环境使用所需要的。

三. 开发环境==>安装以及使用:

1、node 环境的安装
node 官网安装文件下载：根据自己电脑系统类型进行选择对应的类型下载安装包文件,
点击安装文件安装即可;(node 官网地址==>https://nodejs.org/zh-cn/download/);

2、检查是否成功安装
进入 cmd 命令窗口敲命令行==>
node -v
回车，出现 node 安装的版本号说明安装成功;
未出现 node 版本号，请检查第一步 node 的安装是否正确;

3、检查 npm 包管理工具
进入 cmd 命令窗口敲命令行==>
npm -v
查看版本号
(新版的 NodeJS 已经集成了 npm,所以安装好了 node,npm 也一并安装好了)

4、全局安装 Angular CLI
进入 cmd 命令窗口敲命令行==>
npm install -g @angular/cli

5、启动运行
在 cmd 命令窗口中，cd ==> 进入本地工程源码根目录;

    1) 输入命令行==>
        npm install 下载相关的插件包到 node_modules 文件夹下;
    2）输入启动命令行 ==>
        ng serve
    3) 启动项目，等待编译出现 Compiled successfully. 表示编译完成,直接可在浏览器中输入 http://localhost:4201/ ==>即可本地访问页面;
