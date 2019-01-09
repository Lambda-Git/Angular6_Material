
一、MDBui前端是基于node环境，主要架构是由angular6(交互框架)+Material(UI框架)组成;
   (node 8.x 、npm 5.x 版本以上，更老的版本可能会出现错误，更新的版本则没问题。)
二、生产环境==>MDBui的安装以及使用:
      MDBui根目录下找到dist文件夹,dist文件夹里面就是生产环境使用所需要的。
三、开发环境==>MDBui的安装以及使用:
      1、node环境的安装
      node官网安装文件下载：根据自己电脑系统类型进行选择对应的类型下载安装包文件(.msi);
      点击安装文件安装即可;
      (node官网地址==>https://nodejs.org/zh-cn/download/);
      
      2、检查是否成功安装
      进入cmd命令窗口敲命令行==>
         node -v
      回车，出现node安装的版本号说明安装成功;
           未出现node版本号，请检查第一步node的安装是否正确;
      
      3、检查npm包管理工具
      进入cmd命令窗口敲命令行==> 
          npm -v 
          查看版本号
      (新版的NodeJS已经集成了npm,所以安装好了node,npm也一并安装好了)
      
      4、全局安装Angular CLI
      进入cmd命令窗口敲命令行==> 
          npm install -g @angular/cli
      
      5、MDBui启动运行
      在cmd命令窗口中，cd ==> 进入本地mdbui工程源码根目录;
      1)、输入命令行==>
          npm install
      下载相关的插件包到node_modules文件夹下; 
      2）、输入启动命令行 ==>  
          ng serve
      启动项目，等待编译出现 Compiled successfully. 表示编译完成;
      直接可在浏览器中输入 http://localhost:4201/ ==>即可本地访问MDBui页面;
