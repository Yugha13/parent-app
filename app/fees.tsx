import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import ChildSelector from '../components/ChildSelector';
import { mockChildren, mockFees } from '../data/mockData';
import { Child, Fee } from '../types';

type FilterType = 'all' | 'paid' | 'pending' | 'overdue';

export default function FeesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedChild, setSelectedChild] = useState<Child>(mockChildren[0]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const getFilteredFees = (filter: FilterType): Fee[] => {
    const fees = mockFees[selectedChild.id] || [];
    
    switch (filter) {
      case 'paid':
        return fees.filter(fee => fee.status === 'paid');
      case 'pending':
        return fees.filter(fee => fee.status === 'pending');
      case 'overdue':
        return fees.filter(fee => fee.status === 'overdue');
      default:
        return fees;
    }
  };

  const renderFilterSelector = () => (
    <View style={styles.filterSelector}>
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'all' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('all')}
      >
        <Text style={[styles.filterText, selectedFilter === 'all' && styles.selectedFilterText]}>
          {t('all')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'paid' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('paid')}
      >
        <Text style={[styles.filterText, selectedFilter === 'paid' && styles.selectedFilterText]}>
          {t('paid')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'pending' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('pending')}
      >
        <Text style={[styles.filterText, selectedFilter === 'pending' && styles.selectedFilterText]}>
          {t('pending')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, selectedFilter === 'overdue' && styles.selectedFilterButton]}
        onPress={() => setSelectedFilter('overdue')}
      >
        <Text style={[styles.filterText, selectedFilter === 'overdue' && styles.selectedFilterText]}>
          {t('overdue')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'pending': return colors.warning;
      case 'overdue': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return t('paid');
      case 'pending': return t('pending');
      case 'overdue': return t('overdue');
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredFees = getFilteredFees(selectedFilter);
  
  // Calculate total fees statistics
  const totalAmount = filteredFees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidAmount = filteredFees
    .filter(fee => fee.status === 'paid')
    .reduce((sum, fee) => sum + fee.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <View style={commonStyles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t('fees'),
          headerTitleStyle: commonStyles.title,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

   

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('totalFees')}</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalAmount)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('paidAmount')}</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                {formatCurrency(paidAmount)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('pendingAmount')}</Text>
              <Text style={[styles.summaryValue, { color: pendingAmount > 0 ? colors.warning : colors.success }]}>
                {formatCurrency(pendingAmount)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {renderFilterSelector()}

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {filteredFees.length > 0 ? (
          filteredFees.map((fee) => (
            <View key={fee.id} style={styles.feeCard}>
              <View style={styles.feeHeader}>
                <View style={styles.feeTypeContainer}>
                  <Text style={styles.feeType}>{fee.type}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(fee.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(fee.status)}</Text>
                  </View>
                </View>
                <Text style={styles.dueDate}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                  {' '}{t('dueDate')}: {formatDate(fee.dueDate)}
                </Text>
              </View>
              
              <View style={styles.feeDetails}>
                <View style={styles.feeDetailRow}>
                  <Text style={styles.feeDetailLabel}>{t('term')}:</Text>
                  <Text style={styles.feeDetailValue}>{fee.term}</Text>
                </View>
                
                <View style={styles.feeDetailRow}>
                  <Text style={styles.feeDetailLabel}>{t('amount')}:</Text>
                  <Text style={styles.feeDetailValue}>{formatCurrency(fee.amount)}</Text>
                </View>
                
                {fee.status === 'paid' && (
                  <View style={styles.feeDetailRow}>
                    <Text style={styles.feeDetailLabel}>{t('paidOn')}:</Text>
                    <Text style={styles.feeDetailValue}>{formatDate(fee.paidDate || '')}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.feeFooter}>
                {fee.status !== 'paid' ? (
                  <TouchableOpacity 
                    style={styles.payButton}
                    onPress={() => console.log('Pay fee:', fee.id)}
                  >
                    <Ionicons name="card-outline" size={16} color={colors.backgroundAlt} />
                    <Text style={styles.payButtonText}>{t('payNow')}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.receiptButton}
                    onPress={() => console.log('View receipt:', fee.id)}
                  >
                    <Ionicons name="document-text-outline" size={16} color={colors.backgroundAlt} />
                    <Text style={styles.receiptButtonText}>{t('viewReceipt')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="cash-outline" size={64} color={colors.grey} />
            <Text style={styles.emptyText}>
              {t('noFeesFound')}
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 16,
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAlt,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'Nunito_400Regular',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Poppins_700Bold',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.grey,
  },
  filterSelector: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  selectedFilterButton: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  selectedFilterText: {
    color: colors.backgroundAlt,
  },
  feeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  feeHeader: {
    marginBottom: 12,
  },
  feeTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  feeType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Poppins_600SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.backgroundAlt,
    fontFamily: 'Nunito_600SemiBold',
    textTransform: 'uppercase',
  },
  dueDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  feeDetails: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  feeDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeDetailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Nunito_400Regular',
  },
  feeDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
  feeFooter: {
    alignItems: 'flex-end',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.backgroundAlt,
    marginLeft: 8,
    fontFamily: 'Nunito_600SemiBold',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  receiptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.backgroundAlt,
    marginLeft: 8,
    fontFamily: 'Nunito_600SemiBold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
});