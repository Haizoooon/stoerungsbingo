import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import BingoScreen from '../screens/BingoScreen';
import BingoDetailScreen from '../screens/BingoDetailScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();
const BingoStack = createNativeStackNavigator();

// Bingo Stack Navigator
const BingoStackNavigator = () => {
  return (
    <BingoStack.Navigator screenOptions={{ headerShown: false }}>
      <BingoStack.Screen name="BingoList" component={BingoScreen} />
      <BingoStack.Screen name="BingoDetail" component={BingoDetailScreen} />
    </BingoStack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Bingo') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Statistik') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Konto') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
          }
        })}
      >
        <Tab.Screen name="Bingo" component={BingoStackNavigator} />
        <Tab.Screen name="Statistik" component={StatisticsScreen} />
        <Tab.Screen name="Konto" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
