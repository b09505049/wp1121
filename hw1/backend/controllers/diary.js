import DiaryModel from "../models/diaryModel.js";

// Get all diarys
export const getDiarys = async (req, res) => {
  try {
    // Find all diarys
    const diarys = await DiaryModel.find({});

    // Return diarys
    return res.status(200).json(diarys);
  } catch (error) {
    // If there is an error, return 500 and the error message
    // You can read more about HTTP status codes here:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // Or this meme:
    // https://external-preview.redd.it/VIIvCoTbkXb32niAD-rxG8Yt4UEi1Hx9RXhdHHIagYo.jpg?auto=webp&s=6dde056810f99fc3d8dab920379931cb96034f4b
    return res.status(500).json({ message: error.message });
  }
};
// Create a diary
export const createDiary = async (req, res) => {
  const { date, tag, mood, content } = req.body;

  // Check date, tag, mood and content
  if (!date || !tag || !mood || !content) {
    return res
      .status(400)
      .json({ message: "Date, tag, mood and content are required!" });
  }

  // Create a new dairy
  try {
    const newDiary = await DiaryModel.create({
      date,
      tag,
      mood,
      content,
    });
    return res.status(201).json(newDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a diary
export const updateDiaryStatus = async (req, res) => {
  const { id } = req.params;
  const { date, tag, mood, content } = req.body;

  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
      return res.status(404).json({ message: "Diary not found!" });
    }

    // Update the diary
    if (date !== undefined) existedDiary.date = date;
    if (tag !== undefined) existedDiary.tag = tag;
    if (mood !== undefined) existedDiary.mood = mood;
    if (content !== undefined) existedDiary.content = content;

    // Save the updated dairy
    await existedDiary.save();

    // Rename _id to id
    existedDiary.id = existedDiary._id;
    delete existedDiary._id;

    return res.status(200).json(existedDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFilteredDiary = async (req, res) => {
  //
  // Find all diarys
  const { key, value } = req.params;
  let diarys;
  if (key === "tag") {
    diarys = await DiaryModel.find({ tag: value });
  } else if (key === "mood") {
    diarys = await DiaryModel.find({ mood: value });
  }
  //
  try {
    // Return diarys
    return res.status(200).json(diarys);
  } catch (error) {
    // If there is an error, return 500 and the error message
    // You can read more about HTTP status codes here:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // Or this meme:
    // https://external-preview.redd.it/VIIvCoTbkXb32niAD-rxG8Yt4UEi1Hx9RXhdHHIagYo.jpg?auto=webp&s=6dde056810f99fc3d8dab920379931cb96034f4b
    return res.status(500).json({ message: error.message });
  }
};
