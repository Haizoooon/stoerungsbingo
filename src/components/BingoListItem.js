import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity 
} from 'react-native';

const BingoListItem = ({ card, onPress, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity 
      style={[styles.container, card.completed && styles.completedContainer]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{card.title}</Text>
        <Text style={styles.date}>Erstellt am: {formatDate(card.createdAt)}</Text>
        
        {card.completed && (
          <View style={styles.bingoTag}>
            <Text style={styles.bingoTagText}>BINGO!</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  bingoTag: {
    backgroundColor: '#4CAF50',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  bingoTagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff5252',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default BingoListItem;
