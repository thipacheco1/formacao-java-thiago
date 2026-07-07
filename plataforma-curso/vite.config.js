import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configura o Vite para abrir especificamente o Microsoft Edge (onde estão as melhores vozes de IA)
process.env.BROWSER = 'msedge';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Abre o navegador automaticamente ao iniciar
    fs: {
      // Permitir acesso ao diretório pai para ler os markdowns
      allow: ['..']
    }
  }
})
