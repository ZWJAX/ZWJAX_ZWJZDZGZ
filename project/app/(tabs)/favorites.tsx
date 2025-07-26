/**
 * 收藏页面
 * 功能：展示用户收藏的灵感内容，提供特殊的收藏标识和空状态处理
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Star, Clock, Tag, Heart } from 'lucide-react-native';

// 灵感数据类型定义
interface Inspiration {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  tags: string[];
}

// 收藏的灵感模拟数据
const FAVORITE_INSPIRATIONS: Inspiration[] = [
  {
    id: '1',
    title: '移动端用户体验优化',
    content: '在移动应用中，用户的注意力只有几秒钟。我们需要在首屏就展示最核心的价值，减少不必要的步骤，让用户能够快速理解应用的价值并完成核心操作。',
    category: '工作',
    createdAt: new Date('2024-01-15'),
    tags: ['UX', '移动端', '用户体验'],
  },
  {
    id: '3',
    title: 'AI在创意工作中的应用',
    content: '人工智能不应该替代创意工作者，而应该成为增强创意的工具。就像画家使用不同的画笔一样，AI可以帮助我们探索更多的可能性，但最终的创意决策仍然需要人的判断和感觉。',
    category: '创意',
    createdAt: new Date('2024-01-13'),
    tags: ['AI', '创意', '工具'],
  },
  {
    id: '4',
    title: '简约设计的力量',
    content: '好的设计不是添加更多功能，而是去除不必要的元素。每一个保留下来的元素都应该有其存在的意义和价值。简约不是简单，而是经过深思熟虑后的精炼。',
    category: '设计',
    createdAt: new Date('2024-01-10'),
    tags: ['设计', '简约', '极简主义'],
  },
];

export default function FavoritesScreen() {
  // 收藏列表状态
  const [favorites] = useState<Inspiration[]>(FAVORITE_INSPIRATIONS);

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
        <View style={styles.headerContent}>
          <Heart size={28} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.headerTitle}>我的收藏</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {favorites.length} 个珍贵的灵感
        </Text>
      </View>

      {/* 根据收藏数量显示不同内容 */}
      {favorites.length > 0 ? (
        // 有收藏内容时显示列表
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {favorites.map((inspiration) => (
            <TouchableOpacity key={inspiration.id} style={styles.card}>
              {/* 卡片头部：标题、收藏图标、分类 */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>{inspiration.title}</Text>
                  <Star size={18} color="#F59E0B" fill="#F59E0B" />
                </View>
                <Text style={styles.cardCategory}>{inspiration.category}</Text>
              </View>
              
              {/* 卡片内容 */}
              <Text style={styles.cardContent}>
                {inspiration.content}
              </Text>
              
              {/* 卡片底部：标签和日期 */}
              <View style={styles.cardFooter}>
                <View style={styles.tagsContainer}>
                  {inspiration.tags.slice(0, 3).map((tag) => (
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
        </ScrollView>
      ) : (
        // 无收藏内容时显示空状态
        <View style={styles.emptyState}>
          <Heart size={64} color="#E5E7EB" />
          <Text style={styles.emptyStateTitle}>还没有收藏的灵感</Text>
          <Text style={styles.emptyStateSubtitle}>
            在灵感列表中点击星星图标即可收藏
          </Text>
        </View>
      )}
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
    paddingBottom: 24,
  },
  // 头部内容样式
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  // 头部标题样式
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  // 头部副标题样式
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
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
  // 收藏卡片样式（带左侧金色边框）
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
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
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
    justifyContent: 'space-between',
  },
  // 卡片标题样式
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
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
    marginLeft: 12,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  // 空状态标题样式
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  // 空状态副标题样式
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
});