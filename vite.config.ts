import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/VisualTokenComparator/', // Asegúrate de poner el nombre correcto del subdirectorio
  plugins: [
    tailwindcss(),
  ],
})