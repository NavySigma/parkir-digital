import express from 'express';
import cors from 'cors';
import { handler as createTx } from './api/create-transaction.js';
import { handler as checkStatus } from './api/check-status.js';
// Tambahkan handler lain jika perlu

const app = express();
app.use(cors());
app.use(express.json());

// Mapping manual API
app.post('/api/create-transaction', createTx);
app.get('/api/check-status', checkStatus);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 API Server ready at http://localhost:${PORT}`);
});
