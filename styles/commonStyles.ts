import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#2E7D32',      // School Green
  secondary: '#1976D2',    // School Blue
  accent: '#4CAF50',       // Light Green
  background: '#F8F9FA',   // Light background
  backgroundAlt: '#FFFFFF', // White background
  text: '#212121',         // Dark text
  textSecondary: '#757575', // Grey text
  grey: '#E0E0E0',         // Light Grey
  card: '#FFFFFF',         // White card background
  success: '#4CAF50',      // Green
  warning: '#FF9800',      // Orange
  error: '#F44336',        // Red
  info: '#2196F3',         // Blue
  present: '#4CAF50',      // Green for present
  absent: '#F44336',       // Red for absent
  late: '#FF9800',         // Orange for late
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
    fontFamily: 'Nunito_400Regular',
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  smallCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    elevation: 2,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    elevation: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
  },
  headerContainer: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  tabContainer: {
    backgroundColor: colors.backgroundAlt,
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    elevation: 8,
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)',
  },
});