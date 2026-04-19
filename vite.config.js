import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handler as createTransaction } from './api/create-transaction.js'
import { handler as checkStatus } from './api/check-status.js'
import { handler as webhook } from './api/webhook.js'
import { handler as contact } from './api/contact.js'
import url from 'url'

export default defineConfig(({ mode }) => {
  // Load env vars agar bisa dipakai di middleware
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }

  return {
    plugins: [
      react(),
      {
        name: 'vite-plugin-vercel-api-emulator',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const parsedUrl = url.parse(req.url, true)
            const pathname = parsedUrl.pathname

            if (pathname.startsWith('/api/')) {
              console.log(`[API] ${req.method} ${pathname}`)
              
              // Helper untuk res.status().json()
              res.status = (code) => {
                res.statusCode = code
                return res
              }
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              }

              // Helper untuk req.query
              req.query = parsedUrl.query

              // Helper untuk req.body (ambil data stream)
              if (req.method === 'POST' || req.method === 'PUT') {
                const buffers = []
                for await (const chunk of req) {
                  buffers.push(chunk)
                }
                const data = Buffer.concat(buffers).toString()
                try {
                  req.body = JSON.parse(data)
                } catch (e) {
                  req.body = data
                }
              }

              // Routing manual ke handler yang ada
              try {
                if (pathname === '/api/create-transaction') return await createTransaction(req, res)
                if (pathname === '/api/check-status') return await checkStatus(req, res)
                if (pathname === '/api/webhook') return await webhook(req, res)
                if (pathname === '/api/contact') return await contact(req, res)
                
                // Jika tidak ketemu
                res.status(404).json({ message: 'API Route not found' })
                return
              } catch (err) {
                console.error('API Error:', err)
                res.status(500).json({ message: err.message })
                return
              }
            }
            next()
          })
        }
      }
    ]
  }
})
