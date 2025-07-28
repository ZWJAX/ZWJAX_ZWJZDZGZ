<template>
  <div class="forum-layout">
    <!-- 登录界面 -->
    <section v-if="!isLogin" class="login-section">
      <div class="box">
        <!-- 背景动画方块 -->
        <div class="square" style="--i:0;"></div>
        <div class="square" style="--i:1;"></div>
        <div class="square" style="--i:2;"></div>
        <div class="square" style="--i:3;"></div>
        <div class="square" style="--i:4;"></div>
        <div class="square" style="--i:5;"></div>
        <div class="container">
          <div class="form">
            <h2>欢迎登录 ZWJ论坛</h2>
            <form @submit.prevent="handleLogin">
              <!-- 用户名输入框 -->
              <div class="inputBx">
                <input id="username" type="text" v-model="loginForm.username" required="required" autocomplete="username" />
                <span>用户名</span>
                <i class="fas fa-user-circle"></i>
              </div>
              <!-- 密码输入框 -->
              <div class="inputBx password">
                <input
                  id="password-input"
                  :type="showPwd ? 'text' : 'password'"
                  v-model="loginForm.password"
                  required="required"
                  autocomplete="current-password"
                />
                <span>密码</span>
                <a href="#" class="password-control" :class="{view: showPwd}" @click.prevent="showPwd = !showPwd"></a>
                <i class="fas fa-key"></i>
              </div>
              <!-- 记住我复选框 -->
              <label class="remember"><input type="checkbox" /> 记住我</label>
              <div class="inputBx">
                <input type="submit" value="登录" />
              </div>
            </form>
            <p>忘记密码？ <a href="#">点击这里</a></p>
            <p>没有账号？<a href="#">注册</a></p>
          </div>
        </div>
      </div>
    </section>
    <!-- 论坛主界面 -->
    <div v-else>
      <!-- 顶部主导航栏 -->
      <header class="main-navbar">
        <div class="main-navbar-inner new-navbar">
          <!-- 左侧LOGO和标题 -->
          <div class="navbar-left forum-logo-title">
            <img src="/img/论坛.ico" class="main-logo big-logo" />
            <span class="main-title big-title">ZWJ论坛</span>
          </div>
          <!-- 中间导航菜单 -->
          <nav class="navbar-center">
            <ul>
              <li :class="{active: navActive==='首页'}" @click="navActive='首页';fetchPosts()">
                <img src="/img/首页.ico" style="width:20px;height:20px;vertical-align:middle;margin-right:4px;" />首页
              </li>
              <li :class="{active: navActive==='热门'}" @click="navActive='热门';fetchPosts()">
                <img src="/img/热门.ico" style="width:20px;height:20px;vertical-align:middle;margin-right:4px;" />热门
              </li>
              <li :class="{active: navActive==='问答'}" @click="navActive='问答';fetchPosts()">
                <img src="/img/问答.ico" style="width:20px;height:20px;vertical-align:middle;margin-right:4px;" />问答
              </li>
              <li :class="{active: navActive==='探索'}" @click="navActive='探索';fetchPosts()">
                <img src="/img/探索.ico" style="width:20px;height:20px;vertical-align:middle;margin-right:4px;" />探索
              </li>
              <li :class="{active: navActive==='全部'}" @click="navActive='全部';fetchPosts()">
                <img src="/img/全部.ico" style="width:20px;height:20px;vertical-align:middle;margin-right:4px;" />全部
              </li>
            </ul>
          </nav>
          <!-- 右侧搜索、头像、退出按钮 -->
          <div class="navbar-right">
            <div class="main-search">
              <input v-model="search" placeholder="搜索帖子..." />
              <span class="icon">🔍</span>
            </div>
            <button class="main-nav-btn" @click="showForm = true">+ 发帖</button>
            <img class="main-avatar" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=ZWJ" />
            <button class="logout-btn" @click="logout">退出</button>
          </div>
        </div>
      </header>

      <div class="forum-main-area">
        <!-- 左侧分区栏 -->
        <aside class="zh-sidebar">
          <div class="zh-sidebar-title">分类</div>
          <nav>
            <ul>
              <li v-for="cat in categories" :key="cat.name" :class="{active: selected===cat.name}" @click="changeCategory(cat.name)">
                <span class="zh-sidebar-icon">
                  <!-- 分类图标 -->
                  <img v-if="cat.name==='动漫'" src="/img/动漫.ico" style="width:22px;height:22px;vertical-align:middle;" />
                  <img v-else-if="cat.name==='影视'" src="/img/影视.ico" style="width:22px;height:22px;vertical-align:middle;" />
                  <img v-else-if="cat.name==='游戏'" src="/img/游戏.ico" style="width:22px;height:22px;vertical-align:middle;" />
                  <img v-else-if="cat.name==='情感'" src="/img/情感.ico" style="width:22px;height:22px;vertical-align:middle;" />
                  <img v-else-if="cat.name==='数码'" src="/img/数码.ico" style="width:22px;height:22px;vertical-align:middle;" />
                  <img v-else-if="cat.name==='车'" src="/img/车.ico" style="width:22px;height:22px;vertical-align:middle;" />
                  <img v-else-if="cat.name==='房'" src="/img/房.ico" style="width:22px;height:22px;vertical-align:middle;" />
                  <template v-else>{{ cat.icon }}</template>
                </span>
                <span>{{ cat.name }}</span>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- 右侧内容区 -->
        <main class="main-content">
          <!-- 加载动画 -->
          <transition name="fade">
            <div v-if="loading" class="loading-mask">
              <div class="loader"></div>
            </div>
          </transition>

          <!-- 帖子列表 -->
          <section class="post-list">
            <transition-group name="list" tag="div">
              <div
                v-for="post in filteredPosts"
                :key="post.id"
                class="post-card"
              >
                <div class="post-bar"></div>
                <div class="post-content-area">
                  <!-- 帖子头部信息 -->
                  <div class="post-header">
                    <span class="post-category" :style="{color: categoryColor(post.category)}">/r/{{ post.category }}</span>
                    <span class="post-dot">•</span>
                    <span class="post-author">
                      <img :src="`https://api.dicebear.com/7.x/pixel-art/svg?seed=${post.author}`" class="mini-avatar" />
                      {{ post.author }}
                    </span>
                    <span class="post-dot">•</span>
                    <span class="post-time">{{ post.time }}</span>
                  </div>
                  <!-- 帖子标题 -->
                  <h2 class="post-title">{{ post.title }}</h2>
                  <!-- 视频内容 -->
                  <div v-if="post.video">
                    <video
                      class="post-video"
                      controls
                      :src="post.video"
                    >
                      您的浏览器不支持 video 标签。
                    </video>
                  </div>
                  <!-- 帖子正文 -->
                  <p class="post-content">{{ post.content }}</p>
                  <div class="post-footer">
                    <div class="post-actions">
                      <span class="action-btn" title="点赞">
                        ▲ 赞
                      </span>
                      <span class="action-btn" title="评论">
                        💬 评论
                      </span>
                      <span class="action-btn" title="分享">
                        ⭳ 分享
                      </span>
                    </div>
                  </div>
                  <!-- 评论区 -->
                  <div class="post-comments">
                    <div class="comment-list" v-if="post.comments && post.comments.length">
                      <div class="comment-item" v-for="(c, idx) in post.comments" :key="idx">
                        <span class="comment-content">{{ c.content }}</span>
                        <span class="comment-time">{{ c.time }}</span>
                      </div>
                    </div>
                    <form class="comment-form" @submit.prevent="submitComment(post)">
                      <input v-model="commentInputs[post.id].content" placeholder="写下你的评论..." required maxlength="100" />
                      <button type="submit">评论</button>
                    </form>
                  </div>
                </div>
              </div>
            </transition-group>
            <div v-if="!loading && filteredPosts.length === 0" class="empty">暂无帖子，快来发帖吧！</div>
          </section>

          <!-- 悬浮发帖按钮 -->
          <button class="fab" @click="showForm = !showForm" title="发帖">
            <svg width="28" height="28" fill="#fff" viewBox="0 0 24 24"><path d="M12 5v14m7-7H5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
          </button>

          <!-- 发帖弹窗 -->
          <div v-if="showForm" class="modal-mask" @click.self="showForm = false">
            <form class="modal-form" @submit.prevent="submitPost">
              <h3>发布新帖子</h3>
              <select v-model="form.category" required>
                <option disabled value="">选择分区</option>
                <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
              </select>
              <input v-model="form.title" placeholder="标题" required />
              <textarea v-model="form.content" placeholder="内容" required></textarea>
              <input v-model="form.author" placeholder="作者" required />
              <input v-model="form.video" placeholder="视频链接（可选）" />
              <div class="modal-actions">
                <button type="button" @click="showForm = false">取消</button>
                <button type="submit" class="post-btn">提交</button>
              </div>
            </form>
          </div>
          <!-- 页脚 -->
          <footer class="forum-footer">
            ZWJ论坛 © 2025
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, reactive } from 'vue';

