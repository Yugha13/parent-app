import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { Homework } from '../types';
import { useTranslation } from 'react-i18next';

interface HomeworkListProps {
  homework: Homework[];
}

export default function HomeworkList({ homework }: HomeworkListProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'overdue': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('completed');
      case 'pending': return t('pending');
      case 'overdue': return t('overdue');
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const recentHomework = homework.slice(0, 3); // Show only 3 recent items

  return (
    <View>
      {recentHomework.map((item, index) => (
        <View key={item.id} style={[styles.homeworkItem, index < recentHomework.length - 1 && styles.itemBorder]}>
          <View style={styles.homeworkHeader}>
            <Text style={styles.subject}>{item.subject}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          <View style={styles.homeworkFooter}>
            <Text style={styles.teacher}>{item.teacher}</Text>
            <Text style={styles.dueDate}>{t('dueDate')}: {formatDate(item.dueDate)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  homeworkItem: {
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  homeworkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Poppins_600SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.backgroundAlt,
    fontFamily: 'Nunito_600SemiBold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Nunito_600SemiBold',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
    fontFamily: 'Nunito_400Regular',
  },
  homeworkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teacher: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  dueDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
});