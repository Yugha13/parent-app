import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { mockAttendance, mockChildren } from '../data/mockData';
import { AttendanceRecord } from '../types';

interface MonthlyAttendance {
  month: string;
  year: number;
  percentage: number;
  records: AttendanceRecord[];
}

export default function AttendancePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyAttendance | null>(null);
  
  // Get attendance data for the selected child
  const attendanceData = mockAttendance[selectedChild.id] || [];
  
  // Calculate overall attendance percentage
  const calculateOverallAttendance = () => {
    const total = attendanceData.length;
    if (total === 0) return 0;
    
    const present = attendanceData.filter(record => record.status === 'present').length;
    return Math.round((present / total) * 100);
  };
  
  // Get monthly attendance data
  const getMonthlyAttendance = (): MonthlyAttendance[] => {
    const monthlyData: { [key: string]: { records: AttendanceRecord[], present: number } } = {};
    
    attendanceData.forEach(record => {
      const date = new Date(record.date);
      const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { records: [], present: 0 };
      }
      
      monthlyData[monthYear].records.push(record);
      if (record.status === 'present') {
        monthlyData[monthYear].present += 1;
      }
    });
    
    return Object.keys(monthlyData).map(key => {
      const [month, year] = key.split('-').map(Number);
      const records = monthlyData[key].records;
      const percentage = Math.round((monthlyData[key].present / records.length) * 100);
      
      return {
        month: getMonthName(month),
        year: year,
        percentage,
        records
      };
    }).sort((a, b) => {
      // Sort by year and month (most recent first)
      if (b.year !== a.year) return b.year - a.year;
      return getMonthIndex(b.month) - getMonthIndex(a.month);
    });
  };
  
  const getMonthName = (monthIndex: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
  };
  
  const getMonthIndex = (monthName: string): number => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.indexOf(monthName);
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    return `${dayOfWeek}, ${day} ${getMonthName(date.getMonth()).substring(0, 3)}`;
  };
  
  const monthlyData = getMonthlyAttendance();
  
  // Render the main attendance overview page
  const renderAttendanceOverview = () => {
    return (
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Attendance Card */}
        <View style={styles.overallCard}>
          <Image 
            source={require('../assets/images/final_quest_240x240.png')} 
            style={styles.backgroundImage} 
            resizeMode="cover"
          />
          <View style={styles.overallContent}>
            <Text style={styles.overallText}>Overall Attendance</Text>
            <View style={styles.circularProgress}>
              <Text style={styles.percentageText}>{calculateOverallAttendance()}%</Text>
            </View>
          </View>
        </View>
        
        {/* Monthly Attendance Section */}
        <Text style={styles.sectionTitle}>Monthly Attendance</Text>
        
        {monthlyData.map((item, index) => (
          <TouchableOpacity 
            key={`${item.month}-${item.year}`}
            style={styles.monthCard}
            onPress={() => setSelectedMonth(item)}
          >
            <View style={styles.monthInfo}>
              <Text style={styles.monthName}>{item.month} {item.year}</Text>
              <Text style={styles.percentageBadgeText}>{item.percentage}%</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
        
        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };
  
  // Render the monthly detail view
  const renderMonthlyDetail = () => {
    if (!selectedMonth) return null;
    
    // Group records by status
    const presentDays = selectedMonth.records.filter(r => r.status === 'present').length;
    const absentDays = selectedMonth.records.filter(r => r.status === 'absent').length;
    const holidayDays = 1; // Mocked for demonstration
    
    // Sort records by date
    const sortedRecords = [...selectedMonth.records].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    return (
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.presentCard]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.present} />
            <Text style={styles.summaryLabel}>Present:</Text>
            <Text style={styles.summaryValue}>{presentDays} days</Text>
          </View>
          
          <View style={[styles.summaryCard, styles.absentCard]}>
            <Ionicons name="close-circle" size={20} color={colors.absent} />
            <Text style={styles.summaryLabel}>Absent:</Text>
            <Text style={styles.summaryValue}>{absentDays} day</Text>
          </View>
          
          <View style={[styles.summaryCard, styles.holidayCard]}>
            <Ionicons name="calendar" size={20} color={colors.textSecondary} />
            <Text style={styles.summaryLabel}>Holidays:</Text>
            <Text style={styles.summaryValue}>{holidayDays} day</Text>
          </View>
        </View>
        
        {/* Daily Records */}
        <View style={styles.dailyListContainer}>
          {sortedRecords.map((record, index) => (
            <View key={index} style={styles.dailyItem}>
              <Text style={styles.dateText}>{formatDate(record.date)}</Text>
              <Text 
                style={[
                  styles.statusText,
                  record.status === 'present' && styles.statusPresent,
                  record.status === 'absent' && styles.statusAbsent,
                  record.status === 'late' && styles.statusLate
                ]}
              >
                {record.status === 'present' ? 'Present' : 
                 record.status === 'absent' ? 'Absent' : 'Late'}
              </Text>
            </View>
          ))}
          
       
        </View>
        
        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };
  
  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: selectedMonth ? `${selectedMonth.month} ${selectedMonth.year} Attendance` : t('attendance'),
          headerTitleStyle: commonStyles.title,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => selectedMonth ? setSelectedMonth(null) : router.back()} 
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {selectedMonth ? renderMonthlyDetail() : renderAttendanceOverview()}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  overallCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 16,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  overallContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'Poppins_700Bold',
  },
  overallText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Poppins_700Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  monthCard: {
    ...commonStyles.card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    paddingVertical: 16,
  },
  monthInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  percentageBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: colors.backgroundAlt,
  },
  presentCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  absentCard: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  holidayCard: {
    backgroundColor: 'rgba(158, 158, 158, 0.1)',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 4,
    fontFamily: 'Nunito_600SemiBold',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
  dailyListContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
  },
  dailyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
  statusPresent: {
    color: colors.present,
  },
  statusAbsent: {
    color: colors.absent,
  },
  statusLate: {
    color: colors.late,
  },
  statusHoliday: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: 'Nunito_600SemiBold',
  },
});