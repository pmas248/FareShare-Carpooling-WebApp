// app/(no_tabs)/register.jsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ToastAndroid,
  Platform,
} from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { CDN_URL} from '@env';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  // cross‐platform popup
  const showPopup = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert(msg);
    }
  };

  const validatePassword = (pwd) => {
    // at least 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return regex.test(pwd);
  };

  const handleRegister = async () => {
    if (!validatePassword(password)) {
      showPopup(
        'Invalid password - must be ≥6 chars, include uppercase, lowercase, number & special character.'
      );
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const uid = user.uid;

      // your existing backend call - connects only web app to backend, need to see how to connect android and ios to backend
      await fetch(`${CDN_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firebaseUID: uid,
          firstName,
          lastName,
          email: user.email,
          phone,
          profilePhoto: '',
          reviewScoreUser: 0,
          totalReviews: 0,
          wallet: 0,
          licenseValidated: false,
        }),
      });

      showPopup('Registration Successful');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Registration Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        showPopup('This email is already registered.');
      } else {
        showPopup(`Registration Failed: ${error.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.title}>Create an Account</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#EF476F',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#0BC2DE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#8338EC',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});
//End of file