// 登录相关状态
const isLogin = ref(false); // 是否已登录
const showPwd = ref(false); // 密码是否可见
const loginForm = reactive({
  username: '',
  password: ''
});
// 登录处理
async function handleLogin() {
  if (!loginForm.username || !loginForm.password) {
    alert('请输入用户名和密码');
    return;
  }
  // 调用后端接口校验
const res = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: loginForm.username,
    password: loginForm.password
  })
});
  const data = await res.json();
  if (data.success) {
    isLogin.value = true; // 登录成功才进入论坛
  } else {
    alert(data.message); // 登录失败弹窗
  }
}
// 退出登录
function logout() {
  isLogin.value = false;
  loginForm.username = '';
  loginForm.password = '';
}

// 中文分区数据
const categories = [
  { name: '动漫', icon: 'img', color: '#a78bfa' },
  { name: '影视', icon: '🎥', color: '#fbbf24' },
  { name: '游戏', icon: '🎮', color: '#f472b6' },
  { name: '情感', icon: '🌈', color: '#34d399' },
  { name: '数码', icon: '💻', color: '#60a5fa' },
  { name: '车', icon: '🚗', color: '#7c3aed' },
  { name: '房', icon: '🏠', color: '#ffb700' }
];
const selected = ref('动漫'); // 当前选中的分区
const navActive = ref('首页'); // 当前导航激活项
const posts = ref([]); // 帖子列表
const showForm = ref(false); // 是否显示发帖弹窗
const loading = ref(false); // 加载动画
const search = ref(''); // 搜索关键字
const form = ref({
  category: '',
  title: '',
  content: '',
  author: '',
  video: ''
}); // 发帖表单
const commentInputs = reactive({}); // 评论输入框内容

