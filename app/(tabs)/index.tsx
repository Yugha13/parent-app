import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import ChildSelector from '../../components/ChildSelector';
import AttendanceSummary from '../../components/AttendanceSummary';
import UpcomingClass from '../../components/UpcomingClass';
import AnnouncementItem from '../../components/AnnouncementItem';
import QuickAccess from '../../components/QuickAccess';
import { 
  mockChildren, 
  mockAttendance, 
  mockHomework, 
  mockExamResults, 
  mockTimetable, 
  mockFees 
} from '../../data/mockData';
import { Child } from '../../types';
import { Ionicons } from '@expo/vector-icons';

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

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getNextClass = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = mockTimetable[selectedChild.id]?.filter(entry => entry.day === today) || [];
    
    if (todayClasses.length === 0) return null;
    
    // For demo purposes, just return the first class
    const nextClass = todayClasses[0];
    return {
      subject: nextClass.subject,
      teacher: nextClass.teacher,
      room: nextClass.room,
      time: nextClass.time,
      duration: '45 mins'
    };
  };

  const getRecentAnnouncements = () => {
    // Mock announcements data
    return [
      {
        title: 'Holiday Notice',
        content: 'School will be closed on Monday, July 22 due to national holiday.',
        time: '2 hours ago',
        type: 'alert' as const
      },
      {
        title: 'Math Test Tomorrow',
        content: 'Prepare for your calculus test. Chapters 5-7 will be covered.',
        time: 'Yesterday',
        type: 'info' as const
      }
    ];
  };

  const nextClass = getNextClass();
  const announcements = getRecentAnnouncements();

  return (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header with greeting and profile */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.date}>{getCurrentDate()}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Image 
              source={{ uri: selectedChild.profilePic }} 
              style={styles.profileImage} 
            />
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
        </View>

        {/* Child Selector */}
        <ChildSelector
          children={mockChildren}
          selectedChild={selectedChild}
          onSelectChild={setSelectedChild}
        />

      

        {/* Attendance Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('attendanceSummary')}</Text>
          <AttendanceSummary attendance={mockAttendance[selectedChild.id] || []} />
        </View>

         {/* Quick Access */}
        <QuickAccess />
        
        {/* Recent Announcements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('recentAnnouncements')}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/announcements')}>
              <Text style={styles.viewAllText}>{t('viewAll')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.announcementsContainer}>
            {announcements.map((announcement, index) => (
              <AnnouncementItem 
                key={index}
                title={announcement.title}
                content={announcement.content}
                time={announcement.time}
                type={announcement.type}
              />
            ))}
          </View>
        </View>

       

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins_700Bold',
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontFamily: 'Nunito_400Regular',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    position: 'relative',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.background,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  noClassContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noClassText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    fontFamily: 'Nunito_600SemiBold',
  },
  viewAllButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold',
  },
  announcementsContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
  },
});