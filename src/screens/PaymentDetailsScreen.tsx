import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";


declare type RootStackParamList = {
  Signin: undefined;
  Home: undefined;
  Classes: undefined;
  Announcements: undefined;
  Profile: undefined;
  PostAd: undefined;
  Terms: undefined;
  Settings: undefined;
  Notifications: undefined;
  PaymentDetails: undefined;
};

const { width } = Dimensions.get('window');

const PaymentDetailsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('pending');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Dummy data for payments
  const pendingPayments = [
    { id: '1', description: 'Monthly Class Fee - July', amount: '2500.00', date: '2025-07-31', status: 'pending' },
    { id: '2', description: 'Exam Fee - Term 1', amount: '1500.00', date: '2025-08-15', status: 'pending' },
  ];

  const completedPayments = [
    { id: '3', description: 'Monthly Class Fee - June', amount: '2500.00', date: '2025-06-30', status: 'completed' },
    { id: '4', description: 'Registration Fee', amount: '5000.00', date: '2025-01-10', status: 'completed' },
  ];

  const renderPaymentList = (payments: any[]) => (
    <View>
      {payments.length > 0 ? (
        payments.map((payment) => (
          <View key={payment.id} style={styles.paymentItem}>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentDescription}>{payment.description}</Text>
              <Text style={styles.paymentDate}>Due: {payment.date}</Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.paymentAmount}>LKR {payment.amount}</Text>
              <View style={[
                styles.statusBadge, 
                payment.status === 'completed' ? styles.completedBadge : styles.pendingBadge
              ]}>
                <Text style={styles.statusText}>
                  {payment.status === 'completed' ? 'Paid' : 'Pending'}
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Icon name="credit-card-off" size={50} color="#ccc" />
          <Text style={styles.noPaymentsText}>No payments to display</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#ffffffff', '#ffffffff']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={28} color="#1800ad" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={{ width: 28 }} /> {/* Spacer for balance */}
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Payment Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => setActiveTab('pending')}
          >
            <Icon 
              name="clock-outline" 
              size={20} 
              color={activeTab === 'pending' ? '#fff' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Icon 
              name="check-circle-outline" 
              size={20} 
              color={activeTab === 'completed' ? '#fff' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Payment List */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {activeTab === 'pending' ? 'Pending Payments' : 'Payment History'}
            </Text>
            <Icon name="credit-card-multiple" size={24} color="#1800ad" />
          </View>
          {activeTab === 'pending' ? renderPaymentList(pendingPayments) : renderPaymentList(completedPayments)}
        </View>

        {/* Payment Gateway Section */}
        {activeTab === 'pending' && (
          <View style={styles.paymentGatewayContainer}>
            <Text style={styles.sectionTitle}>Secure Payment</Text>
            
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Card Details</Text>
                <Icon name="lock-outline" size={20} color="#28a745" />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <View style={styles.inputWithIcon}>
                  <Icon name="credit-card" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="5399 0000 0000 0000"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={[styles.inputContainer, { width: '48%' }]}>
                  <Text style={styles.inputLabel}>Expiration Date</Text>
                  <View style={styles.inputWithIcon}>
                    <Icon name="calendar" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      keyboardType="numeric"
                      value={expiryDate}
                      onChangeText={setExpiryDate}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
                <View style={[styles.inputContainer, { width: '48%' }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <View style={styles.inputWithIcon}>
                    <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="***"
                      secureTextEntry
                      keyboardType="numeric"
                      value={cvv}
                      onChangeText={setCvv}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.payButton}>
                <LinearGradient
                  colors={['#0b8d29ff', '#0b8d29ff']}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Icon name="lock" size={20} color="#fff" />
                  <Text style={styles.payButtonText}>Pay Securely</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.securityNote}>
                <Icon name="shield-check" size={16} color="#28a745" />
                <Text style={styles.securityText}>Your payment is secure and encrypted</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1800ad",
    textAlign: 'left'
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 0,
    marginBottom: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#1800ad',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 13,
    color: '#666',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#28a745',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
  },
  completedBadge: {
    backgroundColor: '#d4edda',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
  },
  noPaymentsText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  paymentGatewayContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 15,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
  },
});

export default PaymentDetailsScreen;