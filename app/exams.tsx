import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import ChildSelector from '../components/ChildSelector';
import { mockChildren, mockExamResults } from '../data/mockData';
import { Child, ExamResult } from '../types';

type PeriodType = 'recent' | 'thisMonth' | 'lastMonth' | 'allTime';

export default function ExamsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<Child>(mockChildren[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('recent');

  const getExamsForPeriod = (period: PeriodType): ExamResult[] => {
    const exams = mockExamResults[selectedChild.id] || [];
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    switch (period) {
      case 'recent':
        return exams.slice(0, 5); // Most recent 5 exams
      case 'thisMonth':
        return exams.filter(exam => {
          const examDate = new Date(exam.date);
          return examDate >= thisMonthStart && examDate <= now;
        });
      case 'lastMonth':
        return exams.filter(exam => {
          const examDate = new Date(exam.date);
          return examDate >= lastMonthStart && examDate < thisMonthStart;
        });
      case 'allTime':
        return exams;
      default:
        return exams;
    }
  };

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'recent' && styles.selectedPeriodButton]}
        onPress={() => setSelectedPeriod('recent')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'recent' && styles.selectedPeriodText]}>
          {t('recent')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'thisMonth' && styles.selectedPeriodButton]}
        onPress={() => setSelectedPeriod('thisMonth')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'thisMonth' && styles.selectedPeriodText]}>
          {t('thisMonth')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'lastMonth' && styles.selectedPeriodButton]}
        onPress={() => setSelectedPeriod('lastMonth')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'lastMonth' && styles.selectedPeriodText]}>
          {t('lastMonth')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'allTime' && styles.selectedPeriodButton]}
        onPress={() => setSelectedPeriod('allTime')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'allTime' && styles.selectedPeriodText]}>
          {t('allTime')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return colors.success;
      case 'B+': case 'B': return colors.primary;
      case 'C+': case 'C': return colors.warning;
      case 'D': case 'F': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredExams = getExamsForPeriod(selectedPeriod);

  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('examResults'),
          headerTitleStyle: commonStyles.title,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={commonStyles.headerContainer}>
        <ChildSelector
          children={mockChildren}
          selectedChild={selectedChild}
          onSelectChild={setSelectedChild}
        />
      </View>

      {renderPeriodSelector()}

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {filteredExams.length > 0 
                ? (filteredExams.reduce((sum, exam) => sum + exam.marks, 0) / filteredExams.length).toFixed(1)
                : '-'}
            </Text>
            <Text style={styles.statLabel}>{t('avgMarks')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {filteredExams.length > 0 
                ? filteredExams.reduce((best, exam) => Math.max(best, exam.marks), 0)
                : '-'}
            </Text>
            <Text style={styles.statLabel}>{t('highestMarks')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{filteredExams.length}</Text>
            <Text style={styles.statLabel}>{t('totalExams')}</Text>
          </View>
        </View>

        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <View key={exam.id} style={styles.examCard}>
              <View style={styles.examHeader}>
                <View style={styles.subjectContainer}>
                  <Text style={styles.subject}>{exam.subject}</Text>
                  <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(exam.grade) }]}>
                    <Text style={styles.gradeText}>{exam.grade}</Text>
                  </View>
                </View>
                <Text style={styles.examDate}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  {' '}{formatDate(exam.date)}
                </Text>
              </View>
              
              <Text style={styles.examName}>{exam.name}</Text>
              
              <View style={styles.marksContainer}>
                <View style={styles.marksBar}>
                  <View 
                    style={[styles.marksProgress, { width: `${(exam.marks / exam.totalMarks) * 100}%` }]}
                  />
                </View>
                <Text style={styles.marksText}>
                  {exam.marks}/{exam.totalMarks} {t('marks')}
                </Text>
              </View>
              
              <View style={styles.examFooter}>
                <View style={styles.teacherContainer}>
                  <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.teacher}>{exam.teacher}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.reportButton}
                  onPress={() => console.log('Download report:', exam.id)}
                >
                  <Ionicons name="download-outline" size={16} color={colors.backgroundAlt} />
                  <Text style={styles.reportButtonText}>{t('downloadReport')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={64} color={colors.grey} />
            <Text style={styles.emptyText}>
              {t('noExamsFound')}
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  selectedPeriodButton: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  selectedPeriodText: {
    color: colors.backgroundAlt,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  examCard: {
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
  examHeader: {
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
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.backgroundAlt,
    fontFamily: 'Poppins_700Bold',
  },
  examDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  examName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  marksContainer: {
    marginBottom: 16,
  },
  marksBar: {
    height: 8,
    backgroundColor: colors.grey,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  marksProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  marksText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'right',
  },
  examFooter: {
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
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reportButtonText: {
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