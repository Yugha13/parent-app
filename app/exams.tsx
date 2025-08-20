import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { mockChildren, mockExamResults } from '../data/mockData';
import { Child, ExamResult } from '../types/index';
import { useTranslation } from 'react-i18next';

type ExamType = 'unitTest1' | 'unitTest2' | 'unitTest3' | 'midTerm' | 'endTerm';

interface Subject {
  id: string;
  name: string;
  status: 'completed' | 'scheduled' | 'pending';
  marks?: number;
  totalMarks?: number;
  grade?: string;
  scheduledDate?: string;
}

const ExamsScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<Child>(mockChildren[0]);
  const [selectedExamType, setSelectedExamType] = useState<ExamType>('unitTest1');
  const [showSubjects, setShowSubjects] = useState(false);

  // Mock data for exams
  const examData = {
    unitTest1: {
      subjects: [
        { id: '1', name: 'Mathematics', status: 'completed', marks: 85, totalMarks: 100, grade: 'A' },
        { id: '2', name: 'Science', status: 'completed', marks: 78, totalMarks: 100, grade: 'B+' },
        { id: '3', name: 'English', status: 'scheduled', scheduledDate: '2024-03-15' },
        { id: '4', name: 'Hindi', status: 'scheduled', scheduledDate: '2024-03-18' },
        { id: '5', name: 'Social Studies', status: 'pending' },
      ],
    },
    unitTest2: {
      subjects: [
        { id: '6', name: 'Mathematics', status: 'scheduled', scheduledDate: '2024-04-10' },
        { id: '7', name: 'Science', status: 'scheduled', scheduledDate: '2024-04-12' },
        { id: '8', name: 'English', status: 'scheduled', scheduledDate: '2024-04-15' },
        { id: '9', name: 'Hindi', status: 'scheduled', scheduledDate: '2024-04-18' },
        { id: '10', name: 'Social Studies', status: 'pending' },
      ],
    },
    unitTest3: {
      subjects: [
        { id: '11', name: 'Mathematics', status: 'pending' },
        { id: '12', name: 'Science', status: 'pending' },
        { id: '13', name: 'English', status: 'pending' },
        { id: '14', name: 'Hindi', status: 'pending' },
        { id: '15', name: 'Social Studies', status: 'pending' },
      ],
    },
    midTerm: {
      subjects: [
        { id: '16', name: 'Mathematics', status: 'completed', marks: 92, totalMarks: 100, grade: 'A+' },
        { id: '17', name: 'Science', status: 'completed', marks: 88, totalMarks: 100, grade: 'A' },
        { id: '18', name: 'English', status: 'completed', marks: 95, totalMarks: 100, grade: 'A+' },
        { id: '19', name: 'Hindi', status: 'completed', marks: 90, totalMarks: 100, grade: 'A+' },
        { id: '20', name: 'Social Studies', status: 'completed', marks: 85, totalMarks: 100, grade: 'A' },
      ],
    },
    endTerm: {
      subjects: [
        { id: '21', name: 'Mathematics', status: 'scheduled', scheduledDate: '2024-05-15' },
        { id: '22', name: 'Science', status: 'scheduled', scheduledDate: '2024-05-17' },
        { id: '23', name: 'English', status: 'scheduled', scheduledDate: '2024-05-20' },
        { id: '24', name: 'Hindi', status: 'scheduled', scheduledDate: '2024-05-22' },
        { id: '25', name: 'Social Studies', status: 'scheduled', scheduledDate: '2024-05-24' },
      ],
    },
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Helper function to get subjects for the selected exam type
  const getSubjectsForExamType = (examType: ExamType): Subject[] => {
    return examData[examType].subjects;
  };

  // Function to get color based on grade
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return '#4CAF50';
      case 'A': return '#8BC34A';
      case 'B+': return '#CDDC39';
      case 'B': return '#FFEB3B';
      case 'C+': return '#FFC107';
      case 'C': return '#FF9800';
      case 'D': return '#FF5722';
      case 'F': return '#F44336';
      default: return '#757575';
    }
  };

  // Render exam type selector
  const renderExamTypeSelector = () => {
    const examTypes: { key: ExamType; label: string }[] = [
      { key: 'unitTest1', label: t('unitTest1') },
      { key: 'unitTest2', label: t('unitTest2') },
      { key: 'unitTest3', label: t('unitTest3') },
      { key: 'midTerm', label: t('midTerm') },
      { key: 'endTerm', label: t('endTerm') },
    ];

    return (
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>{t('selectExamType')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.examTypeScroll}>
          {examTypes.map((examType) => (
            <TouchableOpacity
              key={examType.key}
              style={[
                styles.examTypeButton,
                selectedExamType === examType.key && styles.selectedExamTypeButton,
              ]}
              onPress={() => {
                setSelectedExamType(examType.key);
                setShowSubjects(true);
              }}
            >
              <Text
                style={[
                  styles.examTypeText,
                  selectedExamType === examType.key && styles.selectedExamTypeText,
                ]}
              >
                {examType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  

  // Render subject list
  const renderSubjectList = () => {
    const subjects = getSubjectsForExamType(selectedExamType);

    return (
      <View style={styles.subjectsContainer}>
        <Text style={styles.subjectsTitle}>{t('subjects')}</Text>
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.subjectItem}>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{item.name}</Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: 
                    item.status === 'completed' ? '#4CAF50' : 
                    item.status === 'scheduled' ? '#2196F3' : '#FFC107'
                }]}>
                  <Text style={styles.statusText}>{t(item.status)}</Text>
                </View>
              </View>
              
              {item.status === 'completed' && (
                <View style={styles.resultContainer}>
                  <Text style={styles.marksText}>
                    {t('marks')}: <Text style={styles.marksValue}>{item.marks}/{item.totalMarks}</Text>
                  </Text>
                  <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade || '') }]}>
                    <Text style={styles.gradeText}>{item.grade}</Text>
                  </View>
                </View>
              )}
              
              {item.status === 'scheduled' && (
                <Text style={styles.dateText}>
                  {t('scheduledDate')}: <Text style={styles.dateValue}>{formatDate(item.scheduledDate || '')}</Text>
                </Text>
              )}
              
              {item.status === 'pending' && (
                <Text style={styles.pendingText}>{t('dateWillBeUpdated')}</Text>
              )}
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Stack.Screen
        options={{
          headerTitle: t('exams'),
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        {renderExamTypeSelector()}
        {showSubjects && renderSubjectList()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  childSelectorContainer: {
    marginBottom: 16,
  },
  selectorContainer: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  childScroll: {
    flexGrow: 0,
  },
  childButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  selectedChildButton: {
    backgroundColor: '#2196F3',
  },
  childButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedChildButtonText: {
    color: '#fff',
  },
  examTypeScroll: {
    flexGrow: 0,
  },
  examTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  selectedExamTypeButton: {
    backgroundColor: '#2196F3',
  },
  examTypeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedExamTypeText: {
    color: '#fff',
  },
  subjectsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  subjectItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marksText: {
    fontSize: 14,
    color: '#666',
  },
  marksValue: {
    fontWeight: '600',
    color: '#333',
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  gradeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  dateValue: {
    fontWeight: '500',
    color: '#2196F3',
  },
  pendingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#757575',
  },
});
export default ExamsScreen;
