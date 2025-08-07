# Störungs-Bingo

Eine Expo Go App für iOS, bei der Benutzer Bingo-Spiele mit IT-Störungen erstellen und spielen können.

## Features

- Erstellen und Verwalten mehrerer Bingo-Spiele gleichzeitig
- Manuelles Ankreuzen von Störungen im Bingo-Feld
- Automatische Erkennung von Bingo-Reihen (horizontal, vertikal, diagonal)
- Statistik-Übersicht über gespielte und gewonnene Spiele
- Benutzereinstellungen und Profilverwaltung

## Installation

1. Stelle sicher, dass Node.js und npm installiert sind
2. Installiere die Expo CLI: `npm install -g expo-cli`
3. Klone das Repository
4. Navigiere in das Projektverzeichnis: `cd stoerungsbingo-app`
5. Installiere die Abhängigkeiten: `npm install`
6. Starte die App: `npm start` oder `expo start`

## Verwendung mit Expo Go

1. Lade die Expo Go App aus dem App Store herunter
2. Scanne den QR-Code, der nach dem Starten der App angezeigt wird
3. Die App wird in Expo Go geöffnet

## Struktur

- `src/screens/` - Hauptbildschirme der App (Bingo, Statistik, Konto)
- `src/components/` - Wiederverwendbare Komponenten
- `src/navigation/` - Navigation und Routing
- `src/utils/` - Hilfsfunktionen und Utilities

## Technologien

- React Native
- Expo
- React Navigation
- AsyncStorage für lokale Datenspeicherung
