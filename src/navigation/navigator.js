import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EncryptScreen} from '../container/EncryptScreen';
import {DecryptScreen} from '../container/DecryptScreen';

const Stack = createNativeStackNavigator();

export function Navigator() {
  const navigation = useNavigation();

  function HomeScreen() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Home Screen</Text>
        <TouchableOpacity onPress={onPressEncrypt}>
          <Text>Mã hóa </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressDecryt}>
          <Text>Giải mã</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onPressDecryt = () => {
    navigation.navigate('DecryptScreen');
  };

  const onPressEncrypt = () => {
    navigation.navigate('EncryptScreen');
  };
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EncryptScreen" component={EncryptScreen} />
      <Stack.Screen name="DecryptScreen" component={DecryptScreen} />
    </Stack.Navigator>
  );
}

export default Navigator;
