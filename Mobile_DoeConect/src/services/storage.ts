import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN: '@doeconect:token',
  USUARIO: '@doeconect:usuario',
} as const;

export const storage = {
  getToken: () => AsyncStorage.getItem(KEYS.TOKEN),
  setToken: (token: string) => AsyncStorage.setItem(KEYS.TOKEN, token),
  removeToken: () => AsyncStorage.removeItem(KEYS.TOKEN),

  getUsuario: async () => {
    const raw = await AsyncStorage.getItem(KEYS.USUARIO);
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    try {
      return JSON.parse(raw);
    } catch {
      await AsyncStorage.removeItem(KEYS.USUARIO);
      return null;
    }
  },
  setUsuario: (usuario: object) =>
    AsyncStorage.setItem(KEYS.USUARIO, JSON.stringify(usuario)),
  removeUsuario: () => AsyncStorage.removeItem(KEYS.USUARIO),

  clearAll: async () => {
    await AsyncStorage.removeItem(KEYS.TOKEN);
    await AsyncStorage.removeItem(KEYS.USUARIO);
  },
};
