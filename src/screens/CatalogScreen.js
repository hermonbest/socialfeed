import React, {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useOrder} from '../context/OrderContext';
import PackageCard from '../components/PackageCard';
import packages from '../data/packages';

function CatalogScreen({navigation}) {
  const {selectPackage} = useOrder();

  const handleOrder = useCallback(
    pkg => {
      selectPackage(pkg);
      navigation.navigate('Booking');
    },
    [selectPackage, navigation],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Photo Studio</Text>
        <Text style={styles.headerSub}>Choose Your Package</Text>
      </View>
      <FlatList
        data={packages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <PackageCard pkg={item} onOrder={handleOrder} />
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
    paddingTop: 16,
    paddingBottom: 30,
    backgroundColor: '#f5f5f5',
  },
});

export default CatalogScreen;
