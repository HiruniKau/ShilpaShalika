import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PaymentDetailsScreen = () => {
  const [activeTab, setActiveTab] = useState('pending');
  
  // Dummy data for payments
  const pendingPayments = [
    { id: '1', description: 'Monthly Class Fee - July', amount: '2500.00', date: '2025-07-31' },
    { id: '2', description: 'Exam Fee - Term 1', amount: '1500.00', date: '2025-08-15' },
  ];

  const completedPayments = [
    { id: '3', description: 'Monthly Class Fee - June', amount: '2500.00', date: '2025-06-30' },
    { id: '4', description: 'Registration Fee', amount: '5000.00', date: '2025-01-10' },
  ];

  const renderPaymentList = (payments: any[]) => (
    <View>
      {payments.length > 0 ? (
        payments.map((payment) => (
          <View key={payment.id} style={styles.paymentItem}>
            <View>
              <Text style={styles.paymentDescription}>{payment.description}</Text>
              <Text style={styles.paymentDate}>Due: {payment.date}</Text>
            </View>
            <Text style={styles.paymentAmount}>LKR {payment.amount}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noPaymentsText}>No payments to display.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/header.png')}
          style={styles.logo}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Payments Details</Text>

        {/* Payment Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
          </TouchableOpacity>
        </View>

        {/* Display payment list based on active tab */}
        <View style={styles.card}>
          {activeTab === 'pending' ? renderPaymentList(pendingPayments) : renderPaymentList(completedPayments)}
        </View>

        {/* Payment Gateway Section */}
        <View style={styles.paymentGatewayContainer}>
          <Text style={styles.sectionTitle}>Pay Now</Text>
          
          <View style={styles.card}>
            {/* Card details form */}
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="5399 0000 0000 0000"
              keyboardType="numeric"
            />
            
            <View style={styles.row}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>Expiration Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="***"
                  secureTextEntry
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 5,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign:'center'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1800ab',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#1800ab',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  paymentDescription: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  noPaymentsText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
  },
  paymentGatewayContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center'
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  payButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentDetailsScreen;
