import * as express from 'express'
import { fetchAPeople } from '../services-app/people';
export const router = express.Router();
router.get('/details', fetchAPeople);
