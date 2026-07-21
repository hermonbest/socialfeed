import React, {useState, useCallback} from 'react';
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
} from 'react-native';
import {useOrder} from '../context/OrderContext';
import {sendTelegramNotification} from '../services/notificationService';
import paymentMethods from '../data/paymentConfig';

function BookingScreen({navigation}) {
  const {selectedPackage, clearSelection, addOrder} = useOrder();

  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = useCallback((field, value) => {
    setForm(prev => ({...prev, [field]: value}));
  }, []);

  const handleSubmit = useCallback(async () => {
    const {fullName, phoneNumber, email, preferredDate, preferredTime} = form;

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

    await sendTelegramNotification(order);

    setSubmitting(false);
    clearSelection();

    Alert.alert(
      'Order Submitted!',
      'We will confirm your booking after payment verification. You will be contacted shortly.',
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  }, [form, selectedPackage, selectedPayment, addOrder, clearSelection, navigation]);

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
          <Text style={styles.heading}>Book Your Package</Text>

          <View style={styles.selectedCard}>
            <Text style={styles.selectedTitle}>{selectedPackage.title}</Text>
            <Text style={styles.selectedMeta}>
              {priceDisplay}  |  {selectedPackage.duration}
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Your Information</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Abebe Kebede"
              placeholderTextColor="#999"
              value={form.fullName}
              onChangeText={v => updateField('fullName', v)}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. +251 91X XXX XXXX"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={form.phoneNumber}
              onChangeText={v => updateField('phoneNumber', v)}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. abebe@example.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={v => updateField('email', v)}
            />

            <Text style={styles.label}>Preferred Date</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2026-08-15"
              placeholderTextColor="#999"
              value={form.preferredDate}
              onChangeText={v => updateField('preferredDate', v)}
            />

            <Text style={styles.label}>Preferred Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2:00 PM"
              placeholderTextColor="#999"
              value={form.preferredTime}
              onChangeText={v => updateField('preferredTime', v)}
            />
          </View>

          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Text style={styles.paymentNote}>
              Please pay first then submit your order.
            </Text>

            {paymentMethods.map(method => {
              const selected = selectedPayment === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentOption, selected && styles.paymentOptionSelected]}
                  onPress={() =>
                    setSelectedPayment(selected ? null : method.id)
                  }
                  activeOpacity={0.7}>
                  <View style={styles.paymentOptionLeft}>
                    <Text style={styles.paymentLogo}>{method.logo}</Text>
                    <View>
                      <Text style={styles.paymentName}>{method.name}</Text>
                      <Text style={styles.paymentDesc}>
                        {method.instructions}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.radio,
                      selected && styles.radioSelected,
                    ]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}

            {selectedPayment && (
              <View style={styles.accountDetails}>
                <Text style={styles.accountLabel}>Account Name</Text>
                <Text style={styles.accountValue}>
                  {paymentMethods.find(m => m.id === selectedPayment)?.accountName}
                </Text>
                <Text style={styles.accountLabel}>Account Number</Text>
                <Text style={styles.accountValue}>
                  {paymentMethods.find(m => m.id === selectedPayment)?.accountNumber}
                </Text>
                {paymentMethods.find(m => m.id === selectedPayment)?.additional && (
                  <>
                    <Text style={styles.accountLabel}>Bank</Text>
                    <Text style={styles.accountValue}>
                      {paymentMethods.find(m => m.id === selectedPayment)?.additional}
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{selectedPackage.title}</Text>
              <Text style={styles.summaryValue}>{priceDisplay}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{selectedPackage.duration}</Text>
            </View>
            {selectedPayment && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pay via</Text>
                <Text style={styles.summaryValue}>
                  {paymentMethods.find(m => m.id === selectedPayment)?.name}
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
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
    backgroundColor: '#f5f5f5',
  },
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  selectedCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  selectedMeta: {
    fontSize: 14,
    color: '#e94560',
    marginTop: 4,
    fontWeight: '600',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  paymentSection: {
    marginBottom: 20,
  },
  paymentNote: {
    fontSize: 13,
    color: '#e94560',
    fontWeight: '600',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#eee',
  },
  paymentOptionSelected: {
    borderColor: '#e94560',
    backgroundColor: '#fff5f5',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentLogo: {
    fontSize: 28,
    marginRight: 12,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  paymentDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#e94560',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e94560',
  },
  accountDetails: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e94560',
    marginTop: 4,
  },
  accountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginTop: 2,
  },
  summary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#e94560',
  },
  submitButton: {
    backgroundColor: '#e94560',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    fontSize: 15,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default BookingScreen;
