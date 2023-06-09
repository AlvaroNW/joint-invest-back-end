import Express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import portfolioRoute from './routes/portfolioRoutes.js';
import orderbookRoute from './routes/orderbookRoute.js';
import overviewRoutes from './routes/overviewRoute.js';
import transactionRoute from './routes/transactionRoute.js';
import { errorHandler } from './middleware/errorHandler.js';
import portfolioCreationRoutes from './routes/portfolioCreationRoute.js';
import userRoute from './routes/userRoutes.js';
import { logoData } from './controllers/stockDetailController.js';
import { cacheMiddelware } from './middleware/cache.js';
import { middlewareToGetAPIcalls } from './controllers/cacheController.js';
import { getPortfolioPending } from './controllers/portfolioController.js';
import MessagesRoutes from './routes/messageRoute.js';

const app = Express();

app.use(cors());
app.use(Express.json());
app.use(bodyParser.json());

const port = 3000;

app.use('/api/order_book', orderbookRoute);
app.use('/api/portfolio', portfolioRoute);
app.use('/api/pending/:portfolio_id', getPortfolioPending);
app.use('/api/overview', overviewRoutes);
app.use('/api/transaction', transactionRoute);
app.use('/api/creation_portfolio', portfolioCreationRoutes);
app.use('/api/user', userRoute);
app.use('/api/messages', MessagesRoutes);
app.get('/api/stocks', logoData);
app.post('/api/external', cacheMiddelware, middlewareToGetAPIcalls);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
