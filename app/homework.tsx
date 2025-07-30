import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import ChildSelector from '../components/ChildSelector';
import { mockChildren, mockHomework } from '../data/mockData';
import { Child, Homework } from '../types';

type FilterType = 'all' | 'pending' | 'completed' | 'overdue';

export default function HomeworkScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<Child>(mockChildren[0]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const getFilteredHomework = (filter: FilterType): Homework[] => {
    const homework = mockHomework[selectedChild.id] || [];
    
    switch (filter) {
      case 'pending':
        return homework.filter(item => item.status === 'pending');
      case 'completed':
        return homework.filter(item => item.status === 'completed');
      case 'overdue':
        return homework.filter(item => item.status === 'overdue');
      default:
        return homework;
    }
  };

  const renderFilterSelector = () => (
    <View style={styles.filterSelector}>
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'all' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('all')}
      >
        <Text style={[styles.filterText, selectedFilter === 'all' && styles.selectedFilterText]}>
          {t('all')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'pending' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('pending')}
      >
        <Text style={[styles.filterText, selectedFilter === 'pending' && styles.selectedFilterText]}>
          {t('pending')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'completed' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('completed')}
      >
        <Text style={[styles.filterText, selectedFilter === 'completed' && styles.selectedFilterText]}>
          {t('completed')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'overdue' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('overdue')}
      >
        <Text style={[styles.filterText, selectedFilter === 'overdue' && styles.selectedFilterText]}>
          {t('overdue')}
        </Text>
      </TouchableOpacity>
    </View>
  );

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

  const filteredHomework = getFilteredHomework(selectedFilter);

  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('homeworkUpdates'),
          headerTitleStyle: commonStyles.title,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

  

      {renderFilterSelector()}

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {filteredHomework.length > 0 ? (
          filteredHomework.map((item) => (
            <View key={item.id} style={styles.homeworkCard}>
              <View style={styles.homeworkHeader}>
                <View style={styles.subjectContainer}>
                  <Text style={styles.subject}>{item.subject}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                  </View>
                </View>
                <Text style={styles.dueDate}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  {' '}{t('dueDate')}: {formatDate(item.dueDate)}
                </Text>
              </View>
              
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              
              <View style={styles.homeworkFooter}>
                <View style={styles.teacherContainer}>
                  <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.teacher}>{item.teacher}</Text>
                </View>
                
                {item.status !== 'completed' && (
                  <TouchableOpacity 
                    style={styles.completeButton}
                    onPress={() => console.log('Mark as completed:', item.id)}
                  >
                    <Ionicons name="checkmark" size={16} color={colors.backgroundAlt} />
                    <Text style={styles.completeButtonText}>{t('markAsCompleted')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color={colors.grey} />
            <Text style={styles.emptyText}>
              {t('noHomeworkFound')}
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 16,
  },
  filterSelector: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  selectedFilterButton: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  selectedFilterText: {
    color: colors.backgroundAlt,
  },
  homeworkCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  homeworkHeader: {
    marginBottom: 12,
  },
  subjectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
  dueDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  homeworkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teacherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacher: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
    fontFamily: 'Nunito_400Regular',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.backgroundAlt,
    marginLeft: 4,
    fontFamily: 'Nunito_600SemiBold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
});