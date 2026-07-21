import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OrderProvider} from './src/context/OrderContext';
import CatalogScreen from './src/screens/CatalogScreen';
import BookingScreen from './src/screens/BookingScreen';
import {colors, typography} from './src/theme';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <OrderProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Catalog"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="Catalog" component={CatalogScreen} />
          <Stack.Screen
            name="Booking"
            component={BookingScreen}
            options={{
              headerShown: true,
              headerTitle: 'Booking',
              headerTintColor: colors.text,
              headerTitleStyle: {fontSize: 17, fontWeight: '600'},
              headerStyle: {backgroundColor: colors.bg},
              headerShadowVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </OrderProvider>
  );
}

export default App;
