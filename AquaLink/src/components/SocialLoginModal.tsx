import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithCredential,
  OAuthProvider 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

interface SocialLoginModalProps {
  visible: boolean;
  onClose: () => void;
  provider: 'google';
  onSuccess: () => void;
}

export default function SocialLoginModal({
  visible,
  onClose,
  provider,
  onSuccess,
}: SocialLoginModalProps) {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success' && provider === 'google') {
      const { authentication } = response;
      handleGoogleSignIn(authentication?.idToken, authentication?.accessToken);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken?: string, accessToken?: string) => {
    try {
      setLoading(true);
      
      if (!idToken || !accessToken) {
        throw new Error('Tokens de autenticação não encontrados');
      }

      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const userCredential = await signInWithCredential(auth, credential);
      
      // Salvar informações de autenticação
      await AsyncStorage.setItem('slidesVistos', 'true');
      await AsyncStorage.setItem('userToken', userCredential.user.uid);
      await AsyncStorage.setItem('keepLoggedIn', 'true');
      
      Alert.alert('Sucesso!', 'Login com Google realizado com sucesso!');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      
      let errorMessage = 'Erro ao fazer login com Google.';
      let errorDetails = '';

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorDetails = 'Popup fechado pelo usuário.';
          break;
        case 'auth/cancelled-popup-request':
          errorDetails = 'Requisição cancelada.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorDetails = 'Já existe uma conta com este email usando outro método de login.';
          break;
        case 'auth/network-request-failed':
          errorDetails = 'Erro de conexão. Verifique sua internet.';
          break;
        default:
          errorDetails = error.message || 'Erro desconhecido.';
      }
      
      Alert.alert(errorMessage, errorDetails);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (response?.type === 'success' && provider === 'google') {
      const { authentication } = response;
      handleGoogleSignIn(authentication?.idToken, authentication?.accessToken);
    }
  }, [response]);

  const handleLogin = async () => {
    promptAsync();
  };

  const getProviderInfo = () => {
    return {
      name: 'Google',
      color: '#DB4437',
      icon: 'logo-google' as const,
    };
  };

  const providerInfo = getProviderInfo();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>

          <View style={[styles.iconContainer, { backgroundColor: providerInfo.color }]}>
            <Ionicons name={providerInfo.icon} size={48} color="#fff" />
          </View>

          <Text style={styles.title}>Login com {providerInfo.name}</Text>
          <Text style={styles.description}>
            Você será redirecionado para fazer login com sua conta {providerInfo.name}
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={providerInfo.color} />
              <Text style={styles.loadingText}>Autenticando...</Text>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.continueButton, { backgroundColor: providerInfo.color }]}
                onPress={handleLogin}
              >
                <Ionicons name={providerInfo.icon} size={20} color="#fff" />
                <Text style={styles.continueButtonText}>
                  Continuar com {providerInfo.name}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.disclaimer}>
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});
