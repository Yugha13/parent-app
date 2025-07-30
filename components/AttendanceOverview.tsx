import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { AttendanceRecord } from '../types';
import { useTranslation } from 'react-i18next';

interface AttendanceOverviewProps {
  attendance: AttendanceRecord[];
}

export default function AttendanceOverview({ attendance }: AttendanceOverviewProps) {
  const { t } = useTranslation();

  const getAttendanceStats = () => {
    const total = attendance.length;
    const present = attendance.filter(record => record.status === 'present').length;
    const absent = attendance.filter(record => record.status === 'absent').length;
    const late = attendance.filter(record => record.status === 'late').length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, rate };
  };

  const stats = getAttendanceStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return colors.present;
      case 'absent': return colors.absent;
      case 'late': return colors.late;
      default: return colors.textSecondary;
    }
  };

  const renderCalendar = () => {
    const recentAttendance = attendance.slice(-7); // Show last 7 days
    
    return (
      <View style={styles.calendar}>
        {recentAttendance.map((record, index) => {
          const date = new Date(record.date);
          const day = date.getDate();
          
          return (
            <View key={index} style={styles.calendarDay}>
              <Text style={styles.dayNumber}>{day}</Text>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(record.status) }]} />
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.rate}%</Text>
          <Text style={styles.statLabel}>{t('attendanceRate')}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.present }]}>{stats.present}</Text>
          <Text style={styles.statLabel}>{t('present')}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.absent }]}>{stats.absent}</Text>
          <Text style={styles.statLabel}>{t('absent')}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.late }]}>{stats.late}</Text>
          <Text style={styles.statLabel}>{t('late')}</Text>
        </View>
      </View>
      
      <Text style={[commonStyles.textSecondary, styles.calendarTitle]}>Last 7 Days</Text>
      {renderCalendar()}
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.present }]} />
          <Text style={styles.legendText}>{t('present')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.absent }]} />
          <Text style={styles.legendText}>{t('absent')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.late }]} />
          <Text style={styles.legendText}>{t('late')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'Poppins_700Bold',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontFamily: 'Nunito_400Regular',
  },
  calendarTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarDay: {
    alignItems: 'center',
    flex: 1,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
});