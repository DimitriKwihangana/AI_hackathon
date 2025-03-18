// components/ExpenseTracker.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [date, setDate] = useState('');
  const [production, setProduction] = useState('');

  const addExpense = () => {
    if (amount && expenseType && date) {
      const newExpense = {
        id: Math.random().toString(),
        amount: parseFloat(amount),
        type: expenseType,
        date,
      };
      setExpenses([...expenses, newExpense]);
      setAmount('');
      setExpenseType('');
      setDate('');
    }
  };

  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
  const minPricePerKg = production ? (totalExpense / parseFloat(production)).toFixed(2) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mbarira</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Expense Amount"
          placeholderTextColor="#777"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={styles.input}
          placeholder="Expense Type"
          placeholderTextColor="#777"
          value={expenseType}
          onChangeText={setExpenseType}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor="#777"
          value={date}
          onChangeText={setDate}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Add Expense" onPress={addExpense} color="#4CAF50" />
      </View>
      <Text style={styles.summary}>Total Expense: Rwf{totalExpense.toFixed(2)}</Text>
      <View style={styles.productionContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Total Production (kg)"
          placeholderTextColor="#777"
          keyboardType="numeric"
          value={production}
          onChangeText={setProduction}
        />
        {minPricePerKg && (
          <Text style={styles.summary}>Minimum Price per kg: Rwf{minPricePerKg}</Text>
        )}
      </View>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.expenseText}>
              {item.date} - {item.type}: Rwf{item.amount.toFixed(2)}
            </Text>
          </View>
        )}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 10,
  },
  summary: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 10,
    textAlign: 'center',
  },
  productionContainer: {
    marginTop: 10,
  },
  expenseItem: {
    backgroundColor: '#C8E6C9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  expenseText: {
    fontSize: 16,
    color: '#2E7D32',
  },
});

export default ExpenseTracker;
