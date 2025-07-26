/**
 * Tab导航布局配置文件
 * 定义应用的底部Tab导航结构和样式
 */
import { Tabs } from 'expo-router';
import { Chrome as Home, Plus, Bookmark, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // 隐藏顶部导航栏
        headerShown: false,
        // Tab栏样式配置
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 84,
          paddingBottom: 20,
          paddingTop: 10,
        },
        // Tab激活和非激活状态的颜色
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        // Tab标签文字样式
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      {/* 灵感列表页Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: '灵感',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      {/* 添加灵感页Tab */}
      <Tabs.Screen
        name="add"
        options={{
          title: '记录',
          tabBarIcon: ({ size, color }) => (
            <Plus size={size} color={color} />
          ),
        }}
      />
      {/* 收藏页Tab */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: '收藏',
          tabBarIcon: ({ size, color }) => (
            <Bookmark size={size} color={color} />
          ),
        }}
      />
      {/* 个人资料页Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}