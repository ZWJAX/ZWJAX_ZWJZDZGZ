/**
 * 个人资料页面
 * 功能：展示用户统计信息、最近活动、功能菜单和应用信息
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { User, Settings, Star, FileText, Download, Share2, CircleHelp as HelpCircle, ChevronRight, Lightbulb } from 'lucide-react-native';

// 统计卡片数据类型定义
interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

// 菜单项数据类型定义
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  // 统计数据配置
  const stats: StatCard[] = [
    {
      icon: <Lightbulb size={20} color="#8B5CF6" />,
      label: '总灵感数',
      value: '24',
      color: '#EDE9FE',
    },
    {
      icon: <Star size={20} color="#F59E0B" />,
      label: '收藏数',
      value: '8',
      color: '#FEF3C7',
    },
    {
      icon: <FileText size={20} color="#10B981" />,
      label: '本月新增',
      value: '12',
      color: '#D1FAE5',
    },
  ];

  // 功能菜单配置
  const menuItems: MenuItem[] = [
    {
      icon: <Download size={20} color="#6B7280" />,
      label: '导出数据',
      subtitle: '备份所有灵感内容',
      onPress: () => console.log('Export data'),
    },
    {
      icon: <Share2 size={20} color="#6B7280" />,
      label: '分享应用',
      subtitle: '推荐给朋友使用',
      onPress: () => console.log('Share app'),
    },
    {
      icon: <Settings size={20} color="#6B7280" />,
      label: '设置',
      subtitle: '个性化定制',
      onPress: () => console.log('Settings'),
    },
    {
      icon: <HelpCircle size={20} color="#6B7280" />,
      label: '帮助与反馈',
      subtitle: '使用指南和问题反馈',
      onPress: () => console.log('Help'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 用户资料头部 */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#8B5CF6" />
          </View>
          <Text style={styles.userName}>灵感创作者</Text>
          <Text style={styles.userSubtitle}>记录生活中的每一个闪光时刻</Text>
        </View>

        {/* 统计卡片区域 */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
                {stat.icon}
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* 最近活动区域 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>最近活动</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>添加了新灵感"AI在创意工作中的应用"</Text>
                <Text style={styles.activityTime}>2小时前</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>收藏了"移动端用户体验优化"</Text>
                <Text style={styles.activityTime}>1天前</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>创建了"工作"分类</Text>
                <Text style={styles.activityTime}>3天前</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 功能菜单区域 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>功能</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.menuItemLast,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    {item.icon}
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 应用信息区域 */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appInfoTitle}>灵感记录 v1.0.0</Text>
          <Text style={styles.appInfoSubtitle}>
            让创意永不丢失，让灵感时刻闪耀
          </Text>
        </View>
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
  // 用户资料头部样式
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  // 头像容器样式
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  // 用户名样式
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  // 用户描述样式
  userSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  // 统计卡片容器样式
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  // 单个统计卡片样式
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // 统计图标容器样式
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  // 统计数值样式
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  // 统计标签样式
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  // 区域容器样式
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  // 区域标题样式
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  // 活动卡片样式
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // 活动项样式
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  // 活动指示点样式
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
    marginTop: 6,
    marginRight: 12,
  },
  // 活动内容样式
  activityContent: {
    flex: 1,
  },
  // 活动文字样式
  activityText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  // 活动时间样式
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  // 菜单容器样式
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // 菜单项样式
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  // 最后一个菜单项样式（无底部边框）
  menuItemLast: {
    borderBottomWidth: 0,
  },
  // 菜单项左侧内容样式
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // 菜单图标容器样式
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  // 菜单文字容器样式
  menuTextContainer: {
    flex: 1,
  },
  // 菜单项标签样式
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  // 菜单项副标题样式
  menuItemSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  // 应用信息容器样式
  appInfoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  // 应用信息标题样式
  appInfoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  // 应用信息副标题样式
  appInfoSubtitle: {
    fontSize: 12,
    color: '#D1D5DB',
    textAlign: 'center',
  },
});