import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.kasa',
  appName: 'Consumo Energético',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'http'
  }
};

export default config;