// 监听帖子变化，初始化评论输入框
watchEffect(() => {
  posts.value.forEach(post => {
    if (!commentInputs[post.id]) {
      commentInputs[post.id] = { content: '' };
    }
  });
});

// 获取分区颜色
function categoryColor(catName) {
  const cat = categories.find(c => c.name === catName);
  return cat ? cat.color : '#a78bfa';
}

// 获取帖子
async function fetchPosts() {
  loading.value = true;
  let url = '';
  if (navActive.value === '首页') {
    url = `http://localhost:3001/api/posts?category=${selected.value}`;
  } else {
    url = `http://localhost:3001/api/posts`;
  }
  try {
    const res = await fetch(url);
    posts.value = await res.json();
  } catch (e) {
    posts.value = [];
    alert('无法连接后端服务，请检查Node.js后端是否启动！');
  } finally {
    setTimeout(() => { loading.value = false; }, 500);
  }
}

// 切换分区
function changeCategory(cat) {
  selected.value = cat;
  navActive.value = '首页';
  fetchPosts();
}

// 搜索过滤
const filteredPosts = computed(() => {
  if (!search.value) return posts.value;
  return posts.value.filter(
    p =>
      p.title.includes(search.value) ||
      p.content.includes(search.value) ||
      p.author.includes(search.value)
  );
});

// 监听导航或分区变化自动获取帖子
watchEffect(fetchPosts);

// 发帖
async function submitPost() {
  if (!form.value.category || !form.value.title || !form.value.content || !form.value.author) return;
  loading.value = true;
  await fetch('http://localhost:3001/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  });
  showForm.value = false;
  form.value = { category: '', title: '', content: '', author: '', video: '' };
  await fetchPosts();
  loading.value = false;
}

// 评论
async function submitComment(post) {
  const input = commentInputs[post.id];
  if (!input.content) return;
  await fetch(`http://localhost:3001/api/posts/${post.id}/comments`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: input.content,
      time: new Date().toLocaleString()
    })
  });
  input.content = '';
  await fetchPosts();
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=El+Messiri:wght@700&display=swap');

/* 全局基础样式 */
* {
  margin: 0;
  padding: 0;
  font-family: 'El Messiri', sans-serif;
}

