# 灵感记录APP

一个美观实用的移动端灵感记录应用，帮助用户随时捕捉和管理创意想法。

## 功能特性

- 📝 快速记录灵感想法
- 🏷️ 按分类组织灵感（工作、生活、创意、学习）
- 🔍 搜索和筛选灵感内容
- ⭐ 收藏重要灵感
- 📱 响应式设计，适配各种设备
- 🎨 现代化UI设计

## 技术栈

- React Native + Expo
- TypeScript
- Expo Router (文件路由)
- Lucide React Native (图标)

## 项目结构

```
app/
├── (tabs)/                 # Tab导航页面
│   ├── _layout.tsx        # Tab布局配置
│   ├── index.tsx          # 灵感列表页
│   ├── add.tsx            # 添加灵感页
│   ├── favorites.tsx      # 收藏页
│   └── profile.tsx        # 个人资料页
├── _layout.tsx            # 根布局
└── +not-found.tsx         # 404页面

hooks/
└── useFrameworkReady.ts   # 框架就绪钩子
```

## 页面说明

### 1. 灵感列表页 (index.tsx)
- 展示所有灵感卡片
- 搜索功能
- 分类筛选
- 收藏状态显示

### 2. 添加灵感页 (add.tsx)
- 标题和内容输入
- 分类选择
- 标签管理
- 表单验证

### 3. 收藏页 (favorites.tsx)
- 展示收藏的灵感
- 特殊的收藏标识
- 空状态处理

### 4. 个人资料页 (profile.tsx)
- 统计数据展示
- 最近活动记录
- 功能菜单
- 应用信息

## 设计特色

- 🎨 紫色主题配色 (#8B5CF6)
- 📱 卡片式布局设计
- ✨ 微交互和动画效果
- 🌟 现代化阴影和圆角
- 📐 8px网格系统
- 🔤 清晰的字体层次

## 运行项目

```bash
npm run dev
```

## 开发说明

- 使用 StyleSheet.create 进行样式管理
- 遵循 React Native 最佳实践
- 支持 TypeScript 类型检查
- 采用组件化开发模式