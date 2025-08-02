import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { mockChildren, mockHomework } from '../data/mockData';
import { Child, Homework } from '../types';
import i18n from '../utils/i18n';

type FilterType = 'all' | 'pending' | 'completed' | 'overdue';
type SectionType = 'today' | 'yesterday' | 'upcoming';

export default function HomeworkScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<Child>(mockChildren[0]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);
  const [expandedHomework, setExpandedHomework] = useState<string[]>([]);
  const [expandedAttachment, setExpandedAttachment] = useState<string | null>(null);

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
  
  const getDueStatusText = (dueDate: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueDateObj = new Date(dueDate);
    dueDateObj.setHours(0, 0, 0, 0);
    
    if (dueDateObj.getTime() === today.getTime()) {
      return t('dueToday');
    } else if (dueDateObj.getTime() === tomorrow.getTime()) {
      return t('dueTomorrow');
    } else {
      return `${t('due')}: ${formatDate(dueDate)}`;
    }
  };

  const getHomeworkBySection = (section: SectionType): Homework[] => {
    const homework = mockHomework[selectedChild.id] || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    switch (section) {
      case 'today':
        return homework.filter(item => {
          const dueDate = new Date(item.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime() || dueDate.getTime() === tomorrow.getTime();
        });
      case 'yesterday':
        return homework.filter(item => {
          const dueDate = new Date(item.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === yesterday.getTime();
        });
      case 'upcoming':
        return homework.filter(item => {
          const dueDate = new Date(item.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() > tomorrow.getTime();
        });
      default:
        return [];
    }
  };
  
  const renderSectionHeader = (title: string, count: number) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <Ionicons 
          name="book-outline" 
          size={20} 
          color={colors.primary} 
          style={styles.sectionIcon} 
        />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </View>
  );
  
  const renderYesterdayHomeworkStatus = () => {
    const yesterdayHomework = getHomeworkBySection('yesterday');
    
    // Count homework by status
    const statusCounts = {
      completed: 0,
      pending: 0,
      overdue: 0
    };
    
    yesterdayHomework.forEach(hw => {
      statusCounts[hw.status as keyof typeof statusCounts]++;
    });
    
    // Create summary text
    const summaryParts = [];
    if (statusCounts.completed > 0) {
      summaryParts.push(`${statusCounts.completed} ${t('completed')}`);
    }
    if (statusCounts.pending > 0) {
      summaryParts.push(`${statusCounts.pending} ${t('pending')}`);
    }
    if (statusCounts.overdue > 0) {
      summaryParts.push(`${statusCounts.overdue} ${t('overdue')}`);
    }
    
    const summaryText = summaryParts.join(', ');
    
    return (
      <View style={styles.yesterdayStatusContainer}>
        <Text style={styles.sectionTitle}>{t('yesterdayHomeworkStatus')}</Text>
        
        {yesterdayHomework.length > 0 ? (
          <>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.statusChipsContainer}
            >
              {yesterdayHomework.map(hw => (
                <View 
                  key={hw.id} 
                  style={[styles.statusChip, { backgroundColor: getStatusColor(hw.status) }]}
                >
                  <Text style={styles.statusChipText}>{hw.subject}</Text>
                </View>
              ))}
            </ScrollView>
            
            <Text style={styles.statusSummary}>{summaryText}</Text>
          </>
        ) : (
          <View style={styles.emptySection}>
            <Text style={styles.emptySectionText}>{t('noHomeworkYesterday')}</Text>
          </View>
        )}
      </View>
    );
  };
  
  const renderHomeworkCard = (homework: Homework, isExpanded: boolean) => {
    const toggleExpand = () => {
      if (isExpanded) {
        setExpandedHomework(expandedHomework.filter(id => id !== homework.id));
      } else {
        setExpandedHomework([...expandedHomework, homework.id]);
      }
    };
    
    const handleAttachmentPress = (attachmentId: string) => {
      // In a real app, this would open the attachment or download it
      setExpandedAttachment(expandedAttachment === attachmentId ? null : attachmentId);
    };
    
    const attachmentsCount = homework.attachments?.length || 0;
    
    return (
      <TouchableOpacity 
        key={homework.id} 
        style={styles.homeworkCard}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.homeworkHeader}>
          <Text style={styles.subject}>{homework.subject}</Text>
          <Text style={styles.dueStatus}>
            {getDueStatusText(homework.dueDate)}
          </Text>
        </View>
        
        <Text style={styles.title}>{homework.title}</Text>
        
        <Text 
          style={styles.description} 
          numberOfLines={isExpanded ? undefined : 2}
        >
          {homework.description}
        </Text>
        
        {attachmentsCount > 0 && (
          <TouchableOpacity 
            style={styles.attachmentsContainer}
            onPress={() => handleAttachmentPress(homework.attachments![0].id)}
          >
            <Ionicons name="attach-outline" size={16} color={colors.primary} />
            <Text style={styles.attachmentsText}>
              {attachmentsCount} {attachmentsCount === 1 ? t('attachment') : t('attachments')}
            </Text>
          </TouchableOpacity>
        )}
        
        {isExpanded && homework.attachments && (
          <View style={styles.expandedContent}>
            {homework.attachments.map(attachment => (
              <TouchableOpacity 
                key={attachment.id} 
                style={styles.attachmentItem}
                onPress={() => handleAttachmentPress(attachment.id)}
              >
                <Ionicons 
                  name={attachment.type === 'pdf' ? 'document-outline' : 'document-text-outline'} 
                  size={20} 
                  color={colors.primary} 
                />
                <Text style={styles.attachmentName}>{attachment.name}</Text>
              </TouchableOpacity>
            ))}
            
            <View style={styles.homeworkFooter}>
              <View style={styles.teacherContainer}>
                <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.teacher}>{homework.teacher}</Text>
              </View>
              
              {homework.status !== 'completed' && (
                <TouchableOpacity style={styles.completeButton}>
                  <Ionicons name="checkmark" size={16} color={colors.backgroundAlt} />
                  <Text style={styles.completeButtonText}>{t('markAsCompleted')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  const filteredHomework = getFilteredHomework(selectedFilter);
  const todayHomework = getHomeworkBySection('today');
  const yesterdayHomework = getHomeworkBySection('yesterday');
  const upcomingHomework = getHomeworkBySection('upcoming');

  // Function to toggle language between English and Tamil
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

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
          headerRight: () => (
            <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
              <Text style={styles.languageButtonText}>
                {currentLanguage === 'en' ? 'தமிழ்' : 'English'}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>{t('homeworkUpdates')}</Text>
        <Text style={styles.headerSubtext}>{t('trackHomework')}</Text>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Homework Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('todayHomework')}</Text>
          
          {todayHomework.length > 0 ? (
            <FlatList
              data={todayHomework}
              renderItem={({ item }) => renderHomeworkCard(item, expandedHomework.includes(item.id))}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.homeworkList}
            />
          ) : (
            <View style={styles.emptySection}>
              <Text style={styles.emptySectionText}>{t('noHomeworkToday')}</Text>
            </View>
          )}
        </View>
        
        {/* Yesterday's Homework Status Section */}
        {renderYesterdayHomeworkStatus()}
        
        {/* Filter Section - Only show if filter is selected */}
        {selectedFilter !== 'all' && (
          <View style={styles.sectionContainer}>
            {renderFilterSelector()}
            {renderSectionHeader(t('filteredHomework'), filteredHomework.length)}
            {filteredHomework.length > 0 ? (
              filteredHomework.map((homework) => 
                renderHomeworkCard(homework, expandedHomework.includes(homework.id))
              )
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="book-outline" size={64} color={colors.grey} />
                <Text style={styles.emptyText}>
                  {t('noHomeworkFound')}
                </Text>
              </View>
            )}
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
  languageButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 16,
  },
  languageButtonText: {
    color: colors.backgroundAlt,
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  homeworkList: {
    paddingTop: 8,
  },
  filterSelector: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginBottom: 8,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  countBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.backgroundAlt,
    fontFamily: 'Nunito_600SemiBold',
  },
  homeworkCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  homeworkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'Poppins_700Bold',
  },
  dueStatus: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_600SemiBold',
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
    marginBottom: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  attachmentsText: {
    fontSize: 13,
    color: colors.primary,
    marginLeft: 6,
    fontFamily: 'Nunito_600SemiBold',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  attachmentName: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    fontFamily: 'Nunito_400Regular',
  },
  homeworkFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
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
  yesterdayStatusContainer: {
    marginBottom: 24,
  },
  statusChipsContainer: {
    marginBottom: 12,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    elevation: 1,
  },
  statusChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.backgroundAlt,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusSummary: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  emptySection: {
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptySectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
});