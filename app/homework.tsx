import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { mockHomework, mockChildren } from '../data/mockData';
import { Homework } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../utils/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeworkPage() {
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
  const [selectedDate, setSelectedDate] = useState<'today' | 'yesterday'>('today');
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const tabSlideAnim = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  
  // Get homework data for the selected child
  const homeworkData = mockHomework[selectedChild.id] || [];
  
  useEffect(() => {
    // Initial loading animation
    setIsLoading(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    // Tab transition animation
    Animated.timing(tabSlideAnim, {
      toValue: selectedDate === 'today' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedDate]);
  
  // Filter homework based on selected date
  const getFilteredHomework = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return homeworkData.filter(homework => {
      const dueDate = new Date(homework.dueDate);
      if (selectedDate === 'today') {
        return dueDate.toDateString() === today.toDateString();
      } else {
        return dueDate.toDateString() === yesterday.toDateString();
      }
    });
  };
  
  // Get homework by status for yesterday view
  const getHomeworkByStatus = () => {
    const filtered = getFilteredHomework();
    return {
      completed: filtered.filter(h => h.status === 'completed'),
      pending: filtered.filter(h => h.status === 'pending'),
      overdue: filtered.filter(h => h.status === 'overdue')
    };
  };
  
  const getSubjectColor = (subject: string) => {
    const colorMap = {
      'Mathematics': '#6366F1', // Indigo
      'Math': '#6366F1',
      'Science': '#F59E0B', // Amber
      'History': '#10B981', // Emerald
      'English': '#8B5CF6', // Violet
      'Physics': '#EF4444', // Red
      'Chemistry': '#06B6D4', // Cyan
      'Biology': '#84CC16', // Lime
    };
    return colorMap[subject as keyof typeof colorMap] || '#6B7280';
  };
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: '#10B981',
          backgroundColor: '#D1FAE5',
          textColor: '#065F46',
          icon: 'checkmark-circle',
          text: 'Completed'
        };
      case 'pending':
        return {
          color: '#F59E0B',
          backgroundColor: '#FEF3C7',
          textColor: '#92400E',
          icon: 'time',
          text: 'Pending'
        };
      case 'overdue':
        return {
          color: '#EF4444',
          backgroundColor: '#FEE2E2',
          textColor: '#991B1B',
          icon: 'alert-circle',
          text: 'Not Submitted'
        };
      default:
        return {
          color: '#6B7280',
          backgroundColor: '#F3F4F6',
          textColor: '#374151',
          icon: 'help-circle',
          text: 'Unknown'
        };
    }
  };

  const animateCard = (cardId: string) => {
    if (!cardAnimations[cardId]) {
      cardAnimations[cardId] = new Animated.Value(1);
    }
    
    Animated.sequence([
      Animated.timing(cardAnimations[cardId], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnimations[cardId], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const renderHomeworkCard = (homework: Homework, index: number) => {
    const subjectColor = getSubjectColor(homework.subject);
    const statusConfig = getStatusConfig(homework.status);
    const cardId = `${homework.id}-${index}`;
    
    if (!cardAnimations[cardId]) {
      cardAnimations[cardId] = new Animated.Value(1);
    }

    const cardStyle = selectedDate === 'yesterday' 
      ? [styles.homeworkCardYesterday, { backgroundColor: statusConfig.backgroundColor }]
      : styles.homeworkCard;
    
    return (
      <Animated.View
        key={cardId}
        style={[
          cardStyle,
          {
            transform: [
              { scale: cardAnimations[cardId] },
              { 
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }
            ],
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => animateCard(cardId)}
          style={styles.cardTouchable}
        >
          {selectedDate === 'today' && (
            <View style={[styles.subjectIndicator, { backgroundColor: subjectColor }]} />
          )}
          
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.subjectRow}>
                <Text style={[
                  styles.subjectTitle, 
                  selectedDate === 'yesterday' && { color: statusConfig.textColor }
                ]}>
                  {homework.subject}
                </Text>
                {selectedDate === 'yesterday' && (
                  <Ionicons 
                    name={statusConfig.icon as any} 
                    size={16} 
                    color={statusConfig.color} 
                    style={styles.statusIcon}
                  />
                )}
              </View>
              
              <View style={[
                styles.statusBadge, 
                { 
                  backgroundColor: selectedDate === 'today' ? subjectColor : statusConfig.color,
                }
              ]}>
                <Text style={styles.statusText}>
                  {selectedDate === 'today' ? 'Due Today' : statusConfig.text}
                </Text>
              </View>
            </View>
            
            <Text style={[
              styles.description,
              selectedDate === 'yesterday' && { color: statusConfig.textColor }
            ]}>
              {selectedDate === 'yesterday' && homework.status === 'completed' 
                ? `Completed ${homework.title.toLowerCase()}`
                : homework.description
              }
            </Text>
            
            {homework.attachments && homework.attachments.length > 0 && (
              <View style={styles.attachmentRow}>
                <View style={[styles.attachmentBadge, { backgroundColor: subjectColor + '20' }]}>
                  <Ionicons name="attach" size={14} color={subjectColor} />
                  <Text style={[styles.attachmentText, { color: subjectColor }]}>
                    {homework.attachments.length} Attachment{homework.attachments.length > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            )}
            
            {selectedDate === 'today' && (
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.radioButton, { borderColor: subjectColor }]}>
                  <View style={[styles.radioCircle, { backgroundColor: 'transparent' }]} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderTodayView = () => {
    const todayHomework = getFilteredHomework();
    
    return (
      <Animated.View 
        style={[
          styles.section,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Homework</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {todayHomework.length === 0 ? (
          <Animated.View 
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }]
              }
            ]}
          >
            <View style={styles.emptyIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyText}>No homework due today. Great job!</Text>
          </Animated.View>
        ) : (
          todayHomework.map((homework, index) => renderHomeworkCard(homework, index))
        )}
      </Animated.View>
    );
  };
  
  const renderYesterdayView = () => {
    const { completed, pending, overdue } = getHomeworkByStatus();
    const allHomework = [...completed, ...pending, ...overdue];
    
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        {completed.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Checked Homeworks</Text>
              <View style={[styles.countBadge, { backgroundColor: colors.success + '20' }]}>
                <Text style={[styles.countText, { color: colors.success }]}>
                  {completed.length}
                </Text>
              </View>
            </View>
            {completed.map((homework, index) => renderHomeworkCard(homework, index))}
          </View>
        )}
        
        {pending.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pending Homeworks</Text>
              <View style={[styles.countBadge, { backgroundColor: colors.warning + '20' }]}>
                <Text style={[styles.countText, { color: colors.warning }]}>
                  {pending.length}
                </Text>
              </View>
            </View>
            {pending.map((homework, index) => renderHomeworkCard(homework, index))}
          </View>
        )}
        
        {overdue.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Overdue Homeworks</Text>
              <View style={[styles.countBadge, { backgroundColor: colors.error + '20' }]}>
                <Text style={[styles.countText, { color: colors.error }]}>
                  {overdue.length}
                </Text>
              </View>
            </View>
            {overdue.map((homework, index) => renderHomeworkCard(homework, index))}
          </View>
        )}
        
        {allHomework.length === 0 && (
          <Animated.View 
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
                transform: [{ scale: fadeAnim }]
              }
            ]}
          >
            <View style={styles.emptyIconContainer}>
              <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No homework yesterday</Text>
            <Text style={styles.emptyText}>Check back tomorrow for new assignments</Text>
          </Animated.View>
        )}
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <Stack.Screen
        options={{
          title: 'Homework Page',
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity style={styles.figmaButton}>
              <Ionicons name="logo-figma" size={18} color={colors.text} />
              <Text style={styles.figmaText}>Copy to Figma</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Header Banner */}
        <Animated.View
          style={[
            styles.headerBanner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Homework Assignments</Text>
              <Text style={styles.headerSubtitle}>
                Track and manage {selectedDate === 'today' ? "today's" : "yesterday's"} tasks.
              </Text>
            </View>
            <TouchableOpacity style={styles.calendarButton}>
              <Ionicons name="calendar" size={24} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
        
        {/* Enhanced Date Navigation */}
        <Animated.View
          style={[
            styles.dateNavigation,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.tabContainer}>
            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  transform: [
                    {
                      translateX: tabSlideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [4, screenWidth / 2 - 20],
                      }),
                    },
                  ],
                },
              ]}
            />
            
            <TouchableOpacity
              style={[
                styles.dateTab,
                selectedDate === 'today' && styles.dateTabActive
              ]}
              onPress={() => setSelectedDate('today')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dateTabText,
                selectedDate === 'today' && styles.dateTabTextActive
              ]}>
                Today
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.dateTab,
                selectedDate === 'yesterday' && styles.dateTabActive
              ]}
              onPress={() => setSelectedDate('yesterday')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dateTabText,
                selectedDate === 'yesterday' && styles.dateTabTextActive
              ]}>
                Yesterday
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {/* Content */}
        <View style={styles.content}>
          {selectedDate === 'today' ? renderTodayView() : renderYesterdayView()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  figmaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.grey,
  },
  figmaText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  headerBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  gradientBackground: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
    fontFamily: 'Poppins_700Bold',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'white',
    opacity: 0.9,
    fontFamily: 'Nunito_400Regular',
  },
  calendarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNavigation: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  tabContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 4,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 44,
    width: screenWidth / 2 - 24,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dateTab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 1,
  },
  dateTabActive: {
    // Active styles handled by indicator
  },
  dateTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: 'Poppins_600SemiBold',
  },
  dateTabTextActive: {
    color: 'white',
  },
  content: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins_700Bold',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  homeworkCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  homeworkCardYesterday: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTouchable: {
    flex: 1,
    flexDirection: 'row',
  },
  subjectIndicator: {
    width: 6,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins_700Bold',
  },
  statusIcon: {
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
    fontFamily: 'Nunito_400Regular',
  },
  attachmentRow: {
    marginBottom: 12,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  attachmentText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    fontFamily: 'Nunito_500Medium',
  },
  actionButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Poppins_600SemiBold',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Nunito_400Regular',
  },
});
