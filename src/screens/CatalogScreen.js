import React, { useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useOrder } from '../context/OrderContext';
import PackageCard from '../components/PackageCard';
import packages, { frameSizes, boardSizes, bannerSizes } from '../data/packages';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

function SizeRow({ label }) {
  return (
    <View style={styles.sizeRow}>
      <Text style={styles.sizeText}>{label}</Text>
    </View>
  );
}

function CatalogScreen({ navigation }) {
  const { selectPackage } = useOrder();

  const handleOrder = useCallback(
    pkg => {
      selectPackage(pkg);
      navigation.navigate('Booking');
    },
    [selectPackage, navigation],
  );

  const sections = [
    {
      title: 'Photography Packages',
      type: 'packages',
      data: packages,
    },
    {
      title: 'Frame Sizes',
      type: 'sizes',
      note: 'Contact us for pricing',
      data: frameSizes,
    },
    {
      title: 'Laminated Board Sizes',
      type: 'sizes',
      note: 'Contact us for pricing',
      data: boardSizes,
    },
    {
      title: 'Banner Sizes',
      type: 'sizes',
      note: 'Contact us for pricing',
      data: bannerSizes,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Brothers Studio</Text>
        <Text style={styles.headerSub}>Premium photography services</Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id || `size-${index}`}
        renderItem={({ item, section }) => {
          if (section.type === 'packages') {
            return <PackageCard pkg={item} onOrder={handleOrder} />;
          }
          return <SizeRow label={item.label} />;
        }}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.note && (
              <Text style={styles.sectionNote}>{section.note}</Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    letterSpacing: 0.2,
  },
  list: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  sectionHeader: {
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.2,
  },
  sectionNote: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  sizeRow: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    ...shadows.sm,
  },
  sizeText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
});

export default CatalogScreen;
