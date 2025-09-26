import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { mockAttendance, mockChildren } from '../data/mockData';
import { AttendanceRecord } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../utils/AuthContext';
import { useEffect } from 'react';

interface MonthlyAttendance {
  month: string;
  year: number;
  percentage: number;
  records: AttendanceRecord[];
}

export default function AttendancePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);
  if (loading || !user) return null;

  const { t } = useTranslation();
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
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
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
            <Ionicons name="checkmark-circle" size={24} color={colors.present} />
            <Text style={styles.summaryLabel}>Present:</Text>
            <Text style={styles.summaryValue}>{presentDays} days</Text>
          </View>
          
          <View style={[styles.summaryCard, styles.absentCard]}>
            <Ionicons name="close-circle" size={24} color={colors.absent} />
            <Text style={styles.summaryLabel}>Absent:</Text>
            <Text style={styles.summaryValue}>{absentDays} day</Text>
          </View>
          
          <View style={[styles.summaryCard, styles.holidayCard]}>
            <Ionicons name="calendar" size={24} color="#4CAF50" />
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
          headerTitleStyle: [commonStyles.title, { color: colors.primary }],
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => selectedMonth ? setSelectedMonth(null) : router.back()} 
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
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
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 24,
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  overallCard: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overallContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 24,
  },
  circularProgress: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2E7D32',
    fontFamily: 'Poppins_700Bold',
  },
  overallText: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Poppins_700Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  monthCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    marginLeft: 16,
    fontFamily: 'Nunito_700Bold',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 6,
    backgroundColor: colors.backgroundAlt,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  presentCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderTopWidth: 4,
    borderTopColor: '#4CAF50',
  },
  absentCard: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderTopWidth: 4,
    borderTopColor: '#F44336',
  },
  holidayCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    borderTopWidth: 4,
    borderTopColor: '#4CAF50',
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    fontFamily: 'Nunito_600SemiBold',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 4,
    fontFamily: 'Nunito_700Bold',
  },
  dailyListContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dailyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPresent: {
    color: '#FFFFFF',
    backgroundColor: '#4CAF50',
  },
  statusAbsent: {
    color: '#FFFFFF',
    backgroundColor: '#F44336',
  },
  statusLate: {
    color: '#FFFFFF',
    backgroundColor: '#FF9800',
  },
  statusHoliday: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: '#4CAF50',
    fontFamily: 'Nunito_700Bold',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
});