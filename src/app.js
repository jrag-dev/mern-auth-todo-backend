import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import './config/db.js'
import authRoutes from './routes/auth.routes.js';

class App {
  
  constructor() {
    this.app = express()
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(morgan('tiny'))
  }

  routes() {
    this.app.use('/api/v1/auth', authRoutes)
  }
}

export default new App().app;