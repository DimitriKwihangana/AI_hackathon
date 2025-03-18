import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";

export default function FarmingApp() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleAddTransaction = () => {
    if (amount) {
      setTransactions([...transactions, { amount: parseFloat(amount), type }]);
      setAmount("");
    }
  };

  const handleChatSubmit = () => {
    if (chatInput) {
      setChatHistory([...chatHistory, { user: chatInput, bot: "AI Response here..." }]);
      setChatInput("");
    }
  };

  const totalIncome = transactions.filter(t => t.type === "Income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "Expense").reduce((acc, t) => acc + t.amount, 0);
  const profitLoss = totalIncome - totalExpense;

  return (
    <View style={{ padding: 20 }}>
      {/* Financial Management Section */}
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Financial Management</Text>
      <Text>Total Income: ${totalIncome.toFixed(2)}</Text>
      <Text>Total Expense: ${totalExpense.toFixed(2)}</Text>
      <Text>Profit/Loss: ${profitLoss.toFixed(2)}</Text>
      <TextInput
        placeholder="Enter Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Add Income" onPress={() => setType("Income")} />
      <Button title="Add Expense" onPress={() => setType("Expense")} />
      <Button title="Save Transaction" onPress={handleAddTransaction} />
      
      {/* AI-Powered Assistant Section */}
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>AI Farming Assistant</Text>
      <FlatList
        data={chatHistory}
        renderItem={({ item }) => (
          <View>
            <Text>User: {item.user}</Text>
            <Text>AI: {item.bot}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        placeholder="Ask AI..."
        value={chatInput}
        onChangeText={setChatInput}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Send" onPress={handleChatSubmit} />
    </View>
  );
}
