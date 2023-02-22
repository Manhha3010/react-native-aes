/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import Navigator from './src/navigation/navigator';

var Aes = NativeModules.Aes;

const generateKey = (password, salt, cost, length) =>
  Aes.pbkdf2(password, salt, cost, length);

const encrypt = (text, key) => {
  return Aes.randomKey(16).then(iv => {
    return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
      cipher,
      iv,
    }));
  });
};
const decrypt = async (encryptedData, key) => {
  console.log({encryptedData, key});
  return Aes.decrypt(
    encryptedData.cipher,
    key,
    encryptedData.iv,
    'aes-256-cbc',
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [data, setData] = useState({});
  const [dec, setDec] = useState('');
  const [text, setText] = useState('');

  const getData = async () => {
    generateKey('Ninh', 'salt', 128, 256).then(key => {
      console.log('Key:', key);
      encrypt(text, key)
        .then(({cipher, iv}) => {
          console.log('ivvv', iv);
          console.log('Encrypted:', cipher);
          setData({cipher, iv, key});
        })
        .catch(error => {
          console.error(error);
        });
    });
  };

  const getDec = async () => {
    var {cipher, key, iv} = data;
    decrypt({cipher, iv}, key).then(decrypted => {
      console.log({decrypted});
      setDec(decrypted);
    });
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    innerHeight: '100%',
    outerHeight: '100%',
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    paddingHorizontal: 10,
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    textDecorationLine: 'underline',
    padding: 20,
    textAlign: 'center',
  },
});

export default App;
