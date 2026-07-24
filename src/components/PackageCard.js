import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

function PackageCard({ pkg, onOrder }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = pkg.imageUrl && !imageFailed;

  const isETB = pkg.currency === 'ETB';
  const priceDisplay = isETB
    ? `${(pkg.price / 1000).toFixed(0)}K Birr`
    : `$${pkg.price}`;

  return (
    <View style={styles.card}>
      <View style={styles.cover}>
        <View style={[styles.coverBg, { backgroundColor: pkg.coverColor }]}>
          {hasImage ? (
            <Image
              source={{ uri: pkg.imageUrl }}
              style={styles.coverImage}
              resizeMode="cover"
              onError={() => setImageFailed(true)}
            />
          ) : null}
          <View style={styles.coverOverlay} />
        </View>
        {pkg.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pkg.badge}</Text>
          </View>
        )}
        <View style={styles.coverContent}>
          <Text style={styles.coverTitle}>{pkg.title}</Text>
          <Text style={styles.coverPrice}>{priceDisplay}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {pkg.inclusions.map((item, idx) => (
          <View key={idx} style={styles.inclusionRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.inclusionText}>{item}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={() => onOrder(pkg)}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>አሁን ያስይዙ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.lg,
  },
  cover: {
    position: 'relative',
    height: 220,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  coverBg: {
    ...StyleSheet.absoluteFillObject,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  coverContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
  },
  coverTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },
  coverPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
    letterSpacing: 0.2,
  },
  badge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(26,26,26,0.95)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  body: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  inclusionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginRight: spacing.md,
  },
  inclusionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  button: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default PackageCard;
