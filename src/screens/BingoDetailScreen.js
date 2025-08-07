import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  TextInput,
  Modal,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

const BingoDetailScreen = ({ route, navigation }) => {
  const bingoCardRef = useRef();
  const [isSharing, setIsSharing] = useState(false);
  const { cardId } = route.params;
  const [card, setCard] = useState(null);
  const [grid, setGrid] = useState([]);
  const [hasBingo, setHasBingo] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  
  useEffect(() => {
    loadBingoCard();
  }, [cardId]);

  const loadBingoCard = async () => {
    try {
      const savedCards = await AsyncStorage.getItem('bingoCards');
      if (savedCards) {
        const cards = JSON.parse(savedCards);
        const currentCard = cards.find(c => c.id === cardId);
        if (currentCard) {
          setCard(currentCard);
          setGrid(currentCard.grid);
          setNewTitle(currentCard.title);
          checkForBingo(currentCard.grid);
        }
      }
    } catch (error) {
      console.error('Failed to load bingo card:', error);
    }
  };

  const saveBingoCard = async (updatedCard) => {
    try {
      const savedCards = await AsyncStorage.getItem('bingoCards');
      if (savedCards) {
        const cards = JSON.parse(savedCards);
        const updatedCards = cards.map(c => 
          c.id === updatedCard.id ? updatedCard : c
        );
        await AsyncStorage.setItem('bingoCards', JSON.stringify(updatedCards));
      }
    } catch (error) {
      console.error('Failed to save bingo card:', error);
    }
  };

  const toggleCell = (rowIndex, colIndex) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex].marked = !newGrid[rowIndex][colIndex].marked;
    setGrid(newGrid);
    
    if (card) {
      const updatedCard = {
        ...card,
        grid: newGrid
      };
      setCard(updatedCard);
      checkForBingo(newGrid);
      saveBingoCard(updatedCard);
    }
  };

  const checkForBingo = (currentGrid) => {
    const size = currentGrid.length;
    let bingo = false;
    
    // Check rows
    for (let i = 0; i < size; i++) {
      if (currentGrid[i].every(cell => cell.marked)) {
        bingo = true;
        break;
      }
    }
    
    // Check columns
    if (!bingo) {
      for (let i = 0; i < size; i++) {
        let columnBingo = true;
        for (let j = 0; j < size; j++) {
          if (!currentGrid[j][i].marked) {
            columnBingo = false;
            break;
          }
        }
        if (columnBingo) {
          bingo = true;
          break;
        }
      }
    }
    
    // Check diagonals
    if (!bingo) {
      let diagonal1 = true;
      let diagonal2 = true;
      
      for (let i = 0; i < size; i++) {
        if (!currentGrid[i][i].marked) {
          diagonal1 = false;
        }
        if (!currentGrid[i][size - 1 - i].marked) {
          diagonal2 = false;
        }
      }
      
      if (diagonal1 || diagonal2) {
        bingo = true;
      }
    }
    
    if (bingo && !hasBingo && card && !card.completed) {
      Alert.alert(
        "BINGO!",
        "Glückwunsch! Du hast ein Bingo erreicht!",
        [{ text: "Hurra!", style: "default" }]
      );
      
      const updatedCard = {
        ...card,
        completed: true,
        completedAt: new Date().toISOString()
      };
      
      setCard(updatedCard);
      saveBingoCard(updatedCard);
    }
    
    setHasBingo(bingo);
  };

  const handleShare = async () => {
    if (!bingoCardRef.current) return;
    
    try {
      setIsSharing(true);
      
      // Capture the bingo card as an image
      const uri = await bingoCardRef.current.capture();
      
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Teile dein ${card.title}!`,
          UTI: 'public.png'
        });
      } else {
        Alert.alert(
          "Teilen nicht verfügbar",
          "Das Teilen ist auf diesem Gerät nicht verfügbar."
        );
      }
    } catch (error) {
      console.error('Error sharing bingo card:', error);
      Alert.alert(
        "Fehler beim Teilen",
        "Es gab ein Problem beim Teilen der Bingo-Karte."
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handleRename = () => {
    if (newTitle.trim() === '') {
      Alert.alert('Fehler', 'Der Titel darf nicht leer sein.');
      return;
    }

    if (card) {
      const updatedCard = {
        ...card,
        title: newTitle.trim()
      };
      setCard(updatedCard);
      saveBingoCard(updatedCard);
      setIsRenameModalVisible(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!card) {
    return (
      <View style={styles.container}>
        <Text>Lade Bingo-Karte...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Zurück</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{card.title}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View style={styles.shareButtonContent}>
                  <Ionicons name="share-outline" size={16} color="white" />
                  <Text style={styles.shareButtonText}>Teilen</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.renameButton}
              onPress={() => setIsRenameModalVisible(true)}
            >
              <Text style={styles.renameButtonText}>Umbenennen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <Text style={styles.dateText}>
        Erstellt am: {formatDate(card.createdAt)}
      </Text>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ViewShot
          ref={bingoCardRef}
          options={{ format: "png", quality: 0.9 }}
          style={styles.shareContainer}
        >
          <View style={styles.shareHeader}>
            <Text style={styles.shareAppTitle}>Störungsbingo</Text>
            <Text style={styles.shareBingoTitle}>{card.title}</Text>
          </View>
          <View style={[styles.bingoCard, hasBingo && styles.bingoCardHighlight]}>
          {grid.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, colIndex) => (
                <TouchableOpacity
                  key={`cell-${rowIndex}-${colIndex}`}
                  style={[
                    styles.cell,
                    cell.marked && styles.markedCell
                  ]}
                  onPress={() => toggleCell(rowIndex, colIndex)}
                >
                  <Text 
                    style={[
                      styles.cellText,
                      cell.marked && styles.markedCellText
                    ]}
                  >
                    {cell.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          </View>
        </ViewShot>
        
        {hasBingo && (
          <View style={styles.bingoLabel}>
            <Text style={styles.bingoText}>BINGO!</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Rename Modal */}
      <Modal
        visible={isRenameModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bingo umbenennen</Text>
            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Neuer Name"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewTitle(card.title);
                  setIsRenameModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleRename}
              >
                <Text style={styles.saveButtonText}>Speichern</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');
const cellSize = (width - 40) / 5; // Larger cells

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  shareButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    marginRight: 8,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    marginLeft: 4,
  },
  renameButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  renameButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  scrollContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  shareContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shareHeader: {
    backgroundColor: '#4CAF50',
    padding: 12,
    alignItems: 'center',
  },
  shareAppTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  shareBingoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  bingoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bingoCardHighlight: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  markedCell: {
    backgroundColor: '#4CAF50',
  },
  cellText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  markedCellText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bingoLabel: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  bingoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default BingoDetailScreen;
