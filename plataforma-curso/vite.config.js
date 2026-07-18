import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configura o Vite para abrir especificamente o Microsoft Edge (onde estão as melhores vozes de IA)
process.env.BROWSER = 'msedge';

export default defineConfig({
  plugins: [react()],
  build: {
    target: ['es2020', 'safari14'],
    cssTarget: 'safari14'
  },
  server: {
    open: true, // Abre o navegador automaticamente ao iniciar
    proxy: {
      '/api': 'http://127.0.0.1:5174'
    },
    fs: {
      // Permitir acesso ao diretório pai para ler os markdowns
      allow: ['..']
    }
  }
})
