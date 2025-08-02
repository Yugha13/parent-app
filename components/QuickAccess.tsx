import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

interface QuickAccessItem {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  backgroundColor: string;
}

export default function QuickAccess() {
  const { t } = useTranslation();
  const router = useRouter();

  const quickAccessItems: QuickAccessItem[] = [
    {
      title: t('timetable'),
      icon: 'calendar',
      route: '/timetable',
      color: '#5A78FF',
      backgroundColor: 'rgba(90, 120, 255, 0.1)',
    },
    {
      title: t('homework'),
      icon: 'document-text',
      route: '/homework',
      color: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    {
      title: t('exams'),
      icon: 'create',
      route: '/exams',
      color: '#9C27B0',
      backgroundColor: 'rgba(156, 39, 176, 0.1)',
    },
    {
      title: t('fees'),
      icon: 'card',
      route: '/fees',
      color: '#FF9800',
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('quickAccess')}</Text>
      
      <View style={styles.itemsContainer}>
        {quickAccessItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.item}
            onPress={() => router.push(item.route)}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <Text style={styles.itemTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    width: '22%',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold',
  },
});