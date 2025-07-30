import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import ChildSelector from '../components/ChildSelector';
import AttendanceOverview from '../components/AttendanceOverview';
import { mockChildren, mockAttendance } from '../data/mockData';
import { Child, AttendanceRecord } from '../types';

type PeriodType = 'week' | 'month' | 'year';

export default function AttendanceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<Child>(mockChildren[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');

  const getAttendanceForPeriod = (period: PeriodType): AttendanceRecord[] => {
    const attendance = mockAttendance[selectedChild.id] || [];
    const now = new Date();
    
    switch (period) {
      case 'week':
        // Last 7 days
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return attendance.filter(record => new Date(record.date) >= weekAgo);
      
      case 'month':
        // Last 30 days
        const monthAgo = new Date(now);
        monthAgo.setDate(now.getDate() - 30);
        return attendance.filter(record => new Date(record.date) >= monthAgo);
      
      case 'year':
        // All records (for demo purposes)
        return attendance;
      
      default:
        return attendance;
    }
  };

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'week' && styles.selectedPeriodButton]}
        onPress={() => setSelectedPeriod('week')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'week' && styles.selectedPeriodText]}>
          {t('thisWeek')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'month' && styles.selectedPeriodButton]}
        onPress={() => setSelectedPeriod('month')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'month' && styles.selectedPeriodText]}>
          {t('thisMonth')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'year' && styles.selectedPeriodButton]}
        onPress={() => setSelectedPeriod('year')}
      >
        <Text style={[styles.periodText, selectedPeriod === 'year' && styles.selectedPeriodText]}>
          {t('This Year')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const periodAttendance = getAttendanceForPeriod(selectedPeriod);

  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('attendanceOverview'),
          headerTitleStyle: commonStyles.title,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      

      {renderPeriodSelector()}

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.attendanceContainer}>
          <AttendanceOverview attendance={periodAttendance} />
        </View>

        <View style={styles.detailedAttendance}>
          <Text style={styles.sectionTitle}>{t('detailedAttendance')}</Text>
          
          {periodAttendance.map((record, index) => {
            const date = new Date(record.date);
            const formattedDate = date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });
            
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'present': return colors.present;
                case 'absent': return colors.absent;
                case 'late': return colors.late;
                default: return colors.textSecondary;
              }
            };
            
            const getStatusIcon = (status: string) => {
              switch (status) {
                case 'present': return 'checkmark-circle';
                case 'absent': return 'close-circle';
                case 'late': return 'time';
                default: return 'help-circle';
              }
            };
            
            const getStatusText = (status: string) => {
              switch (status) {
                case 'present': return t('present');
                case 'absent': return t('absent');
                case 'late': return t('late');
                default: return status;
              }
            };
            
            return (
              <View key={index} style={styles.attendanceRecord}>
                <View style={styles.dateContainer}>
                  <Text style={styles.date}>{formattedDate}</Text>
                </View>
                <View style={[styles.statusContainer, { backgroundColor: getStatusColor(record.status) + '20' }]}>
                  <Ionicons 
                    name={getStatusIcon(record.status)} 
                    size={20} 
                    color={getStatusColor(record.status)} 
                    style={styles.statusIcon} 
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(record.status) }]}>
                    {getStatusText(record.status)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

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
    paddingHorizontal: 16,
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
  attendanceContainer: {
    marginVertical: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailedAttendance: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  attendanceRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
});