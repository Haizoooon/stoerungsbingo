import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountScreen = () => {
  const [settings, setSettings] = useState({
    username: 'Benutzer',
    darkMode: false,
    notifications: true,
    soundEffects: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (updatedSettings) => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const updateSetting = (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    saveSettings(updatedSettings);
  };

  const resetAllData = () => {
    Alert.alert(
      "Daten zurücksetzen",
      "Möchtest du wirklich alle Daten zurücksetzen? Dies löscht alle Bingo-Karten und Statistiken.",
      [
        {
          text: "Abbrechen",
          style: "cancel"
        },
        {
          text: "Zurücksetzen",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setSettings({
                username: 'Benutzer',
                darkMode: false,
                notifications: true,
                soundEffects: true,
              });
              Alert.alert("Erfolg", "Alle Daten wurden zurückgesetzt.");
            } catch (error) {
              console.error('Failed to reset data:', error);
              Alert.alert("Fehler", "Daten konnten nicht zurückgesetzt werden.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Konto</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profil</Text>
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{settings.username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.username}>{settings.username}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Einstellungen</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dunkelmodus</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => updateSetting('darkMode', value)}
            trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
            thumbColor={settings.darkMode ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Benachrichtigungen</Text>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
            trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
            thumbColor={settings.notifications ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Soundeffekte</Text>
          <Switch
            value={settings.soundEffects}
            onValueChange={(value) => updateSetting('soundEffects', value)}
            trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
            thumbColor={settings.soundEffects ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daten</Text>
        <TouchableOpacity 
          style={styles.dangerButton} 
          onPress={resetAllData}
        >
          <Text style={styles.dangerButtonText}>Alle Daten zurücksetzen</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.version}>Störungsbingo v1.0.0</Text>
      </View>
    </View>
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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  dangerButton: {
    backgroundColor: '#ff5252',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  dangerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    padding: 16,
  },
  version: {
    color: '#888',
    fontSize: 14,
  },
});

export default AccountScreen;
