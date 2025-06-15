import { defineConfig } from 'vite'
// Permite que Vite utilice correctamente WebAssembly ESM Integration (WASM)

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()]
})
