/**
 * 应用根布局文件
 * 配置全局导航结构和状态栏样式
 */
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  // 初始化框架就绪状态
  useFrameworkReady();

  return (
    <>
      {/* 堆栈导航配置 */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* 404页面路由 */}
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* 状态栏配置 */}
      <StatusBar style="auto" />
    </>
  );
}
