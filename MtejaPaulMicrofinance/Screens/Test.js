import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
//import { useRouter } from 'expo-router';

export default function Test({ navigation }) {
  //const router = useRouter();

  return (
    <View style={styles.container}>
     
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Microfinance</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="settings-outline" size={24} color="#fff" style={{ marginRight: 15 }} />
          <View style={styles.avatar} />
        </View>
      </View>




      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput placeholder="Search Clients & Contracts..." placeholderTextColor="#888" style={styles.searchInput} />
        <Ionicons name="filter-outline" size={20} color="#999" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Financial Summary */}
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Disbursed</Text>
            <Text style={styles.summaryValue}>$125,430</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Collected</Text>
            <Text style={[styles.summaryValue, { color: '#22c55e' }]}>$98,210</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: '#f87171' }]}>Outstanding</Text>
            <Text style={[styles.summaryValue, { color: '#f87171' }]}>$27,220</Text>
          </View>
        </View>








        {/* Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} 
          onPress={() => navigation.navigate('All')}
          >
            <Ionicons name="people-outline" size={28} color="#fff" />
            <Text style={styles.cardText}>All Clients</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('/contracts')}>
            <Ionicons name="document-text-outline" size={28} color="#fff" />
            <Text style={styles.cardText}>All Contracts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Entypo name="folder" size={28} color="#fff" />
            <Text style={styles.cardText}>Active Contracts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <FontAwesome5 name="money-bill-wave" size={24} color="#fff" />
            <Text style={styles.cardText}>Repayments</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <MaterialIcons name="receipt" size={28} color="#fff" />
            <Text style={styles.cardText}>Fines</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <MaterialIcons name="event-busy" size={28} color="#fff" />
            <Text style={styles.cardText}>Missed Payments</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
     
    </View>
  );
}

const styles = StyleSheet.create({


  container: { flex: 1, backgroundColor: '#0f172a', paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fbbf24' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 20,
  },
  searchInput: { flex: 1, color: '#fff', marginHorizontal: 8 },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 10 },

  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },
  summaryItem: { marginBottom: 10 },
  summaryLabel: { color: '#94a3b8', fontSize: 14 },
  summaryValue: { color: '#fff', fontSize: 18, fontWeight: '600' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    backgroundColor: '#1e293b',
    width: '48%',
    paddingVertical: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  cardText: { color: '#fff', fontSize: 14, marginTop: 8 },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 20,
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
  },
  navItem: { alignItems: 'center' },
  navText: { color: '#94a3b8', fontSize: 12, marginTop: 3 },
});
