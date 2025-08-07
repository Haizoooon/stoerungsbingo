import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BingoListItem from '../components/BingoListItem';

const BingoScreen = ({ navigation }) => {
  const [bingoCards, setBingoCards] = useState([]);
  
  useEffect(() => {
    loadBingoCards();
  }, []);

  const loadBingoCards = async () => {
    try {
      const savedCards = await AsyncStorage.getItem('bingoCards');
      if (savedCards) {
        setBingoCards(JSON.parse(savedCards));
      }
    } catch (error) {
      console.error('Failed to load bingo cards:', error);
    }
  };

  const saveBingoCards = async (updatedCards) => {
    try {
      await AsyncStorage.setItem('bingoCards', JSON.stringify(updatedCards));
    } catch (error) {
      console.error('Failed to save bingo cards:', error);
    }
  };

  const createNewBingo = () => {
    // Default items for the bingo card
    const defaultItems = [
      'Wildunfall', 'Feuerwehreinsatz', 'Verspätung eines vorausfahrenden Zuges', 'Reperatur an der Strecke', 'Technische Störung am Zug',
      'Fehler durch DB (Fehlleitung, ...)', 'Störung am anderen Zug', 'Signalstörung', 'Notarzteinsatz auf der Strecke', 'Warten auf Personal',
      'Feuer im Zug', 'Stellwerksausfall', 'Tiere auf der Strecke', 'Fehler durch VL', 'Notarzt am Zug',
      'Weichenstörung', 'Kuppelstörung', 'Behinderung durch Fahrgäste', 'Personen im Gleis', 'Polizei',
      'Oberleitungsstörung', 'Personenunfall', 'Gegenstände im Gleis', 'Evakuierung & Räumung', 'Kurzwende Verspätung'
    ];
    
    // Randomly select 25 items (or less if there aren't enough)
    const shuffled = [...defaultItems].sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, 25);
    
    // Create a 5x5 grid with the selected items
    const grid = [];
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        const index = i * 5 + j;
        if (index < selectedItems.length) {
          row.push({
            text: selectedItems[index],
            marked: false
          });
        } else {
          row.push({
            text: '',
            marked: false
          });
        }
      }
      grid.push(row);
    }
    
    const newCard = {
      id: Date.now().toString(),
      title: `Bingo ${bingoCards.length + 1}`,
      grid: grid,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedCards = [...bingoCards, newCard];
    setBingoCards(updatedCards);
    saveBingoCards(updatedCards);
  };

  const deleteBingoCard = (id) => {
    Alert.alert(
      "Bingo löschen",
      "Möchtest du dieses Bingo wirklich löschen?",
      [
        {
          text: "Abbrechen",
          style: "cancel"
        },
        {
          text: "Löschen",
          onPress: () => {
            const updatedCards = bingoCards.filter(card => card.id !== id);
            setBingoCards(updatedCards);
            saveBingoCards(updatedCards);
          },
          style: "destructive"
        }
      ]
    );
  };

  const navigateToBingoDetail = (cardId) => {
    navigation.navigate('BingoDetail', { cardId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Störungs-Bingo</Text>
        <TouchableOpacity 
          style={styles.newButton} 
          onPress={createNewBingo}
        >
          <Text style={styles.newButtonText}>Neues Bingo</Text>
        </TouchableOpacity>
      </View>
      
      {bingoCards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Keine Bingo-Karten vorhanden. Erstelle eine neue Karte!
          </Text>
        </View>
      ) : (
        <FlatList
          data={bingoCards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BingoListItem 
              card={item} 
              onPress={() => navigateToBingoDetail(item.id)}
              onDelete={() => deleteBingoCard(item.id)}
            />
          )}
          contentContainerStyle={styles.cardList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  newButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  newButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default BingoScreen;
