import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: "manifest.json", dest: "." },         // ✅ Copy manifest.json
        { src: "public/icons", dest: "icons" },
        { src: "background.js", dest: "." },
        { src: "content.js", dest: "." }           
      ]
    })
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        // main: "index.html",           // ✅ Main entry
        content: "content.js", 
        background: "background.js",     // ✅ Add content.js explicitly
        sidepanel: "index.html" // <-- Side panel Main entry
      },
      output: {
        entryFileNames: `[name].js`,     // ✅ Keep original filenames
        chunkFileNames: `[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  server: {
    headers: {
      "Content-Type": "application/javascript"        // ✅ Ensure proper MIME type
    }
  }
})