body {
  /* 使用 img 文件夹下的草原图片作为背景 */
  background: url('/img/草原.jpg') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
}

.fas {
  width: 32px;
}

/* 新顶部导航栏布局 */
.new-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.navbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.navbar-center ul {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar-center li {
  display: flex;
  align-items: center;
  flex-direction: row;
  font-size: 1.08rem;
  color: #7c3aed;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 18px;
  border-radius: 18px;
  transition: background 0.2s, color 0.2s;
  background: none;
  white-space: nowrap;
}
.navbar-center li img {
  margin-right: 6px;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  white-space: nowrap;
}
.navbar-center li.active,
.navbar-center li:hover {
  background: #ede9fe;
  color: #ff4500;
  white-space: nowrap;
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* 中文分区左侧栏 */
.zh-sidebar {
  width: 170px;
  min-width: 120px;
   background: white;
  border-right: 1px solid #f0f1f2;
  min-height: 100vh;
  padding: 24px 0 24px 0;
  display: flex;
  flex-direction: column;
  z-index: 10;
}
.zh-sidebar-title {
  font-size: 1.18rem;
  font-weight: bold;
  color: #7c3aed;
  padding: 0 20px 14px 20px;
  letter-spacing: 2px;
}
.zh-sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.zh-sidebar nav li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  font-size: 1.08rem;
  color: #7c3aed;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  transition: background 0.15s, color 0.15s;
  font-weight: 500;
}
.zh-sidebar nav li.active,
.zh-sidebar nav li:hover {
  background:transparent;
  color: #ff4500;
}
.zh-sidebar-icon {
  font-size: 1.2em;
}

/* 隐藏原reddit-sidebar */
.reddit-sidebar {
  display: none !important;
}

/* 登录界面美化增强样式 */
section.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 10s ease infinite;
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  z-index: 999;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.box {
  position: relative;
}
.box .square {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  animation: square 10s linear infinite;
  animation-delay: calc(-1s * var(--i));
}
@keyframes square {
  0%,100% { transform: translateY(-20px);}
  50% { transform: translateY(20px);}
}
.box .square:nth-child(1) {
  width: 100px;
  height: 100px;
  top: -15px;
  right: -45px;
}
.box .square:nth-child(2) {
  width: 150px;
  height: 150px;
  top: 105px;
  left: -125px;
  z-index: 2;
}
.box .square:nth-child(3) {
  width: 60px;
  height: 60px;
  bottom: 85px;
  right: -45px;
  z-index: 2;
}
.box .square:nth-child(4) {
  width: 50px;
  height: 50px;
  bottom: 35px;
  left: -95px;
}
.box .square:nth-child(5) {
  width: 50px;
  height: 50px;
  top: -15px;
  left: -25px;
}
.box .square:nth-child(6) {
  width: 85px;
  height: 85px;
  top: 165px;
  right: -155px;
  z-index: 2;
}

.container {
  position: relative;
  padding: 50px;
  width: 260px;
  min-height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
}

.container::after {
  content: '';
  position: absolute;
  top: 5px;
  right: 5px;
  bottom: 5px;
  left: 5px;
  border-radius: 5px;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 2%);
}

.form {
  position: relative;
  width: 100%;
  height: 100%;
}
.form h2 {
  color: #fff;
  letter-spacing: 2px;
  margin-bottom: 30px;
}
.form .inputBx {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}
.form .inputBx input {
  width: 80%;
  outline: none;
  border: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 10px;
  padding-left: 40px;
  border-radius: 15px;
  color: #fff;
  font-size: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}
