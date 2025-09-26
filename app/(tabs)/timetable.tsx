import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { mockChildren, mockTimetable } from '../../data/mockData';
import { Child, TimetableEntry } from '../../types';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../utils/AuthContext';
import { useRouter } from 'expo-router';

// Define days of the week
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimetableScreen() {
  const { user, loading:data_loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, data_loading]);
  if (data_loading || !user) return null;

  const { t } = useTranslation();
  const [selectedChild, setSelectedChild] = useState<Child>(mockChildren[0]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Refresh timetable when child changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedChild]);

  const getTimetableForDay = (day: string): TimetableEntry[] => {
    // Filter timetable entries by the selected day
    const allEntries = mockTimetable[selectedChild.id] || [];
    return allEntries.filter(entry => entry.day === day);
  };

  // Get translated day names
  const getTranslatedDay = (day: string) => {
    const dayMap: { [key: string]: string } = {
      'Monday': t('monday'),
      'Tuesday': t('tuesday'),
      'Wednesday': t('wednesday'),
      'Thursday': t('thursday'),
      'Friday': t('friday'),
      'Saturday': t('saturday'),
      'Sunday': t('sunday'),
    };
    return dayMap[day] || day;
  };

  // Render day selector with improved UI
  const renderDaySelector = () => (
    <View style={styles.daySelectorContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
        {DAYS.slice(0, 6).map((day) => {
          const isSelected = selectedDay === day;
          const shortDay = getTranslatedDay(day).substring(0, 3);
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, isSelected && styles.selectedDayButton]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                {shortDay}
              </Text>
              {isSelected && <View style={styles.selectedDayDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // Render timetable entry with improved UI
  const renderTimetableEntry = (entry: TimetableEntry, index: number) => {
    const subjectColor = getSubjectColor(entry.subject);
    const translatedSubject = t(entry.subject.toLowerCase().replace(' ', '_'));
    
    return (
      <View key={entry.id} style={styles.timetableEntry}>
        <View style={[styles.subjectIndicator, { backgroundColor: subjectColor }]} />
        <View style={styles.entryContent}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} style={styles.timeIcon} />
            <Text style={styles.time}>{entry.time}</Text>
          </View>
          <Text style={styles.subject}>{translatedSubject || entry.subject}</Text>
          <View style={styles.detailsRow}>
            <View style={styles.teacherContainer}>
              <Ionicons name="person-outline" size={14} color={colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.teacher}>{entry.teacher}</Text>
            </View>
            <View style={styles.roomContainer}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.room}>{entry.room}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const getSubjectColor = (subject: string): string => {
    const colors_map: { [key: string]: string } = {
      'Mathematics': '#4CAF50', // Green
      'Science': '#4CAF50', // Green
      'English': '#2196F3', // Blue
      'History': '#FF9800', // Orange
      'Physical Education': '#F44336', // Red
      'Art': '#9C27B0', // Purple
      'Hindi': '#FF5722', // Deep Orange
    };
    return colors_map[subject] || colors.textSecondary;
  };

  const dayTimetable = getTimetableForDay(selectedDay);

  console.log('Timetable screen rendered for:', selectedChild.name, 'Day:', selectedDay);

  return (
    <View style={commonStyles.container}>
      <StatusBar style="auto" />
      <View style={commonStyles.headerContainer}>
        <Text style={commonStyles.title}>{t('timetable')}</Text>
      </View>

      {renderDaySelector()}

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.dayTitle}>{getTranslatedDay(selectedDay)}</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>{t('loadingTimetable')}</Text>
          </View>
        ) : dayTimetable.length > 0 ? (
          <View style={styles.timetableList}>
            {dayTimetable.map((entry, index) => renderTimetableEntry(entry, index))}
          </View>
        ) : (
          <View style={styles.noClassesContainer}>
            <Image 
              source={require('../../assets/images/natively-dark.png')} 
              style={styles.noClassesImage} 
              resizeMode="contain"
            />
            <Text style={styles.noClassesText}>
              {t('noClassesScheduled')} {getTranslatedDay(selectedDay)}
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  daySelectorContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  daySelector: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 50,
    justifyContent: 'center',
  },
  selectedDayButton: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  selectedDayText: {
    color: colors.backgroundAlt,
  },
  selectedDayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.backgroundAlt,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
    marginLeft: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  timetableList: {
    paddingBottom: 16,
  },
  timetableEntry: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.grey,
  },
  entryContent: {
    flex: 1,
    padding: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeIcon: {
    marginRight: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teacherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    flex: 1,
  },
  roomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 6,
  },
  teacher: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  room: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  subjectIndicator: {
    width: 6,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  noClassesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 24,
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  noClassesImage: {
    width: 220,
    height: 220,
    marginBottom: 20,
    opacity: 0.9,
  },
  noClassesText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 26,
  }
});