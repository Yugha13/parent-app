import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { Child } from '../types';
import { useTranslation } from 'react-i18next';

interface ChildSelectorProps {
  children: Child[];
  selectedChild: Child;
  onSelectChild: (child: Child) => void;
}

export default function ChildSelector({ children, selectedChild, onSelectChild }: ChildSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  const renderChildItem = ({ item }: { item: Child }) => (
    <TouchableOpacity
      style={[styles.childItem, item.id === selectedChild.id && styles.selectedChildItem]}
      onPress={() => {
        onSelectChild(item);
        setModalVisible(false);
      }}
    >
      <Image source={{ uri: item.profilePic }} style={styles.childAvatar} />
      <View style={styles.childInfo}>
        <Text style={[commonStyles.text, styles.childName]}>{item.name}</Text>
        <Text style={[commonStyles.textSecondary, styles.childDetails]}>
          {t('grade')} {item.grade} - {t('section')} {item.section}
        </Text>
        <Text style={[commonStyles.textSecondary, styles.schoolName]}>{item.school}</Text>
      </View>
      {item.id === selectedChild.id && (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Image source={{ uri: selectedChild.profilePic }} style={styles.selectedAvatar} />
        <View style={styles.selectedInfo}>
          <Text style={[commonStyles.text, styles.selectedName]}>{selectedChild.name}</Text>
          <Text style={[commonStyles.textSecondary, styles.selectedDetails]}>
            {t('grade')} {selectedChild.grade} - {t('section')} {selectedChild.section}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[commonStyles.subtitle, styles.modalTitle]}>{t('selectChild')}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={children}
              renderItem={renderChildItem}
              keyExtractor={(item) => item.id}
              style={styles.childList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  selectedAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  selectedDetails: {
    fontSize: 14,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.backgroundAlt,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  childList: {
    paddingHorizontal: 20,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  selectedChildItem: {
    backgroundColor: colors.background,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderBottomWidth: 0,
    marginVertical: 4,
  },
  childAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  childDetails: {
    fontSize: 13,
    marginTop: 2,
  },
  schoolName: {
    fontSize: 12,
    marginTop: 1,
  },
});