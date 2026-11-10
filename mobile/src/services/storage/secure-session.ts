import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'lockulture.access-token';
// For future real authentication. Mock user lives separately; never persist passwords.
// Web preview keeps tokens in memory, not unencrypted browser localStorage.
let webToken: string | null = null;
export const secureSession = {
  async getToken() {
    return Platform.OS === 'web' ? webToken : SecureStore.getItemAsync(TOKEN_KEY);
  },
  async setToken(token: string) {
    if (Platform.OS === 'web') {
      webToken = token;
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async clearToken() {
    if (Platform.OS === 'web') {
      webToken = null;
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
