<template>
  <div class="forum-layout">
    <!-- 登录界面 -->
    <section v-if="!isLogin" class="login-section">
      <div class="box">
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
              <div class="inputBx">
                <input id="username" type="text" v-model="loginForm.username" required="required" autocomplete="username" />
                <span>用户名</span>
                <i class="fas fa-user-circle"></i>
              </div>
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
        <div class="main-navbar-inner">
          <img src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png" class="main-logo" />
          <span class="main-title">ZWJ论坛</span>
          <div class="main-search">
            <input v-model="search" placeholder="搜索帖子..." />
            <span class="icon">🔍</span>
          </div>
          <button class="main-nav-btn" @click="showForm = true">+ 发帖</button>
          <img class="main-avatar" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=ZWJ" />
          <button class="logout-btn" @click="logout">退出</button>
        </div>
      </header>

      <div class="forum-main-area">
        <!-- Reddit风格左侧栏 -->
        <aside class="reddit-sidebar">
          <div class="reddit-logo-row">
            <img src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png" class="reddit-logo" />
            <span class="reddit-logo-title">reddit</span>
          </div>
          <nav class="reddit-menu">
            <ul>
              <li>
                <a href="#"><span class="reddit-menu-icon">🏠</span> Home</a>
              </li>
              <li>
                <a href="#"><span class="reddit-menu-icon">⭐</span> Popular</a>
              </li>
              <li>
                <a href="#"><span class="reddit-menu-icon">💡</span> Answers <span class="reddit-beta">BETA</span></a>
              </li>
              <li>
                <a href="#"><span class="reddit-menu-icon">🔎</span> Explore</a>
              </li>
              <li>
                <a href="#"><span class="reddit-menu-icon">☰</span> All</a>
              </li>
            </ul>
            <div class="reddit-section-title">CUSTOM FEEDS</div>
            <ul>
              <li>
                <a href="#"><span class="reddit-menu-icon">+</span> Create a custom feed</a>
              </li>
            </ul>
            <div class="reddit-section-title">RECENT</div>
            <ul>
              <li>
                <a href="#"><span class="reddit-menu-icon">r/</span>anime_irl</a>
              </li>
            </ul>
            <div class="reddit-section-title">COMMUNITIES</div>
            <ul>
              <li>
                <a href="#"><span class="reddit-menu-icon">+</span> Create a community</a>
              </li>
              <li>
                <a href="#"><span class="reddit-menu-icon">⚙️</span> Manage communities</a>
              </li>
              <li>
                <a href="#"><span class="reddit-avatar" style="background:#ffb700;">A</span> r/anime</a>
              </li>
              <li>
                <a href="#"><span class="reddit-avatar" style="background:#7c3aed;">M</span> r/Music</a>
              </li>
              <li>
                <a href="#"><span class="reddit-avatar" style="background:#34d399;">G</span> r/Games</a>
              </li>
              <li>
                <a href="#"><span class="reddit-avatar" style="background:#60a5fa;">J</span> r/gaming</a>
              </li>
              <li>
                <a href="#"><span class="reddit-avatar" style="background:#f472b6;">M</span> r/manga</a>
              </li>
            </ul>
            <div class="reddit-section-title">RESOURCES</div>
            <ul>
              <li>
                <a href="#">About Reddit</a>
              </li>
              <li>
                <a href="#">Advertise</a>
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

          <section class="post-list">
            <transition-group name="list" tag="div">
              <div
                v-for="post in filteredPosts"
                :key="post.id"
                class="post-card"
              >
                <div class="post-bar"></div>
                <div class="post-content-area">
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
                  <h2 class="post-title">{{ post.title }}</h2>
                  <div v-if="post.video">
                    <video
                      class="post-video"
                      controls
                      :src="post.video"
                    >
                      您的浏览器不支持 video 标签。
                    </video>
                  </div>
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
                  <!-- 评论区开始 -->
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
                  <!-- 评论区结束 -->
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

