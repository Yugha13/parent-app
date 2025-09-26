import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { mockNotices, mockMessages } from '../../data/mockData';
import { Notice, Message } from '../../types';
import { useAuth } from '../../utils/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

type TabType = 'notices' | 'messages';

export default function AnnouncementsScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);
  if (loading || !user) return null;

  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('notices');

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return 'alert-circle';
      case 'event': return 'calendar';
      default: return 'information-circle';
    }
  };

  const getNoticeColor = (type: string) => {
    switch (type) {
      case 'urgent': return colors.error;
      case 'event': return colors.success;
      default: return colors.info;
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'teacher': return 'person';
      case 'admin': return 'business';
      default: return 'mail';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderNotice = (notice: Notice, index: number) => (
    <TouchableOpacity key={notice.id} style={[commonStyles.card, styles.noticeCard]}>
      <View style={styles.noticeHeader}>
        <View style={styles.noticeIconContainer}>
          <Ionicons 
            name={getNoticeIcon(notice.type) as keyof typeof Ionicons.glyphMap} 
            size={20} 
            color={getNoticeColor(notice.type)} 
          />
        </View>
        <View style={styles.noticeInfo}>
          <Text style={styles.noticeTitle}>{notice.title}</Text>
          <Text style={styles.noticeAuthor}>{notice.author}</Text>
        </View>
        <Text style={styles.noticeDate}>{formatDate(notice.date)}</Text>
      </View>
      <Text style={styles.noticeContent} numberOfLines={3}>{notice.content}</Text>
      <View style={[styles.typeBadge, { backgroundColor: getNoticeColor(notice.type) }]}>
        <Text style={styles.typeBadgeText}>{notice.type.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = (message: Message, index: number) => (
    <TouchableOpacity key={message.id} style={[commonStyles.card, styles.messageCard, !message.read && styles.unreadMessage]}>
      <View style={styles.messageHeader}>
        <View style={styles.messageIconContainer}>
          <Ionicons 
            name={getMessageIcon(message.type) as keyof typeof Ionicons.glyphMap} 
            size={20} 
            color={colors.primary} 
          />
        </View>
        <View style={styles.messageInfo}>
          <Text style={[styles.messageFrom, !message.read && styles.unreadText]}>{message.from}</Text>
          <Text style={[styles.messageSubject, !message.read && styles.unreadText]}>{message.subject}</Text>
        </View>
        <View style={styles.messageRight}>
          <Text style={styles.messageDate}>{formatDate(message.date)}</Text>
          {!message.read && <View style={styles.unreadDot} />}
        </View>
      </View>
      <Text style={styles.messageContent} numberOfLines={2}>{message.content}</Text>
    </TouchableOpacity>
  );

  const renderTabButton = (tab: TabType, title: string, count: number) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
      <View style={[styles.countBadge, activeTab === tab && styles.activeCountBadge]}>
        <Text style={[styles.countText, activeTab === tab && styles.activeCountText]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const unreadMessages = mockMessages.filter(msg => !msg.read).length;

  console.log('Announcements screen rendered, active tab:', activeTab);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerContainer}>
        <Text style={commonStyles.title}>{t('announcements')}</Text>
        
        <View style={styles.tabContainer}>
          {renderTabButton('notices', t('noticeBoard'), mockNotices.length)}
          {renderTabButton('messages', t('messages'), mockMessages.length)}
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'notices' ? (
          <View>
            {mockNotices.map((notice, index) => renderNotice(notice, index))}
          </View>
        ) : (
          <View>
            {mockMessages.map((message, index) => renderMessage(message, index))}
          </View>
        )}
        
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 6,
  },
  activeTabText: {
    color: colors.backgroundAlt,
  },
  countBadge: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  activeCountBadge: {
    backgroundColor: colors.backgroundAlt,
  },
  countText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: 'Nunito_600SemiBold',
  },
  activeCountText: {
    color: colors.primary,
  },
  noticeCard: {
    marginVertical: 6,
    position: 'relative',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noticeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  noticeInfo: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Poppins_600SemiBold',
  },
  noticeAuthor: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
  noticeDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  noticeContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.backgroundAlt,
    fontFamily: 'Nunito_700Bold',
  },
  messageCard: {
    marginVertical: 6,
  },
  unreadMessage: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  messageIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageInfo: {
    flex: 1,
  },
  messageFrom: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Poppins_600SemiBold',
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
  unreadText: {
    fontWeight: '700',
  },
  messageRight: {
    alignItems: 'flex-end',
  },
  messageDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  messageContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
});