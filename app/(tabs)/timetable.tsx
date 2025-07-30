import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import ChildSelector from '../../components/ChildSelector';
import { mockChildren, mockTimetable } from '../../data/mockData';
import { Child, TimetableEntry } from '../../types';
import { StatusBar } from 'expo-status-bar';

// Define days of the week
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimetableScreen() {
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
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, isSelected && styles.selectedDayButton]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                {getTranslatedDay(day).substring(0, 3)}
              </Text>
              {isSelected && <View style={styles.selectedDayIndicator} />}
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
      <View key={entry.id} style={[commonStyles.smallCard, styles.timetableEntry]}>
        <View style={[styles.subjectIndicator, { backgroundColor: subjectColor }]} />
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color={colors.primary} style={styles.timeIcon} />
          <Text style={styles.time}>{entry.time}</Text>
        </View>
        <View style={styles.classDetails}>
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
      'Mathematics': colors.primary,
      'Science': colors.success,
      'English': colors.info,
      'History': colors.warning,
      'Physical Education': colors.error,
      'Art': '#9C27B0',
      'Hindi': '#FF5722',
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
          dayTimetable.map((entry, index) => renderTimetableEntry(entry, index))
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
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  daySelector: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dayButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 24,
    backgroundColor: colors.background,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'center',
  },
  selectedDayButton: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  selectedDayText: {
    color: colors.backgroundAlt,
  },
  selectedDayIndicator: {
    width: 6,
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 16,
    fontFamily: 'Poppins_700Bold',
  },
  timetableEntry: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 20,
    marginBottom: 16,
    marginHorizontal: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  timeContainer: {
    width: 100,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  timeIcon: {
    marginRight: 4,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold',
  },
  classDetails: {
    flex: 1,
    marginTop: 4,
  },
  subject: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.2,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  teacherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 100,
    justifyContent: 'center',
  },
  detailIcon: {
    marginRight: 6,
  },
  teacher: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Nunito_600SemiBold',
  },
  room: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Nunito_600SemiBold',
  },
  subjectIndicator: {
    width: 8,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
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
    borderColor: 'rgba(0,0,0,0.03)',
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