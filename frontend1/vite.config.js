// import { defineConfig } from 'vite'
// /** @type {import('tailwindcss').Config} */
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// // import('tailwindcss').Config

// // https://vite.dev/config/

// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [react(), tailwindcss(),],
// }

// // import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'
// // import path from "path"

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react(),
// //     tailwindcss(),
// //   ],
// //   resolve: {
// //     alias: {
// //       '@': path.resolve(__dirname, './src'),
// //     },
// //   },
// //   service:"gmail"
// // })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(),react()],
})
