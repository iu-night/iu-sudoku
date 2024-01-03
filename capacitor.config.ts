import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'iu.sudoku',
  appName: 'Iu Sudoku',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
