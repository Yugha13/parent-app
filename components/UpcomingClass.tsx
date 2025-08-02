import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface ClassInfo {
  subject: string;
  teacher: string;
  room: string;
  time: string;
  duration: string;
}

interface UpcomingClassProps {
  classInfo: ClassInfo;
  onJoinPress?: () => void;
}

export default function UpcomingClass({ classInfo, onJoinPress }: UpcomingClassProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="calculator-outline" size={24} color={colors.primary} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.subject}>{classInfo.subject}</Text>
        <Text style={styles.teacher}>Prof. {classInfo.teacher}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.room}>Room {classInfo.room}</Text>
        </View>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{classInfo.time}</Text>
        <Text style={styles.duration}>{classInfo.duration}</Text>
        
        {onJoinPress && (
          <TouchableOpacity style={styles.joinButton} onPress={onJoinPress}>
            <Text style={styles.joinText}>Join Now</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(90, 120, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Poppins_600SemiBold',
  },
  teacher: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  room: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
    fontFamily: 'Nunito_400Regular',
  },
  timeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold',
  },
  duration: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Nunito_400Regular',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  joinText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 4,
    fontFamily: 'Nunito_600SemiBold',
  },
});