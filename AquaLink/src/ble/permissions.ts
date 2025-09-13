import { PermissionsAndroid, Platform } from 'react-native';

export async function requestBluetoothPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      // Para Android 12+ (API 31+)
      if (Platform.Version >= 31) {
        const bluetoothScanPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: 'Permissão de escaneamento Bluetooth',
            message: 'O AquaLink precisa de permissão para escanear dispositivos Bluetooth.',
            buttonPositive: 'OK',
          }
        );
        
        const bluetoothConnectPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: 'Permissão de conexão Bluetooth',
            message: 'O AquaLink precisa de permissão para se conectar a dispositivos Bluetooth.',
            buttonPositive: 'OK',
          }
        );
        
        const fineLocationPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permissão de localização',
            message: 'O AquaLink precisa de permissão de localização para escanear dispositivos Bluetooth.',
            buttonPositive: 'OK',
          }
        );
        
        return (
          bluetoothScanPermission === PermissionsAndroid.RESULTS.GRANTED &&
          bluetoothConnectPermission === PermissionsAndroid.RESULTS.GRANTED &&
          fineLocationPermission === PermissionsAndroid.RESULTS.GRANTED
        );
      } 
      // Para Android 6.0 até 11
      else {
        const fineLocationPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permissão de localização',
            message: 'O AquaLink precisa de permissão de localização para escanear dispositivos Bluetooth.',
            buttonPositive: 'OK',
          }
        );
        
        return fineLocationPermission === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Erro ao solicitar permissões Bluetooth:', err);
      return false;
    }
  } else {
    // Para iOS não é necessário solicitar permissão manualmente
    return true;
  }
}

// Call early in your BLE flow
await requestBluetoothPermissions();