.form .inputBx .password-control {
  position: absolute;
  top: 11px;
  right: 10px;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url(https://snipp.ru/demo/495/view.svg) 0 0 no-repeat;
  transition: 0.5s;
}
.form .inputBx .view {
  background: url(https://snipp.ru/demo/495/no-view.svg) 0 0 no-repeat;
  transition: 0.5s;
}
.form .inputBx .fas {
  position: absolute;
  top: 13px;
  left: 13px;
}
.form .inputBx input[type="submit"] {
  background: #fff;
  color: #111;
  max-width: 100px;
  padding: 8px 10px;
  box-shadow: none;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 1.5s;
}
.form .inputBx input[type="submit"]:hover {
  background: linear-gradient(115deg, rgba(0,0,0,0.10), rgba(255,255,255,0.25));
  color: #fff;
  transition: .5s;
}
.form .inputBx input::placeholder {
  color: #fff;
}
.form .inputBx span {
  position: absolute;
  left: 30px;
  padding: 10px;
  display: inline-block;
  color: #fff;
  transition: .5s;
  pointer-events: none;
}
.form .inputBx input:focus ~ span,
.form .inputBx input:valid ~ span {
  transform: translateX(-30px) translateY(-25px);
  font-size: 12px;
}
.form p {
  color: #fff;
  font-size: 15px;
  margin-top: 5px;
}
.form p a {
  color: #fff;
}
.form p a:hover {
  background-color: #000;
  background-image: linear-gradient(to right, #434343 0%, black 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.remember {
  position: relative;
  display: inline-block;
  color: #fff;
  margin-bottom: 10px;
  cursor: pointer;
}

/* 其余论坛样式保持不变 ... */
/* .forum-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f6f7f8;
}*/
.main-navbar {
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 12px #a78bfa11;
  border-bottom: 1.5px solid #ede9fe;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.main-navbar-inner {
  /* max-width: 1200px; */
  /* margin: 0 auto; */
  
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 12px 24px;
}
.main-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  margin-right: 10px;
}
.main-title {
  color: #ff4500;
  font-weight: bold;
  font-size: 1.4rem;
  margin-right: 18px;
}
.main-search {
  display: flex;
  align-items: center;
  max-width: 260px;
  margin: 0;
  position: relative;
}
.main-search input {
  width: 140px;
  padding: 8px 32px 8px 12px;
  border-radius: 20px;
  border: 1.5px solid #ede9fe;
  background: #f6f7f8;
  font-size: 1rem;
  color: #7c3aed;
  outline: none;
}
.main-search .icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #a78bfa;
  font-size: 1.1rem;
}
.main-nav-btn {
  background: #ff4500;
  border: none;
  color: #fff;
  font-size: 1.08rem;
  padding: 8px 22px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 8px #a78bfa09;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s;
  margin: 0 4px;
}
.main-nav-btn:hover {
  background: #d93a00;
}
.main-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #ff4500;
}
.logout-btn {
  background: #ede9fe;
  color: #a78bfa;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 1rem;
  margin-left: 16px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.logout-btn:hover {
  background: #a78bfa;
  color: #fff;
}
.forum-main-area {
  display: flex;
  flex: 1;
  min-height: 0;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0;
    background: transparent; /* 半透明白色 */
  /* 毛玻璃效果，可选 */
}
.forum-footer {
  text-align: center;
  padding: 16px 0;
  background:transparent;
  color: #7c3aed;
  font-size: 1rem;
  letter-spacing: 1px;
  margin-top: 32px;
}
.post-list {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 36px 0 48px 0;
}
.post-card {
  display: flex;
  flex-direction: column;
  background: #fff; /* 白色背景 */
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  margin-bottom: 18px;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s, border 0.2s;
  position: relative;
  overflow: hidden;
  animation: fadein 0.5s;
}
.post-card:hover {
  box-shadow: 0 4px 24px #a78bfa33;
  border: 1.5px solid #a78bfa;
}
.post-bar {
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%);
  border-radius: 12px 12px 0 0;
  margin-bottom: 0;
}
.post-content-area {
  padding: 18px 22px 12px 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.98rem;
  color: #6b7280;
  margin-bottom: 0;
}
.post-category {
  font-weight: bold;
  color: #a78bfa;
  font-size: 1.02rem;
}
.post-dot {
  color: #bdbdbd;
  font-size: 1.1em;
}
.post-time {
  font-size: 0.92rem;
  color: #bdb5e6;
}
.post-title {
  font-size: 1.22rem;
  font-weight: 700;
  color: #23272f;
  margin: 0 0 2px 0;
  line-height: 1.3;
}
.post-content {
  color: #374151;
  font-size: 1.05rem;
  margin-bottom: 0;
  line-height: 1.7;
}
.post-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  border-top: 1px solid #f3f4f6;
  padding-top: 10px;
}
.post-author {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #a78bfa;
  font-size: 0.98rem;
}
.mini-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ede9fe;
  border: 1.5px solid #a78bfa;
}
.post-actions {
  display: flex;
  gap: 16px;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #878a8c;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  padding: 4px 10px;
  border-radius: 16px;
  transition: background 0.15s, color 0.15s;
}
.action-btn:hover {
  background: #f6f7f8;
  color: #ff4500;
}
.post-video {
  width: 100%;
  max-height: 320px;
  margin: 10px 0 0 0;
  border-radius: 8px;
  box-shadow: 0 2px 12px #a78bfa22;
  background: #000;
}
.post-comments {
  margin-top: 12px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px 14px;
  border: 1px solid #ede9fe;
}
.comment-list {
  margin-bottom: 6px;
}
.comment-item {
  font-size: 0.98rem;
  color: #7c3aed;
  margin-bottom: 2px;
  display: flex;
  gap: 8px;
  align-items: center;
}
.comment-content {
  color: #4b5563;
  margin: 0 8px;
}
.comment-time {
  color: #bdb5e6;
  font-size: 0.92rem;
}
.comment-form {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.comment-form input {
  border: 1px solid #a78bfa;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.98rem;
  flex: 1;
}
.comment-form button {
  background: #a78bfa;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.comment-form button:hover {
  background: #7c3aed;
}
.empty {
  text-align: center;
  color: #a78bfa;
  padding: 40px 0;
  font-size: 1.2rem;
}
.fab {
  position: fixed;
  right: 48px;
  bottom: 48px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 24px #a78bfa55;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}
.fab:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
}
.modal-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(60, 0, 100, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-form {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px #a78bfa55;
  padding: 32px 28px 24px 28px;
  min-width: 320px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: popin 0.2s;
}
@keyframes popin {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.modal-form h3 {
  margin: 0 0 8px 0;
  color: #7c3aed;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
}
.modal-form select,
.modal-form input,
.modal-form textarea {
  border: 1.5px solid #a78bfa;
  border-radius: 8px;
  padding: 10px;
  font-size: 1rem;
  resize: none;
}
.modal-form textarea {
  min-height: 60px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 8px;
}
.modal-actions button {
  background: #ede9fe;
  color: #7c3aed;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.modal-actions .post-btn {
  background: #a78bfa;
  color: #fff;
}
.modal-actions .post-btn:hover {
  background: #7c3aed;
}
/* 加载动画 */
.loading-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(180, 150, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.loader {
  border: 6px solid #ede9fe;
  border-top: 6px solid #a78bfa;
  border-radius: 50%;
  width: 54px;
  height: 54px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.list-enter-active, .list-leave-active {
  transition: all 0.4s;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
@media (max-width: 900px) {
  .forum-main-area {
    flex-direction: column;
  }
  .zh-sidebar {
    display: none;
  }
  .main-content {
    padding: 0;
  }
  .post-list {
    max-width: 98vw;
    padding: 0 2vw;
  }
  .forum-logo-title {
    justify-content: center;
    margin-bottom: 8px;
  }
  .big-logo {
    width: 38px !important;
    height: 38px !important;
  }
  .big-title {
    font-size: 1.3rem !important;
  }
}
@media (max-width: 600px) {
  .main-navbar-inner.new-navbar {
    flex-direction: column;
    gap: 12px;
    padding: 12px 0 8px 0;
  }
  .main-logo {
    margin-right: 0;
    }
  .fab {
    right: 16px;
    bottom: 16px;
    width: 48px;
    height: 48px;
    font-size: 1.3rem;
  }
  .modal-form {
    padding: 18px 8px 12px 8px;
        min-width: 0;
  }
}
.forum-logo-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: none;
  margin-right: 32px;
}
.big-logo {
  width: 52px !important;
  height: 52px !important;
  margin-right: 14px !important;
}
.big-title {
  font-size: 2.1rem !important;
  font-weight: bold;
  color: #ff4500;
  letter-spacing: 2px;
}
.zh-sidebar-title {
  font-size: 1.18rem;
  font-weight: bold;
  color: #7c3aed;
  padding: 0 20px 14px 20px;
  letter-spacing: 2px;
}
.new-navbar {
  align-items: flex-start !important;
}
.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: flex-end;
}
@media (max-width: 900px) {
  .forum-logo-title {
    justify-content: center;
    margin-bottom: 8px;
  }
  .big-logo {
    width: 38px !important;
    height: 38px !important;
  }
  .big-title {
    font-size: 1.3rem !important;
      }
}
</style>


<style>
body {
  background: url('/img/草原.jpg') no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
}
</style>