import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

function PackageCard({pkg, onOrder}) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = pkg.imageUrl && !imageFailed;

  const isETB = pkg.currency === 'ETB';
  const priceDisplay = isETB
    ? `${(pkg.price / 1000).toFixed(0)}K Birr`
    : `$${pkg.price}`;

  return (
    <View style={styles.card}>
      <View style={[styles.cover, {backgroundColor: pkg.coverColor}]}>
        {hasImage ? (
          <Image
            source={{uri: pkg.imageUrl}}
            style={styles.coverImage}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : null}
        <View style={[styles.coverOverlay, hasImage && styles.coverOverlayDark]}>
          <Text style={styles.coverEmoji}>
            {pkg.id === 'outdoor1' ? '👑' :
             pkg.id === 'outdoor2' ? '💍' :
             pkg.id === 'outdoor3' ? '📸' : '🎉'}
          </Text>
        </View>
        {pkg.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pkg.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{pkg.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>{priceDisplay}</Text>
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
    height: 200,
    position: 'relative',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverOverlayDark: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  coverEmoji: {
    fontSize: 56,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    zIndex: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a2e',
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
    fontSize: 22,
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
