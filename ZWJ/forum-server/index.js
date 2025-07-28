const express = require('express'); // 引入 express 框架
const cors = require('cors');       // 引入跨域中间件
const app = express();              // 创建 express 应用
const PORT = 3001;                  // 设置后端端口
const sql = require('mssql');       // 引入 mssql 库用于连接 SQL Server

app.use(cors());                    // 允许跨域请求
app.use(express.json());            // 解析 JSON 请求体

// SQL Server 数据库配置
const config = {
  user: 'sa',                      // 数据库用户名
  password: 'sql2k8_',             // 数据库密码
  server: 'localhost',             // 数据库服务器地址
  database: 'ZWJ',                 // 数据库名称
  options: {
    encrypt: false,                // 本地连接可为 false
    trustServerCertificate: true   // 信任自签名证书
  }
};

// 启动时连接一次数据库
sql.connect(config)
  .then(() => console.log('SQL Server 连接成功'))
  .catch(err => console.error('SQL Server 连接失败:', err));

// 获取所有帖子（支持分区筛选）
app.get('/api/posts', async (req, res) => {
  const { category } = req.query; // 获取查询参数 category
  try {
    let query = 'SELECT * FROM Posts'; // 查询所有帖子
    if (category) {
      // 如果有分区筛选，拼接 WHERE 条件
      query += ' WHERE category = @category';
      const request = new sql.Request();
      request.input('category', sql.NVarChar, category);
      const result = await request.query(query);
      res.json(result.recordset); // 返回筛选后的帖子
    } else {
      const result = await sql.query(query);
      res.json(result.recordset); // 返回所有帖子
    }
  } catch (err) {
    res.status(500).send('数据库错误'); // 查询失败返回 500
  }
});

// 新增帖子
app.post('/api/posts', async (req, res) => {
  // 从请求体获取帖子内容
  const { category, title, content, author, video } = req.body;
  try {
    // 使用参数化防止 SQL 注入
    const request = new sql.Request();
    request.input('category', sql.NVarChar, category);
    request.input('title', sql.NVarChar, title);
    request.input('content', sql.NVarChar, content);
    request.input('author', sql.NVarChar, author);
    request.input('video', sql.NVarChar, video);
    await request.query(
      'INSERT INTO Posts (category, title, content, author, video) VALUES (@category, @title, @content, @author, @video)'
    );
    res.json({ success: true }); // 插入成功返回 success
  } catch (err) {
    res.status(500).send('数据库错误'); // 插入失败返回 500
  }
});

// 新增评论到指定帖子
// 假设有 Comments 表，字段：postId, content, time
app.patch('/api/posts/:id/comments', async (req, res) => {
  const postId = Number(req.params.id); // 获取帖子 id
  const { content, time } = req.body;   // 获取评论内容和时间
  try {
    // 使用参数化防止 SQL 注入
    const request = new sql.Request();
    request.input('postId', sql.Int, postId);
    request.input('content', sql.NVarChar, content);
    request.input('time', sql.NVarChar, time);
    await request.query(
      'INSERT INTO Comments (postId, content, time) VALUES (@postId, @content, @time)'
    );
    // 查询该帖子的所有评论并返回
    const result = await request.query(
      'SELECT * FROM Comments WHERE postId = @postId'
    );
    res.json({ success: true, comments: result.recordset });
  } catch (err) {
    res.status(500).send('数据库错误'); // 插入或查询失败返回 500
  }
});

// 启动后端服务并监听端口
app.listen(PORT, () => {
  console.log(`Forum server running at http://localhost:${PORT}`);
});

// 注册接口
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const request = new sql.Request();
    request.input('username', sql.NVarChar, username);
    request.input('password', sql.NVarChar, password); // 实际项目建议加密
    await request.query(
      'INSERT INTO Users (username, password) VALUES (@username, @password)'
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).send('注册失败，用户名可能已存在');
  }
});

// 登录接口
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const request = new sql.Request();
    request.input('username', sql.NVarChar, username);
    request.input('password', sql.NVarChar, password);
    const result = await request.query(
      'SELECT * FROM Users WHERE username = @username AND password = @password'
    );
    if (result.recordset.length > 0) {
      res.json({ success: true, user: result.recordset[0] });
    } else {
      res.json({ success: false, message: '用户名或密码错误' });
    }
  } catch (err) {
    res.status(500).send('登录失败');
  }
});