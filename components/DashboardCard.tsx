import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';

interface DashboardCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  onPress?: () => void;
  showViewAll?: boolean;
}

export default function DashboardCard({ title, icon, children, onPress, showViewAll = true }: DashboardCardProps) {
  return (
    <View style={[commonStyles.card, styles.card]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name={icon} size={24} color={colors.primary} style={styles.icon} />
          <Text style={[commonStyles.subtitle, styles.title]}>{title}</Text>
        </View>
        {showViewAll && onPress && (
          <TouchableOpacity onPress={onPress} style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'Nunito_600SemiBold',
    marginRight: 4,
  },
  content: {
    // Content styles will be handled by children
  },
});