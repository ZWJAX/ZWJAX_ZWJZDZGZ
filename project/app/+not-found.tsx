/**
 * 404错误页面
 * 当用户访问不存在的路由时显示此页面
 */
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      {/* 设置页面标题 */}
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        {/* 返回首页链接 */}
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

// 样式定义
const styles = StyleSheet.create({
  // 主容器样式
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  // 错误文字样式
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
  // 链接样式
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
