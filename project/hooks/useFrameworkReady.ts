/**
 * 框架就绪钩子
 * 用于通知外部环境React Native应用已准备就绪
 * 这对于在浏览器环境中的集成非常重要
 */
import { useEffect } from 'react';

// 扩展Window接口以包含frameworkReady回调
declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

/**
 * 自定义钩子：通知框架就绪状态
 * 在组件挂载时调用全局的frameworkReady回调函数
 */
export function useFrameworkReady() {
  useEffect(() => {
    // 如果存在frameworkReady回调函数，则调用它
    window.frameworkReady?.();
  });
}
