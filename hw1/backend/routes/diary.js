import {
  createDiary,
  getDiarys,
  updateDiaryStatus,
  getFilteredDiary,
} from "../controllers/diary.js";
import express from "express";

// Create an express router
const router = express.Router();

// Every path we define here will get /api/diarys prefix
// To make code even more cleaner we can wrap functions in `./controllers` folder

// GET /api/diarys
router.get("/", getDiarys);
// POST /api/diarys
router.post("/", createDiary);
// PUT /api/diarys/:id
router.put("/:id", updateDiaryStatus);
// GET /api/diarys
router.get("/:key/:value", getFilteredDiary);

// export the router
export default router;
