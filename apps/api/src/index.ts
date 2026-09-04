import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();
const PORT = process.env.PORT || 4040;

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

export default app;