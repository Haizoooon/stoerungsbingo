import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatisticsScreen = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    completedGames: 0,
    mostCommonItems: [],
    averageCompletionTime: 0,
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const savedCards = await AsyncStorage.getItem('bingoCards');
      if (savedCards) {
        const cards = JSON.parse(savedCards);
        
        // Calculate total and completed games
        const totalGames = cards.length;
        const completedGames = cards.filter(card => card.completed).length;
        
        // Calculate most common items
        const itemFrequency = {};
        cards.forEach(card => {
          card.grid.forEach(row => {
            row.forEach(cell => {
              if (cell.marked) {
                itemFrequency[cell.text] = (itemFrequency[cell.text] || 0) + 1;
              }
            });
          });
        });
        
        // Sort items by frequency
        const sortedItems = Object.entries(itemFrequency)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([text, count]) => ({ text, count }));
        
        setStats({
          totalGames,
          completedGames,
          mostCommonItems: sortedItems,
          averageCompletionTime: 0, // Would require tracking start and end times
        });
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistik</Text>
      
      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Gesamt</Text>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalGames}</Text>
            <Text style={styles.statLabel}>Gespielte Spiele</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.completedGames}</Text>
            <Text style={styles.statLabel}>Abgeschlossene Spiele</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {stats.totalGames > 0 
                ? Math.round((stats.completedGames / stats.totalGames) * 100) 
                : 0}%
            </Text>
            <Text style={styles.statLabel}>Erfolgsquote</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Häufigste Störungen</Text>
        {stats.mostCommonItems.length > 0 ? (
          stats.mostCommonItems.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemRank}>{index + 1}.</Text>
              <Text style={styles.itemText}>{item.text}</Text>
              <Text style={styles.itemCount}>{item.count}x</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Keine Daten verfügbar</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemRank: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  itemCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default StatisticsScreen;
