import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { mockChildren, mockFees } from '../data/mockData';
import { Child, Fee } from '../types';
import { useAuth } from '../utils/AuthContext';
import { useEffect } from 'react';

type FilterType = 'all' | 'paid' | 'pending' | 'overdue';

export default function FeesScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);
  if (loading || !user) return null;

  const { t } = useTranslation();
  const [selectedChild, setSelectedChild] = useState<Child>(mockChildren[0]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<string>('full');

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
  
  const getFeesByCategory = (category: string): Fee[] => {
    const fees = mockFees[selectedChild.id] || [];
    return fees.filter(fee => 
      (fee.status === 'pending' || fee.status === 'overdue') && 
      fee.category === category
    );
  };
  
  const getCategoryAmount = (category: string): number => {
    const fees = getFeesByCategory(category);
    return fees.reduce((sum, fee) => sum + fee.amount, 0);
  };
  
  const handlePayNow = () => {
    setShowPaymentModal(true);
    setPaymentType('full');
  };
  
  const handleCategoryPayment = (category: string) => {
    setShowPaymentModal(true);
    setPaymentType(category);
  };
  
  const closePaymentModal = () => {
    setShowPaymentModal(false);
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
  
  const renderPaymentModal = () => {
    return (
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closePaymentModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {paymentType === 'full' ? t('payFullAmount') : t('payCategoryAmount', { category: paymentType })}
              </Text>
              <TouchableOpacity onPress={closePaymentModal}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalAmount}>
                {paymentType === 'full' 
                  ? formatCurrency(totalDueAmount) 
                  : formatCurrency(getCategoryAmount(paymentType))}
              </Text>
              
              <TouchableOpacity 
                style={styles.paymentMethodButton}
                onPress={() => console.log('Pay with card')}
              >
                <Ionicons name="card-outline" size={24} color={colors.primary} />
                <Text style={styles.paymentMethodText}>{t('payWithCard')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.paymentMethodButton}
                onPress={() => console.log('Pay with UPI')}
              >
                <Ionicons name="phone-portrait-outline" size={24} color={colors.primary} />
                <Text style={styles.paymentMethodText}>{t('payWithUPI')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.paymentMethodButton}
                onPress={() => console.log('Pay with net banking')}
              >
                <Ionicons name="globe-outline" size={24} color={colors.primary} />
                <Text style={styles.paymentMethodText}>{t('payWithNetBanking')}</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={closePaymentModal}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

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
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Academics':
        return 'book-outline';
      case 'Library':
        return 'library-outline';
      case 'Transport':
        return 'bus-outline';
      default:
        return 'cash-outline';
    }
  };
  
  const getCategoryPaymentStatus = (category: string) => {
    const fees = mockFees[selectedChild.id] || [];
    const categoryFees = fees.filter(fee => fee.category === category);
    
    if (categoryFees.length === 0) return 'none';
    
    const allPaid = categoryFees.every(fee => fee.status === 'paid');
    if (allPaid) return 'paid';
    
    const somePaid = categoryFees.some(fee => fee.status === 'paid');
    if (somePaid) return 'partially_paid';
    
    return 'pending';
  };
  
  const getCategoryStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return t('fullyPaid');
      case 'partially_paid':
        return t('partiallyPaid');
      case 'pending':
        return t('pending');
      default:
        return t('noFees');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const filteredFees = getFilteredFees(selectedFilter);
  const allFees = mockFees[selectedChild.id] || [];
  const totalAmount = allFees.reduce((sum, fee) => sum + fee.amount, 0) || 0;
  const paidAmount = allFees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0) || 0;
  const totalDueAmount = totalAmount - paidAmount;

  // Get unique categories
  const categories = Array.from(new Set(allFees.map(fee => fee.category)));

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

      {/* Top Section with Total Due Amount and Pay Now button */}
      <View style={styles.topSection}>
        <View style={styles.dueAmountContainer}>
          <Text style={styles.dueAmountLabel}>{t('totalDueAmount')}</Text>
          <Text style={styles.dueAmountValue}>{formatCurrency(totalDueAmount)}</Text>
        </View>
        
        {totalDueAmount > 0 && (
          <TouchableOpacity 
            style={styles.payNowButton}
            onPress={handlePayNow}
          >
            <Ionicons name="card-outline" size={18} color={colors.backgroundAlt} />
            <Text style={styles.payNowButtonText}>{t('payNow')}</Text>
          </TouchableOpacity>
        )}
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
                  <Text style={styles.feeDetailLabel}>{t('category')}:</Text>
                  <Text style={styles.feeDetailValue}>{fee.category}</Text>
                </View>
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
      
      {renderPaymentModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 16,
  },
  topSection: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dueAmountContainer: {
    flex: 1,
  },
  dueAmountLabel: {
    fontSize: 14,
    color: colors.backgroundAlt,
    opacity: 0.8,
    marginBottom: 4,
    fontFamily: 'Nunito_400Regular',
  },
  dueAmountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.backgroundAlt,
    fontFamily: 'Poppins_700Bold',
  },
  payNowButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowButtonText: {
    color: colors.backgroundAlt,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  categoriesSection: {
    padding: 16,
    paddingTop: 0,
  },
  categoriesSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  categoryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  categoryStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.backgroundAlt,
    fontFamily: 'Nunito_600SemiBold',
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  categoryAmountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold',
  },
  categoryPayButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  categoryPayButtonText: {
    color: colors.backgroundAlt,
    fontWeight: '600',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    width: '100%',
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Poppins_600SemiBold',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Poppins_700Bold',
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.grey,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Nunito_600SemiBold',
  },
});