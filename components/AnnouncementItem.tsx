import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

interface AnnouncementItemProps {
  title: string;
  content: string;
  time: string;
  type: 'alert' | 'info' | 'event';
}

export default function AnnouncementItem({ title, content, time, type }: AnnouncementItemProps) {
  const getIconName = () => {
    switch (type) {
      case 'alert': return 'alert-circle';
      case 'event': return 'calendar';
      case 'info': default: return 'information-circle';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'alert': return '#F44336';
      case 'event': return '#4CAF50';
      case 'info': default: return '#2196F3';
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'alert': return 'rgba(244, 67, 54, 0.1)';
      case 'event': return 'rgba(76, 175, 80, 0.1)';
      case 'info': default: return 'rgba(33, 150, 243, 0.1)';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: getIconBackground() }]}>
        <Ionicons name={getIconName()} size={24} color={getIconColor()} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content} numberOfLines={2}>{content}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'Nunito_400Regular',
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
});