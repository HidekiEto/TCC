import { useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { 
  GoogleAuthProvider, 
  signInWithCredential 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import Constants from 'expo-constants';

const { GOOGLE_WEB_CLIENT_ID } = Constants.expoConfig?.extra || {};

console.log('🔧 [useGoogleSignIn] Configurando Google Sign-In...');
console.log('🔧 [useGoogleSignIn] Web Client ID:', GOOGLE_WEB_CLIENT_ID);

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  scopes: ['profile', 'email'],
});

interface UseGoogleSignInResult {
  promptAsync: () => Promise<void>;
  loading: boolean;
}

export const useGoogleSignIn = (
  onSuccess: () => void,
  remember: boolean = true
): UseGoogleSignInResult => {
  const [loading, setLoading] = useState(false);

  const promptAsync = async () => {
    setLoading(true);
    try {
      console.log('🔍 [GoogleSignIn] Verificando Google Play Services...');
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('✅ [GoogleSignIn] Google Play Services disponível');
      
      if (!remember) {
        try { await GoogleSignin.signOut(); } catch {}
        try { await GoogleSignin.revokeAccess(); } catch {}
        console.log('🔁 [GoogleSignIn] Sessão Google limpa para forçar seletor de contas');
      }

      console.log('🔑 [GoogleSignIn] Iniciando Google Sign-In...');
      const userInfo = await GoogleSignin.signIn();
  console.log('✅ [GoogleSignIn] Login bem-sucedido:', userInfo.data?.user?.email);
      
      const idToken = userInfo.data?.idToken;
      
      if (!idToken) {
        throw new Error('Não foi possível obter o token de autenticação');
      }
      
      const googleCredential = GoogleAuthProvider.credential(idToken);
      
      const userCredential = await signInWithCredential(auth, googleCredential);
      
      await AsyncStorage.setItem('slidesVistos', 'true');
      await AsyncStorage.setItem('userToken', userCredential.user.uid);
      await AsyncStorage.setItem('keepLoggedIn', remember ? 'true' : 'false');
      
      Alert.alert('Sucesso!', 'Login com Google realizado com sucesso!');
      
      setTimeout(() => {
        onSuccess();
      }, 1000);
      
    } catch (error: any) {
      try {
        console.log('❌ [GoogleSignIn] Falha no login');
        console.log('   code:', error?.code);
        console.log('   message:', error?.message);
      } catch {}
      console.error('Erro no login com Google:', error);
      
      let errorMessage = 'Erro ao fazer login com Google.';
      
      if (error.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Login cancelado pelo usuário.';
      } else if (error.code === 'IN_PROGRESS') {
        errorMessage = 'Login já em andamento.';
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Google Play Services não disponível.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Já existe uma conta com este email usando outro método de login.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error.code === 'DEVELOPER_ERROR') {
        errorMessage = 'Configuração inválida (DEVELOPER_ERROR). Verifique SHA-1 / Web Client ID.';
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de rede. Verifique a conexão do dispositivo e tente novamente.';
      } else {
        errorMessage = error.message || 'Erro desconhecido.';
      }

      try { await GoogleSignin.signOut(); } catch {}
      try { await GoogleSignin.revokeAccess(); } catch {}
      
      if (error.code !== 'SIGN_IN_CANCELLED') {
        Alert.alert('Erro', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    promptAsync,
    loading,
  };
};
