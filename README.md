# szb_dojo_gdm

#### 介绍
本项目是GIS毕业设计交流参考项目，供GIS专业毕业生做毕业设计参考用，这个系统可塑性强，能稍微改造适应GIS各行各业的应用系统。

#### 软件架构
作为毕业设计交流软件，它技术栈选型理由如下：

1.  前端技术栈     Dojo  +  Openlayers
     选型理由： 国内公司都已经开始 去美化，所以 ArcGis 都已经被国内公司排除在外了， MapGIS 虽说是中国公司，但是这个平台组件 太大型了， 不如 Openlayers 是开源免费的小型地图引擎。  是一个专为Web GIS 客户端开发提供的JavaScript 类库包，用于实现标准格式发布的地图数据访问

2. 后端技术栈      SpringBoot   +   mybatisplus[数据层] + druid[连接池]  + PostgreSQL[空间数据库]
     数据库选择 PostgreSQL，它是业内比较成熟的开源空间数据库，他能支持空间分析和查询，而且他部署比较简单。 同样由于去美化， 我们不选 Oracle 和 SQL server，另外 Oracle太大型了， MySQL 虽说是开源的，但是它不支持空间分析和查询。 这样的技术栈 可以把前端 和 后端 都可以打包到一个 JAR 包里，运行站点只需要 运行 JAR就可以了。

3. 搭建和启动系统方便
    该系统能方便搭建在Window系统里，启动 window 版本的PG数据库后，然后再用bat 运行 jar 包，就可以启动整个系统，便于学生设计答辩给老师演示！

#### 系统数据库创建和安装教程
一、安装 Navicat  

   （1） 运行 navicat12018_premium_cs_x64.exe，来安装 Navicat

     (2)   在运行 Navicat 之前，用 Navicat Premium 12 破解补丁\简体中文64位 破解文件 覆盖安装目录的这两个文件

二、创建表空间
(1)  到 数据库安装机器的 目录  D:\Program Files\PostgreSQL\10\data\ 下，创建文件夹 gdm_data

(2) window 下创建 pg 数据库表空间， 用 Navicat 连接安装好的数据库。 执行下面的脚本

CREATE TABLESPACE gdm_data OWNER postgres LOCATION 'D:\Program Files\PostgreSQL\10\data\gdm_data';
ALTER TABLESPACE gdm_data OWNER TO postgres;
GRANT CREATE ON TABLESPACE gdm_data TO postgres;

三、创建数据库

CREATE DATABASE gdmdb WITH OWNER = postgres ENCODING = 'UTF8' TABLESPACE = gdm_data CONNECTION LIMIT = -1;
GRANT TEMPORARY, CONNECT ON DATABASE gdmdb TO PUBLIC;
GRANT ALL ON DATABASE gdmdb TO postgres;

四、创建用户

CREATE USER gdmuser WITH LOGIN NOSUPERUSER INHERIT  CREATEDB  NOCREATEROLE  REPLICATION  VALID UNTIL 'infinity'  password 'gdmuser'

五、创建模式

CREATE SCHEMA IF NOT EXISTS gdm AUTHORIZATION gdmuser;

六、赋予权限

GRANT all ON SCHEMA gdm to gdmuser;

七、创建 GIS 插件

create extension postgis;

八、执行 function  table view 文件夹里  SQL 创建需要的函数 、表 、视图

#### 系统打包和运行教程

1.  打包JAVA 包
    在程序目录下，在 cmd 运行 mvn install 命令打包 jar 包

2.  在 jar 目录下 在 cmd 运行 java -jar GDM-1.2.1.jar 命令即可启动系统

3.  在chrome 浏览器 里 输入  http://127.0.0.1:8080/ 即可访问系统

#### 系统部署问题联系

   如果您在部署遇到什么问题，或者你需要部署详细资料和对应的安装包，可以扫描旁边的二维码联系到我们！
![输入图片说明](data/%E9%83%A8%E7%BD%B2%E8%B5%84%E6%96%99%E8%BF%9E%E6%8E%A5.png)

