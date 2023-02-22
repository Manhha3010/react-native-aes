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

export function DecryptScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const [data, setData] = useState({});
  const [dec, setDec] = useState('');
  const [text, setText] = useState('');
  const [cipher, setCipher] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');

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
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: Colors.white,
            flex: 1,
          }}>
          <TextInput
            style={{
              height: 50,
              backgroundColor: '#ccc',
              marginHorizontal: 30,
            }}
            placeholder="Enter Cipher"
            placeholderTextColor={'#000'}
            onChangeText={setCipher}
            autoCorrect={false}
          />
          <TextInput
            style={{
              height: 50,
              backgroundColor: '#ccc',
              marginHorizontal: 30,
            }}
            placeholder="Enter key"
            placeholderTextColor={'#000'}
            onChangeText={setKey}
            autoCorrect={false}
          />
          <TextInput
            style={{
              height: 50,
              backgroundColor: '#ccc',
              marginHorizontal: 30,
            }}
            placeholder="Enter Iv"
            placeholderTextColor={'#000'}
            onChangeText={setIv}
            autoCorrect={false}
          />

          <Text style={styles.sectionDescription}>Decrypted: {dec}</Text>

          <TouchableOpacity onPress={() => getDec()}>
            <Text style={styles.button}>Decrypt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
