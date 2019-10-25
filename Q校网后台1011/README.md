> Q 校网业务综合管理后台

### 访问地址

http://192.168.18.17:1988/#/login?redirect

```javascript
echo "# maxQ" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin git@github.com:Thinkpad93/maxQ.git
git push -u origin master
```

> 代码

```javascript
const ws = new WebSocket("ws://localhost:8080");
```

> 项目结构

- bulid webpack 编辑打包配置目录
- config webpack 配置
- dist 项目打包后的文件
- src 源码

  - module api 接口模块文件
  - assets 资源目录
  - components 组件目录
  - config 配置
  - directive 全局指令
  - element element-UI 库
  - filters 全局过滤
  - images
  - libs
  - mixins 混入
  - mock 模拟数据
  - router vue 路由配置文件
  - store vuex 文件
  - styles less 样式文件
  - utils 工具类函数
  - views 页面
    - content
      - column 栏目管理
      - columntpl 栏目模板
      - final 内容终审
      - playform 学校屏端播放列表
      - playshow 学校屏端播放内容查看页
      - prerelease 内容预发布
      - review 内容复审
      - schoolRelease 学校内容发布确认
      - trial 内容初审
      - upload 我的上传内容列表页
      - uploadContent 我的上传新增
      - uploadContentEdit 我的上传编辑
    - device 设备管理
      - binding 设备列表页
      - monitoring 设备监控页
      - record 设备检修记录页
    - errorpage 错误页，用于 404 跳转显示
    - home 首页
    - label 标签管理
    - layout 后台布局页
    - login 登陆页
    - portalweb
      - add
      - audit
      - edit
      - menu
      - myportal
    - school 学校管理
      - add 学校新增
      - edit 学校编辑
      - list 学校列表
      - views 学校查看
    - sys 系统管理
      - menu 菜单管理
      - role 角色管理
      - user 用户管理
    - weixin 微信端学校管理
      - class 班级管理
      - comment 评论管理
      - list 学校列表
      - schedule 课表管理
      - score 成绩管理
      - student 学生管理
      - teacher 老师管理
    - works 作品管理
      - check 作品审核
      - 作品列表
    - xq 小 Q 智慧
      - behavior 行为管理
      - comment 评论管理
      - lesson 课程管理
      - paper 试卷管理
      - prize 奖励兑换
      - statistics 运营统计
  - App.vue 根组件
  - main.js 项目启动文件（入口）

- static 静态资源目录
- .babelrc babel 配置文件
- .eslint eslint 配置文件
- .postcssrc webpack 处理 css 插件配置
- .package.json npm 配置信息

> 项目选用 elementUI 库，使用版本号可在 package.json 查看，对于遇到 elementUI 开发的问题，建议去官网多看看组件文档说明
> 前端路由是由后端返回的(接口地址为: querySystemMenu)，做了角色权限管理控制，具体代码可查看 src/permission.js 文件
