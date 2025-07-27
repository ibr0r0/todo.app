import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const navigation = useNavigation();
  const [isEnglish, setIsEnglish] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const triggerFadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleLanguage = () => {
    setIsEnglish(prev => !prev);
    triggerFadeIn();
  };

  return (
    <ScrollView style={{ backgroundColor: '#121212' }} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#a29bfe" />
      </TouchableOpacity>

      {/* Language Toggle */}
      <View style={styles.languageToggle}>
        <Text style={styles.languageText}>{isEnglish ? 'English' : 'العربية'}</Text>
        <Switch value={isEnglish} onValueChange={toggleLanguage} thumbColor="#a29bfe" />
      </View>

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text
          style={[
            styles.title,
            { textAlign: isEnglish ? 'left' : 'right' }
          ]}
        >
          {isEnglish ? 'About the App' : 'عن التطبيق'}
        </Text>

        <Text
          style={[
            styles.paragraph,
            { textAlign: isEnglish ? 'left' : 'right' }
          ]}
        >
          {isEnglish
            ? 'This application is a simple academic project developed using the Expo platform. It aims to help users organize their daily tasks through a smooth and flexible interface. The project serves as a practical introduction to mobile app development.'
            : 'هذا التطبيق عبارة عن مشروع أكاديمي بسيط تم تطويره باستخدام منصة Expo. يهدف إلى مساعدة المستخدمين على تنظيم مهامهم اليومية من خلال واجهة استخدام مرنة وسهلة. يُعتبر هذا المشروع مدخلًا عمليًا لتعلّم تطوير تطبيقات الهواتف المحمولة.'}
        </Text>

        <Text
          style={[
            styles.subheading,
            { textAlign: isEnglish ? 'left' : 'right' }
          ]}
        >
          👨‍💻
        </Text>

        <View style={styles.namesBox}>
          <Text
            style={[
              styles.name,
              { textAlign: isEnglish ? 'left' : 'right' }
            ]}
          >
            • {isEnglish ? 'Ibr0r' : 'Ibr0r'}
          </Text>
        </View>

        <Text
          style={[
            styles.footer,
            { textAlign: isEnglish ? 'left' : 'right' }
          ]}
        >
          {isEnglish ? 'Version: 1.0.1' : 'الإصدار: 1.0.1'}
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 100,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 25,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  languageToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageText: {
    color: '#a29bfe',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 25,
    width: '100%',
    maxWidth: 450,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 26,
    marginBottom: 20,
  },
  subheading: {
    fontSize: 17,
    color: '#a29bfe',
    fontWeight: '600',
    marginBottom: 10,
  },
  namesBox: {
    marginBottom: 30,
  },
  name: {
    fontSize: 15,
    color: '#fff',
    marginVertical: 4,
  },
  footer: {
    fontSize: 13,
    color: '#888',
  },
});
