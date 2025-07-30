import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import ChildSelector from '../../components/ChildSelector';
import DashboardCard from '../../components/DashboardCard';
import AttendanceOverview from '../../components/AttendanceOverview';
import HomeworkList from '../../components/HomeworkList';
import ExamResults from '../../components/ExamResults';
import { 
  mockChildren, 
  mockAttendance, 
  mockHomework, 
  mockExamResults, 
  mockTimetable, 
  mockFees 
} from '../../data/mockData';
import { Child } from '../../types';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<Child>(mockChildren[0]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 17) return t('goodAfternoon');
    return t('goodEvening');
  };

  const getTodayTimetable = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return mockTimetable[selectedChild.id]?.filter(entry => entry.day === today) || [];
  };

  const getFeesOverview = () => {
    const fees = mockFees[selectedChild.id] || [];
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidFees = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
    const pendingFees = totalFees - paidFees;
    
    return { totalFees, paidFees, pendingFees };
  };

  const todayTimetable = getTodayTimetable();
  const feesOverview = getFeesOverview();

  console.log('Home screen rendered with selected child:', selectedChild.name);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerContainer}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <ChildSelector
          children={mockChildren}
          selectedChild={selectedChild}
          onSelectChild={setSelectedChild}
        />
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Attendance Overview */}
        <DashboardCard
          title={t('attendanceOverview')}
          icon="calendar-outline"
          onPress={() => router.push('/attendance')}
        >
          <AttendanceOverview attendance={mockAttendance[selectedChild.id] || []} />
        </DashboardCard>

        {/* Homework Updates */}
        <DashboardCard
          title={t('homeworkUpdates')}
          icon="book-outline"
          onPress={() => router.push('/homework')}
        >
          <HomeworkList homework={mockHomework[selectedChild.id] || []} />
        </DashboardCard>

        {/* Exam & Marks */}
        <DashboardCard
          title={t('examMarks')}
          icon="trophy-outline"
          onPress={() => router.push('/exams')}
        >
          <ExamResults results={mockExamResults[selectedChild.id] || []} />
        </DashboardCard>

        {/* Fees Overview */}
        <DashboardCard
          title={t('feesOverview')}
          icon="card-outline"
          onPress={() => router.push('/fees')}
        >
          <View style={styles.feesContainer}>
            <View style={styles.feesRow}>
              <View style={styles.feeItem}>
                <Text style={styles.feeAmount}>₹{feesOverview.totalFees.toLocaleString()}</Text>
                <Text style={styles.feeLabel}>{t('totalFees')}</Text>
              </View>
              <View style={styles.feeItem}>
                <Text style={[styles.feeAmount, { color: colors.success }]}>₹{feesOverview.paidFees.toLocaleString()}</Text>
                <Text style={styles.feeLabel}>{t('paidAmount')}</Text>
              </View>
              <View style={styles.feeItem}>
                <Text style={[styles.feeAmount, { color: colors.error }]}>₹{feesOverview.pendingFees.toLocaleString()}</Text>
                <Text style={styles.feeLabel}>{t('pendingAmount')}</Text>
              </View>
            </View>
            {feesOverview.pendingFees > 0 && (
              <TouchableOpacity 
                style={styles.payButton}
                onPress={() => router.push('/fees')}
              >
                <Text style={styles.payButtonText}>{t('payNow')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </DashboardCard>

      

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  timetableItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  timeSlot: {
    width: 80,
    marginRight: 12,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold',
  },
  classInfo: {
    flex: 1,
  },
  subject: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Poppins_600SemiBold',
  },
  teacher: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
  room: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
    fontFamily: 'Nunito_400Regular',
  },
  noClasses: {
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
    color: colors.textSecondary,
    fontFamily: 'Nunito_600SemiBold',
  },
  timetablePreview: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 8,
    marginTop: 4,
  },
  viewMoreButton: {
    backgroundColor: colors.background,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  viewMoreText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
  feesContainer: {
    // Fees container styles
  },
  feesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  feeItem: {
    alignItems: 'center',
    flex: 1,
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins_700Bold',
  },
  feeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Nunito_400Regular',
  },
  payButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: colors.backgroundAlt,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
});