// 登录相关
const isLogin = ref(false);
const showPwd = ref(false);
const loginForm = reactive({
  username: '',
  password: ''
});
function handleLogin() {
  if (loginForm.username && loginForm.password) {
    isLogin.value = true;
  } else {
    alert('请输入用户名和密码');
  }
}
function logout() {
  isLogin.value = false;
  loginForm.username = '';
  loginForm.password = '';
}

// 论坛原有逻辑
const categories = [
  { name: '动漫', icon: '🎬', color: '#a78bfa' },
  { name: '音乐', icon: '🎵', color: '#60a5fa' },
  { name: '数码', icon: '💻', color: '#34d399' },
  { name: '游戏', icon: '🎮', color: '#f472b6' },
  { name: '生活', icon: '🌈', color: '#fbbf24' }
];
const selected = ref('动漫');
const navActive = ref('社区中心');
const posts = ref([]);
const showForm = ref(false);
const loading = ref(false);
const search = ref('');
const form = ref({
  category: '',
  title: '',
  content: '',
  author: '',
  video: ''
});
const commentInputs = reactive({});
watchEffect(() => {
  posts.value.forEach(post => {
    if (!commentInputs[post.id]) {
      commentInputs[post.id] = { content: '' };
    }
  });
});
function categoryColor(catName) {
  const cat = categories.find(c => c.name === catName);
  return cat ? cat.color : '#a78bfa';
}
async function fetchPosts() {
  loading.value = true;
  let url = '';
  if (navActive.value === '社区中心') {
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
function changeCategory(cat) {
  selected.value = cat;
  fetchPosts();
}
const filteredPosts = computed(() => {
  if (!search.value) return posts.value;
  return posts.value.filter(
    p =>
      p.title.includes(search.value) ||
      p.content.includes(search.value) ||
      p.author.includes(search.value)
  );
});
watchEffect(fetchPosts);
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

* {
  margin: 0;
  padding: 0;
  font-family: 'El Messiri', sans-serif;
}

body {
  background: #031323;
  overflow: hidden;
}

.fas {
  width: 32px;
}

/* Reddit风格左侧栏 */
.reddit-sidebar {
  width: 270px;
  min-width: 220px;
  background: #fff;
  border-right: 1px solid #f0f1f2;
  min-height: 100vh;
  padding: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}
.reddit-logo-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 18px 0 18px 24px;
}
.reddit-logo {
  width: 32px;
  height: 32px;
}
.reddit-logo-title {
  font-size: 1.35rem;
  font-weight: bold;
  color: #ff4500;
  letter-spacing: 1px;
}
.reddit-menu {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 0 0;
}
.reddit-menu ul {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
}
.reddit-menu li {
  margin: 0;
}
.reddit-menu a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  color: #222;
  text-decoration: none;
  border-radius: 6px;
  font-size: 1rem;
  transition: background 0.15s, color 0.15s;
  font-weight: 500;
}
.reddit-menu a:hover {
  background: #f6f7f8;
  color: #ff4500;
}
.reddit-menu-icon {
  width: 24px;
  text-align: center;
  font-size: 1.15rem;
}
.reddit-beta {
  background: #ede9fe;
  color: #a78bfa;
  border-radius: 6px;
  font-size: 0.8em;
  padding: 2px 6px;
  margin-left: 4px;
}
.reddit-section-title {
  color: #7c3aed;
  font-size: 0.92rem;
  font-weight: bold;
  margin: 14px 0 6px 24px;
  letter-spacing: 1px;
}
.reddit-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 1em;
  margin-right: 2px;
}
@media (max-width: 900px) {
  .reddit-sidebar {
    display: none;
  }
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
.forum-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f6f7f8;
}
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
  max-width: 1200px;
  margin: 0 auto;
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
  flex: 1;
  max-width: 400px;
  margin: 0 18px;
  position: relative;
}
.main-search input {
  width: 100%;
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
}
.forum-footer {
  text-align: center;
  padding: 16px 0;
  background: #ede9fe;
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
  background: #fff;
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
  .reddit-sidebar {
    display: none;
  }
  .main-content {
    padding: 0;
  }
  .post-list {
    max-width: 98vw;
    padding: 0 2vw;
  }
}
@media (max-width: 600px) {
  .main-navbar-inner {
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
</style>