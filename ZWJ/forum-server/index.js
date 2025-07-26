const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let posts = [
  {
    id: 1,
    category: '动漫',
    title: '新番推荐：2025年必追动画',
    content: '本季度有哪些值得一看的新番？来这里一起讨论吧！',
    author: '小明',
    time: '1小时前',
  },
  {
    id: 2,
    category: '图片',
    title: '每日摄影打卡',
    content: '分享你今天拍的美图，欢迎大家点赞评论！',
    author: '摄影控',
    time: '2小时前',
  },
  {
    id: 3,
    category: '生活',
    title: '今天你运动了吗？',
    content: '健康生活，从每天锻炼开始！',
    author: '健康达人',
    time: '3小时前',
  },
    {
    id: 4,
    category: '动漫',
    title: 'cnmcnm',
    content: 'cnm',
    author: 'cnm',
    time: 'cnm',
  },
];

// 获取所有帖子
app.get('/api/posts', (req, res) => {
  const { category } = req.query;
  if (category) {
    res.json(posts.filter(p => p.category === category));
  } else {
    res.json(posts);
  }
});

// 新增帖子
app.post('/api/posts', (req, res) => {
  const post = req.body;
  post.id = posts.length + 1;
  post.time = '刚刚';
  posts.unshift(post);
  res.json({ success: true, post });
});

app.listen(PORT, () => {
  console.log(`Forum server running at http://localhost:${PORT}`);
});


// ...existing code...

// 新增评论到指定帖子
app.patch('/api/posts/:id/comments', (req, res) => {
  const postId = Number(req.params.id);
  const { content, time } = req.body;
  const post = posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: '帖子不存在' });
  }
  // 初始化 comments 字段
  if (!post.comments) post.comments = [];
  // 追加评论
  post.comments.push({ content, time });
  res.json({ success: true, comments: post.comments });
});