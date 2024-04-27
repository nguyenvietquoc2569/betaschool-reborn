import * as express from "express";
import { searchAPeople, newTag, searchParent, deleteTag, fetchAPeople, fetchATag, linkPeopleToDotB } from '../services/people'
export const router = express.Router();

router.post('/searchapeople', searchAPeople)
router.post('/searchparent', searchParent)
router.post('/addTag', newTag)
router.post('/deleteTag', deleteTag)
router.post('/fetchAPeople', fetchAPeople)
router.post('/fetchATag', fetchATag)
router.post('/linkPeopleToDotb',linkPeopleToDotB)
