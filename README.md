1. forum-server 后端服务目录
index.js
Node.js 后端主入口文件。主要功能：

启动 Express 服务，监听 3001 端口
连接 SQL Server 数据库（ZWJ 库）
提供 API 接口，包括：
/api/posts：获取所有帖子、按分区筛选帖子
/api/posts（POST）：新增帖子（支持视频链接）
/api/posts/:id/comments：给指定帖子添加评论
/api/register：用户注册
/api/login：用户登录校验
处理跨域（CORS），解析 JSON 请求体
package.json
后端依赖和脚本配置文件。记录所需 npm 包（如 express、mssql、cors）和启动命令。

node_modules/
自动生成，存放所有后端依赖包。无需手动修改。

2. forum-vue 前端服务目录
src/
前端源码目录，主要包含：

App.vue
论坛主页面组件，包含所有核心功能和样式：

登录界面（用户名、密码输入，调用后端 /api/login 校验）
论坛主界面（分区导航、发帖、评论、帖子展示、视频展示）
发帖弹窗（支持填写视频链接）
评论区（支持评论提交和展示）
搜索、分区切换、导航栏、退出登录等
响应式布局和美化样式
main.js/main.ts
Vue 项目入口文件，挂载 App.vue 到页面。

assets/
存放图片、图标、样式等静态资源。

public/
前端静态资源目录，通常放 favicon、图片等，直接通过 /img/xxx.ico 访问。

vite.config.js
Vite 配置文件，设置开发端口（5173）、代理（让前端 /api 请求自动转发到后端 3001 端口）。

package.json
前端依赖和脚本配置文件，记录所需 npm 包（如 vue、vite）和启动命令。

node_modules/
自动生成，存放所有前端依赖包。无需手动修改。

3. 数据库相关
SQL Server 数据库（ZWJ）
包含以下表：
Posts：存储帖子内容（分区、标题、正文、作者、视频链接等）
Comments：存储评论内容（关联帖子ID、评论内容、时间等）
Users：存储用户账号和密码（用于登录校验）
4. 其他常见文件
README.md
项目说明文档，介绍项目功能、安装和使用方法。

.gitignore
Git 忽略文件，防止上传 node_modules、dist 等不需要的文件夹。

5. 主要功能流程说明
登录
用户输入用户名和密码，前端调用 /api/login，后端校验数据库，成功后进入论坛主界面。

发帖
登录后可点击“发帖”按钮，填写分区、标题、内容、作者和视频链接，前端调用 /api/posts（POST），后端存入数据库。

评论
在帖子下方输入评论内容，前端调用 /api/posts/:id/comments，后端存入数据库并返回所有评论。

视频展示
发帖时填写视频链接（如 mp4 或视频网站），前端自动用 <video> 标签展示视频。

分区导航/搜索
支持分区切换、帖子搜索、热门/问答/探索等导航。
