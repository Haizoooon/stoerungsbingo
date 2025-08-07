import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions,
  Alert
} from 'react-native';

const BingoCard = ({ card, onUpdate, onDelete }) => {
  const [grid, setGrid] = useState(card.grid);
  const [hasBingo, setHasBingo] = useState(false);
  
  useEffect(() => {
    setGrid(card.grid);
    checkForBingo(card.grid);
  }, [card]);

  const toggleCell = (rowIndex, colIndex) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex].marked = !newGrid[rowIndex][colIndex].marked;
    setGrid(newGrid);
    
    const updatedCard = {
      ...card,
      grid: newGrid
    };
    
    checkForBingo(newGrid);
    onUpdate(updatedCard);
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
    
    if (bingo && !hasBingo && !card.completed) {
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
      
      onUpdate(updatedCard);
    }
    
    setHasBingo(bingo);
  };

  return (
    <View style={[styles.container, hasBingo && styles.bingoContainer]}>
      <View style={styles.header}>
        <Text style={styles.title}>{card.title}</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.grid}>
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
                  numberOfLines={2}
                >
                  {cell.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      
      {hasBingo && (
        <View style={styles.bingoLabel}>
          <Text style={styles.bingoText}>BINGO!</Text>
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const cellSize = (width - 64) / 5;

const styles = StyleSheet.create({
  container: {
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
  bingoContainer: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff5252',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  grid: {
    alignItems: 'center',
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
    padding: 4,
  },
  markedCell: {
    backgroundColor: '#4CAF50',
  },
  cellText: {
    fontSize: 10,
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
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 16,
  },
  bingoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BingoCard;
