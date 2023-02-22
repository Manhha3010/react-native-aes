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
// tạo key có độ dài length từ password và salt
const generateKey = (password, salt, cost, length) =>
  Aes.pbkdf2(password, salt, cost, length);

// mã hóa text với key và iv
const encrypt = (text, key) => {
  // tạo iv ngẫu nhiên có độ dài 16 byte
  return Aes.randomKey(16).then(iv => {
    return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
      cipher,
      iv,
    }));
  });
};

export function EncryptScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const [data, setData] = useState({});
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');

  const getData = async () => {
    // tạo key từ password và salt có độ dài 256 bit (32 byte)
    generateKey(password, salt, 128, 256).then(key => {
      encrypt(text, key)
        .then(({cipher, iv}) => {
          setData({cipher, iv, key});
        })
        .catch(error => {
          console.error(error);
        });
    });
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    innerHeight: '100%',
    outerHeight: '100%',
  };

  // useEffect(() => {
  //   getData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
            placeholder="Enter text"
            placeholderTextColor={'#000'}
            onChangeText={txt => setText(txt)}
            autoCorrect={false}
          />
          <TextInput
            style={{
              height: 50,
              backgroundColor: '#ccc',
              marginHorizontal: 30,
            }}
            placeholder="Enter Password"
            placeholderTextColor={'#000'}
            onChangeText={txt => setPassword(txt)}
          />
          <TextInput
            style={{
              height: 50,
              backgroundColor: '#ccc',
              marginHorizontal: 30,
            }}
            placeholder="Enter Salt"
            placeholderTextColor={'#000'}
            onChangeText={txt => setSalt(txt)}
            autoCorrect={false}
          />
          <Text>key:</Text>
          <Text selectable={true} style={styles.sectionDescription}>
            {data.key}
          </Text>

          <Text>iv:</Text>
          <Text selectable={true} style={styles.sectionDescription}>
            {data.iv}
          </Text>
          <Text> Cipher Text:</Text>
          <Text style={styles.sectionDescription} selectable>
            {data.cipher}
          </Text>
          <TouchableOpacity onPress={() => getData()}>
            <Text style={styles.button}>Encrypt</Text>
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
