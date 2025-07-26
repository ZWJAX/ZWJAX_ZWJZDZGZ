/**
 * 灵感列表主页面
 * 功能：展示所有灵感、搜索、分类筛选、收藏管理
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Search, Star, Clock, Tag } from 'lucide-react-native';

// 灵感数据类型定义
interface Inspiration {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  createdAt: Date;
  tags: string[];
}

// 模拟灵感数据
const MOCK_INSPIRATIONS: Inspiration[] = [
  {
    id: '1',
    title: '移动端用户体验优化',
    content: '在移动应用中，用户的注意力只有几秒钟。我们需要在首屏就展示最核心的价值，减少不必要的步骤...',
    category: '工作',
    isFavorite: true,
    createdAt: new Date('2024-01-15'),
    tags: ['UX', '移动端', '用户体验'],
  },
  {
    id: '2',
    title: '咖啡店的温馨氛围',
    content: '今天在咖啡店工作时，注意到暖黄色的灯光配合木质家具，营造出特别温馨的氛围。这种设计理念可以应用到我们的应用界面中...',
    category: '生活',
    isFavorite: false,
    createdAt: new Date('2024-01-14'),
    tags: ['设计', '氛围', '色彩'],
  },
  {
    id: '3',
    title: 'AI在创意工作中的应用',
    content: '人工智能不应该替代创意工作者，而应该成为增强创意的工具。就像画家使用不同的画笔一样...',
    category: '创意',
    isFavorite: true,
    createdAt: new Date('2024-01-13'),
    tags: ['AI', '创意', '工具'],
  },
];

// 分类选项
const CATEGORIES = ['全部', '工作', '生活', '创意', '学习'];

export default function HomeScreen() {
  // 搜索文本状态
  const [searchText, setSearchText] = useState('');
  // 选中的分类状态
  const [selectedCategory, setSelectedCategory] = useState('全部');
  // 灵感列表状态
  const [inspirations] = useState<Inspiration[]>(MOCK_INSPIRATIONS);

  // 根据搜索和分类条件过滤灵感
  const filteredInspirations = inspirations.filter((inspiration) => {
    // 检查标题和内容是否包含搜索关键词
    const matchesSearch = inspiration.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         inspiration.content.toLowerCase().includes(searchText.toLowerCase());
    // 检查是否匹配选中的分类
    const matchesCategory = selectedCategory === '全部' || inspiration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 格式化日期显示
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '今天';
    if (diffDays === 2) return '昨天';
    if (diffDays <= 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 页面头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的灵感</Text>
        <Text style={styles.headerSubtitle}>记录每一个闪光时刻</Text>
      </View>

      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索灵感..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* 分类筛选器 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 灵感列表 */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredInspirations.map((inspiration) => (
          <TouchableOpacity key={inspiration.id} style={styles.card}>
            {/* 卡片头部：标题、收藏状态、分类 */}
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{inspiration.title}</Text>
                {inspiration.isFavorite && (
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                )}
              </View>
              <Text style={styles.cardCategory}>{inspiration.category}</Text>
            </View>
            
            {/* 卡片内容 */}
            <Text style={styles.cardContent} numberOfLines={3}>
              {inspiration.content}
            </Text>
            
            {/* 卡片底部：标签和日期 */}
            <View style={styles.cardFooter}>
              <View style={styles.tagsContainer}>
                {inspiration.tags.slice(0, 2).map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Tag size={10} color="#8B5CF6" />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.dateContainer}>
                <Clock size={12} color="#9CA3AF" />
                <Text style={styles.dateText}>{formatDate(inspiration.createdAt)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* 空状态显示 */}
        {filteredInspirations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>没有找到相关灵感</Text>
            <Text style={styles.emptyStateSubtext}>试试调整搜索条件或添加新的灵感</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// 样式定义
const styles = StyleSheet.create({
  // 主容器样式
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // 头部区域样式
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  // 主标题样式
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  // 副标题样式
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  // 搜索容器样式
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // 搜索图标样式
  searchIcon: {
    marginRight: 12,
  },
  // 搜索输入框样式
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  // 分类容器样式
  categoryContainer: {
    marginBottom: 20,
  },
  // 分类内容样式
  categoryContent: {
    paddingHorizontal: 20,
  },
  // 分类按钮样式
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  // 激活状态的分类按钮样式
  categoryButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  // 分类文字样式
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  // 激活状态的分类文字样式
  categoryTextActive: {
    color: '#FFFFFF',
  },
  // 列表容器样式
  listContainer: {
    flex: 1,
  },
  // 列表内容样式
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // 卡片样式
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  // 卡片头部样式
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  // 卡片标题容器样式
  cardTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 卡片标题样式
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
    flex: 1,
  },
  // 卡片分类标签样式
  cardCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8B5CF6',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  // 卡片内容样式
  cardContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4B5563',
    marginBottom: 16,
  },
  // 卡片底部样式
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // 标签容器样式
  tagsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  // 单个标签样式
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  // 标签文字样式
  tagText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 4,
  },
  // 日期容器样式
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 日期文字样式
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  // 空状态容器样式
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  // 空状态主文字样式
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  // 空状态副文字样式
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});