import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

function PackageCard({pkg, onOrder}) {
  return (
    <View style={styles.card}>
      <View style={[styles.cover, {backgroundColor: pkg.coverColor}]}>
        <Text style={styles.coverEmoji}>
          {pkg.id === 'portrait' ? '📸' :
           pkg.id === 'wedding' ? '💍' :
           pkg.id === 'event' ? '🎉' : '💑'}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{pkg.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>${pkg.price}</Text>
          <Text style={styles.duration}>{pkg.duration}</Text>
        </View>
        <View style={styles.inclusions}>
          {pkg.inclusions.map((item, idx) => (
            <Text key={idx} style={styles.bullet}>
              {'  \u2022  '}{item}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onOrder(pkg)}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cover: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverEmoji: {
    fontSize: 64,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: '#e94560',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  inclusions: {
    marginBottom: 18,
  },
  bullet: {
    fontSize: 14,
    color: '#444',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#e94560',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PackageCard;
