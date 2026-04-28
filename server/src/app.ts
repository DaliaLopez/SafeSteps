import express, {Router} from 'express';
import { NODE_ENV, PORT } from './config';
import cors from "cors";
import {errorsMiddleware} from './middlewares/errorsMiddleware';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.send('Hola mundo!');
});

const apiRouter = Router(); 
app.use('/api', apiRouter);

app.use(errorsMiddleware);

if(NODE_ENV != 'production') {

  app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

};

export default app;

app.get('/posts', (req, res) => {
    console.log(req.query);
  return res.send('Hola mundo!');
});


