import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { ExamResult } from '../types';
import { useTranslation } from 'react-i18next';

interface ExamResultsProps {
  results: ExamResult[];
}

export default function ExamResults({ results }: ExamResultsProps) {
  const { t } = useTranslation();

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return colors.success;
    if (grade.includes('B')) return colors.info;
    if (grade.includes('C')) return colors.warning;
    return colors.error;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const recentResults = results.slice(0, 3); // Show only 3 recent results

  return (
    <View>
      <View style={styles.header}>
        <Text style={[commonStyles.textSecondary, styles.headerText]}>{t('latestResults')}</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download-outline" size={16} color={colors.primary} />
          <Text style={styles.downloadText}>{t('downloadReport')}</Text>
        </TouchableOpacity>
      </View>

      {recentResults.map((result, index) => (
        <View key={result.id} style={[styles.resultItem, index < recentResults.length - 1 && styles.itemBorder]}>
          <View style={styles.resultHeader}>
            <View style={styles.subjectInfo}>
              <Text style={styles.subject}>{result.subject}</Text>
              <Text style={styles.examName}>{result.examName}</Text>
            </View>
            <View style={styles.gradeContainer}>
              <Text style={[styles.grade, { color: getGradeColor(result.grade) }]}>{result.grade}</Text>
              <Text style={styles.marks}>{result.marks}/{result.totalMarks}</Text>
            </View>
          </View>
          <View style={styles.resultFooter}>
            <Text style={styles.date}>{formatDate(result.date)}</Text>
            <View style={[styles.statusBadge, { 
              backgroundColor: result.status === 'passed' ? colors.success : colors.error 
            }]}>
              <Text style={styles.statusText}>
                {result.status === 'passed' ? t('passed') : t('failed')}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  downloadText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontFamily: 'Nunito_600SemiBold',
  },
  resultItem: {
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  subjectInfo: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Poppins_600SemiBold',
  },
  examName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
  gradeContainer: {
    alignItems: 'flex-end',
  },
  grade: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  marks: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
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
});