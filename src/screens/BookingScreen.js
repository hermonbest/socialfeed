import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useOrder } from '../context/OrderContext';
import { sendTelegramNotification } from '../services/notificationService';
import paymentMethods from '../data/paymentConfig';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

function BookingScreen({ navigation }) {
  const { selectedPackage, clearSelection, addOrder } = useOrder();

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentPhoto, setPaymentPhoto] = useState(null);

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const pickPhoto = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 1200,
        maxHeight: 1200,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Could not open gallery');
          return;
        }
        if (response.assets && response.assets[0]) {
          setPaymentPhoto(response.assets[0]);
        }
      },
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const { fullName, phoneNumber, email, preferredDate, preferredTime } = form;

    if (
      !fullName.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !preferredDate.trim() ||
      !preferredTime.trim()
    ) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Select Payment', 'Please choose a payment method.');
      return;
    }

    if (!paymentPhoto) {
      Alert.alert(
        'Upload Screenshot',
        'Please upload your payment screenshot before submitting.',
      );
      return;
    }

    setSubmitting(true);

    const paymentMethod = paymentMethods.find(p => p.id === selectedPayment);

    const order = {
      packageTitle: selectedPackage.title,
      price: selectedPackage.price,
      currency: selectedPackage.currency || 'ETB',
      duration: selectedPackage.duration,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      preferredDate: preferredDate.trim(),
      preferredTime: preferredTime.trim(),
      paymentMethod: paymentMethod?.name || selectedPayment,
      paymentAccount: paymentMethod?.accountNumber || '',
    };

    addOrder(order);

    const sent = await sendTelegramNotification(order, paymentPhoto.uri);

    setSubmitting(false);

    if (sent) {
      clearSelection();
      Alert.alert(
        'Order Submitted',
        'Your payment screenshot has been received. We will verify and confirm your booking shortly.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } else {
      Alert.alert(
        'Order Saved',
        'Your order was saved locally but the notification could not be sent. Please contact us directly with your order details.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }
  }, [form, selectedPackage, selectedPayment, paymentPhoto, addOrder, clearSelection, navigation]);

  const removePhoto = useCallback(() => {
    setPaymentPhoto(null);
  }, []);

  if (!selectedPackage) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No package selected.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Browse Packages</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isETB = selectedPackage.currency === 'ETB';
  const priceDisplay = isETB
    ? `${(selectedPackage.price / 1000).toFixed(0)}K Birr`
    : `$${selectedPackage.price}`;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <View style={styles.headerSection}>
            <Text style={styles.heading}>Complete Booking</Text>
            <Text style={styles.headingSub}>Fill in your details to reserve this package</Text>
          </View>

          <View style={styles.selectedCard}>
            <View style={styles.selectedCardLeft}>
              <View style={[styles.selectedCardDot, { backgroundColor: selectedPackage.coverColor }]} />
              <View>
                <Text style={styles.selectedTitle}>{selectedPackage.title}</Text>
                <Text style={styles.selectedMeta}>
                  {priceDisplay}  ·  {selectedPackage.duration}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Abebe Kebede"
              placeholderTextColor={colors.textTertiary}
              value={form.fullName}
              onChangeText={v => updateField('fullName', v)}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. +251 91X XXX XXXX"
              placeholderTextColor={colors.textTertiary}
              keyboardType="phone-pad"
              value={form.phoneNumber}
              onChangeText={v => updateField('phoneNumber', v)}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. abebe@example.com"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={v => updateField('email', v)}
            />

            <Text style={styles.label}>Preferred Date</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2026-08-15"
              placeholderTextColor={colors.textTertiary}
              value={form.preferredDate}
              onChangeText={v => updateField('preferredDate', v)}
            />

            <Text style={styles.label}>Preferred Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2:00 PM"
              placeholderTextColor={colors.textTertiary}
              value={form.preferredTime}
              onChangeText={v => updateField('preferredTime', v)}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Text style={styles.sectionNote}>
              Pay first, then submit your order with the payment screenshot.
            </Text>

            {paymentMethods.map(method => {
              const selected = selectedPayment === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentOption,
                    selected && styles.paymentOptionSelected,
                  ]}
                  onPress={() =>
                    setSelectedPayment(selected ? null : method.id)
                  }
                  activeOpacity={0.7}>
                  <View style={styles.paymentOptionLeft}>
                    <View style={[styles.paymentIconWrap, selected && styles.paymentIconWrapSelected]}>
                      <Text style={styles.paymentIcon}>{method.logo}</Text>
                    </View>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentName}>{method.name}</Text>
                      <Text style={styles.paymentDesc}>{method.instructions}</Text>
                    </View>
                  </View>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}

            {selectedPayment && (
              <View style={styles.accountCard}>
                {(() => {
                  const pm = paymentMethods.find(m => m.id === selectedPayment);
                  return (
                    <>
                      <View style={styles.accountRow}>
                        <Text style={styles.accountLabel}>Account Name</Text>
                        <Text style={styles.accountValue}>{pm.accountName}</Text>
                      </View>
                      <View style={styles.accountRow}>
                        <Text style={styles.accountLabel}>Account Number</Text>
                        <Text style={styles.accountValue}>{pm.accountNumber}</Text>
                      </View>
                      {pm.additional && (
                        <View style={styles.accountRow}>
                          <Text style={styles.accountLabel}>Bank</Text>
                          <Text style={styles.accountValue}>{pm.additional}</Text>
                        </View>
                      )}
                    </>
                  );
                })()}
              </View>
            )}

            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>Payment Screenshot</Text>

              {paymentPhoto ? (
                <View style={styles.photoPreviewContainer}>
                  <Image
                    source={{ uri: paymentPhoto.uri }}
                    style={styles.photoPreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={removePhoto}>
                    <Text style={styles.removePhotoText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickPhoto}
                  activeOpacity={0.7}>
                  <Text style={styles.uploadButtonIcon}>+</Text>
                  <Text style={styles.uploadButtonText}>Upload Screenshot</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Package</Text>
              <Text style={styles.summaryValue}>{selectedPackage.title}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{selectedPackage.duration}</Text>
            </View>
            {selectedPayment && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Payment</Text>
                <Text style={styles.summaryValue}>
                  {paymentMethods.find(m => m.id === selectedPayment)?.name}
                </Text>
              </View>
            )}
            {paymentPhoto && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Screenshot</Text>
                <Text style={styles.summaryValue}>Uploaded</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{priceDisplay}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}>
            <Text style={styles.submitText}>
              {submitting ? 'Submitting...' : 'Submit Order'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  container: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl + 10,
  },
  headerSection: {
    marginBottom: spacing.xxl,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
  },
  headingSub: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    letterSpacing: 0.1,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    ...shadows.sm,
  },
  selectedCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedCardDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectedMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.2,
    marginBottom: spacing.sm,
  },
  sectionNote: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    fontSize: 16,
    color: colors.text,
    ...shadows.sm,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  paymentOptionSelected: {
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  paymentIconWrapSelected: {
    backgroundColor: colors.accentLight,
  },
  paymentIcon: {
    fontSize: 20,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  paymentDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.accent,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  accountCard: {
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  accountRow: {
    marginBottom: spacing.sm,
  },
  accountLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  accountValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  uploadSection: {
    marginTop: spacing.sm,
  },
  uploadLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.xxl,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadButtonIcon: {
    fontSize: 20,
    color: colors.accent,
    fontWeight: '300',
    marginRight: spacing.sm,
    marginTop: -2,
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  photoPreviewContainer: {
    position: 'relative',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
  },
  removePhotoButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.full,
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    ...shadows.sm,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
  submitButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  cancelButton: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cancelText: {
    fontSize: 15,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default BookingScreen;
