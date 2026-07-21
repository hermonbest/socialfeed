import React, {useCallback} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useOrder} from '../context/OrderContext';
import PackageCard from '../components/PackageCard';
import packages, {frameSizes, boardSizes, bannerSizes} from '../data/packages';

function SizeRow({label}) {
  return (
    <View style={styles.sizeRow}>
      <Text style={styles.sizeText}>{label}</Text>
    </View>
  );
}

function CatalogScreen({navigation}) {
  const {selectPackage} = useOrder();

  const handleOrder = useCallback(
    pkg => {
      selectPackage(pkg);
      navigation.navigate('Booking');
    },
    [selectPackage, navigation],
  );

  const sections = [
    {
      title: 'Outdoor Photography Packages',
      type: 'packages',
      data: packages,
    },
    {
      title: 'Frame Prices',
      type: 'sizes',
      note: 'Contact us for pricing on these sizes',
      data: frameSizes,
    },
    {
      title: 'Laminated Board Prices',
      type: 'sizes',
      note: 'Contact us for pricing on these sizes',
      data: boardSizes,
    },
    {
      title: 'Banner Prices',
      type: 'sizes',
      note: 'Contact us for pricing on these sizes',
      data: bannerSizes,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Brothers Studio</Text>
        <Text style={styles.headerSub}>Browse Our Services</Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id || `size-${index}`}
        renderItem={({item, section}) => {
          if (section.type === 'packages') {
            return <PackageCard pkg={item} onOrder={handleOrder} />;
          }
          return <SizeRow label={item.label} />;
        }}
        renderSectionHeader={({section}) => (
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
    backgroundColor: '#1a1a2e',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  headerSub: {
    fontSize: 15,
    color: '#aaa',
    marginTop: 4,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 30,
    backgroundColor: '#f5f5f5',
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  sectionNote: {
    fontSize: 13,
    color: '#e94560',
    marginTop: 4,
    fontStyle: 'italic',
  },
  sizeRow: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 6,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sizeText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});

export default CatalogScreen;
