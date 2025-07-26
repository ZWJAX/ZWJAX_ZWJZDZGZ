/**
 * 添加灵感页面
 * 功能：创建新的灵感记录，包括标题、内容、分类和标签管理
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Save, Tag, Lightbulb } from 'lucide-react-native';

// 预定义的分类选项
const CATEGORIES = ['工作', '生活', '创意', '学习'];
// 建议的标签选项
const SUGGESTED_TAGS = ['想法', '设计', '技术', '灵感', '创新', '用户体验', '产品', '营销'];

export default function AddScreen() {
  // 表单状态管理
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  // 保存灵感处理函数
  const handleSave = () => {
    // 表单验证
    if (!title.trim() || !content.trim()) {
      Alert.alert('提示', '请填写标题和内容');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('提示', '请选择分类');
      return;
    }

    // 这里通常会保存到数据库或状态管理系统
    Alert.alert('成功', '灵感已保存！', [
      {
        text: '确定',
        onPress: () => {
          // 重置表单
          setTitle('');
          setContent('');
          setSelectedCategory('');
          setSelectedTags([]);
          setCustomTag('');
        },
      },
    ]);
  };

  // 切换标签选中状态
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 添加自定义标签
  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 页面头部 */}
        <View style={styles.header}>
          <Lightbulb size={28} color="#8B5CF6" />
          <Text style={styles.headerTitle}>记录新灵感</Text>
          <Text style={styles.headerSubtitle}>捕捉每一个精彩想法</Text>
        </View>

        {/* 标题输入区域 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>标题 *</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="为你的灵感起个名字..."
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* 内容输入区域 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>内容 *</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="详细描述你的想法、观察或感悟..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* 分类选择区域 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>分类 *</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 标签选择区域 */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>标签</Text>
          <View style={styles.tagsContainer}>
            {SUGGESTED_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagButton,
                  selectedTags.includes(tag) && styles.tagButtonSelected,
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Tag size={12} color={selectedTags.includes(tag) ? '#FFFFFF' : '#8B5CF6'} />
                <Text
                  style={[
                    styles.tagButtonText,
                    selectedTags.includes(tag) && styles.tagButtonTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* 自定义标签输入 */}
          <View style={styles.customTagContainer}>
            <TextInput
              style={styles.customTagInput}
              placeholder="添加自定义标签..."
              value={customTag}
              onChangeText={setCustomTag}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.addTagButton} onPress={addCustomTag}>
              <Text style={styles.addTagButtonText}>添加</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 已选标签显示区域 */}
        {selectedTags.length > 0 && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>已选标签</Text>
            <View style={styles.selectedTagsContainer}>
              {selectedTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.selectedTag}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={styles.selectedTagText}>{tag}</Text>
                  <Text style={styles.removeTagText}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* 保存按钮 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>保存灵感</Text>
        </TouchableOpacity>
      </View>
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
  // 滚动视图样式
  scrollView: {
    flex: 1,
  },
  // 头部区域样式
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  // 头部标题样式
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  // 头部副标题样式
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  // 输入区域容器样式
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  // 标签文字样式
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  // 标题输入框样式
  titleInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // 内容输入框样式
  contentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // 分类网格布局样式
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  // 分类按钮样式
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minWidth: 80,
    alignItems: 'center',
  },
  // 选中状态的分类按钮样式
  categoryButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  // 分类按钮文字样式
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  // 选中状态的分类按钮文字样式
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
  // 标签容器样式
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  // 标签按钮样式
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  // 选中状态的标签按钮样式
  tagButtonSelected: {
    backgroundColor: '#8B5CF6',
  },
  // 标签按钮文字样式
  tagButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8B5CF6',
    marginLeft: 4,
  },
  // 选中状态的标签按钮文字样式
  tagButtonTextSelected: {
    color: '#FFFFFF',
  },
  // 自定义标签容器样式
  customTagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  // 自定义标签输入框样式
  customTagInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  // 添加标签按钮样式
  addTagButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  // 添加标签按钮文字样式
  addTagButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  // 已选标签容器样式
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  // 已选标签样式
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  // 已选标签文字样式
  selectedTagText: {
    fontSize: 12,
    color: '#8B5CF6',
    marginRight: 6,
  },
  // 删除标签按钮样式
  removeTagText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  // 底部容器样式
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  // 保存按钮样式
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  // 保存按钮文字样式
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});