import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { AttendanceRecord } from '../types';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface AttendanceSummaryProps {
  attendance: AttendanceRecord[];
}

export default function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const getOverallAttendance = () => {
    const total = attendance.length;
    const present = attendance.filter(record => record.status === 'present').length;
    const absent = attendance.filter(record => record.status === 'absent').length;
    const late = attendance.filter(record => record.status === 'late').length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, late, rate };
  };

  const overallStats = getOverallAttendance();
  
  const handleViewDetails = () => {
    router.push('/attendance');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('attendanceOverview')}</Text>
        <TouchableOpacity onPress={handleViewDetails} style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>{t('viewAll')}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${overallStats.rate}%` }]} 
          />
        </View>
        <Text style={styles.percentageText}>{overallStats.rate}% {t('present')}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{overallStats.present}</Text>
          <Text style={styles.statLabel}>{t('present')}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{overallStats.absent}</Text>
          <Text style={styles.statLabel}>{t('absent')}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{overallStats.late}</Text>
          <Text style={styles.statLabel}>{t('late')}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{overallStats.total}</Text>
          <Text style={styles.statLabel}>{t('total')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Poppins_600SemiBold',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 2,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.grey,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.present,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.present,
    fontFamily: 'Nunito_600SemiBold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins_700Bold',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
    marginTop: 4,
  },
});