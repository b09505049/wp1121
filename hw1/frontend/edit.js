/* global axios */
const urlParams = new URLSearchParams(window.location.search);

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();
  try {
    const container = document.querySelector(".diary-item");
    container.id = urlParams.get("id");

    const dateParts = urlParams
      .get("date")
      .match(/\d{4}\.\d{2}\.\d{2}/)[0]
      .split(".");
    const yearText = document.getElementById("year-input");
    yearText.value = dateParts[0];
    const monthText = document.getElementById("month-input");
    monthText.value = dateParts[1];
    const dayText = document.getElementById("day-input");
    dayText.value = dateParts[2];

    if (urlParams.get("tag").includes("其他")) {
      const tagRadio = document.getElementById("tag-其他");
      tagRadio.checked = true;
      const tagInput = document.getElementById("tag-input");
      tagInput.value = urlParams.get("tag").match(/\(([^)]+)\)/)[1];
    } else {
      const tagRadio = document.getElementById(urlParams.get("tag"));
      tagRadio.checked = true;
    }
    if (urlParams.get("mood").includes("其他")) {
      const moodRadio = document.getElementById("mood-其他");
      moodRadio.checked = true;
      const moodInput = document.getElementById("mood-input");
      moodInput.value = urlParams.get("mood").match(/\(([^)]+)\)/)[1];
    } else {
      const moodRadio = document.getElementById(urlParams.get("mood"));
      moodRadio.checked = true;
    }
    const contentText = document.getElementById("content-input");
    if (urlParams.get("content") != 0) {
      contentText.value = urlParams.get("content");
    }
  } catch (error) {
    alert("Failed to load diary!");
  }
}

function setupEventListeners() {
  const cancelDiaryButton = document.querySelector("#diary-cancel");
  cancelDiaryButton.addEventListener("click", async () => {
    if (urlParams.get("tag") == 0) {
      window.location.href = "index.html";
    } else {
      window.location.href =
        "view.html?id=" +
        urlParams.get("id") +
        "&date=" +
        urlParams.get("date") +
        "&tag=" +
        urlParams.get("tag") +
        "&mood=" +
        urlParams.get("mood") +
        "&content=" +
        urlParams.get("content");
    }
  });
  const saveDiaryButton = document.getElementById("diary-save");
  saveDiaryButton.addEventListener("click", async () => {
    const selectedTag = document.querySelector('input[name="tag"]:checked');
    const selectedMood = document.querySelector('input[name="mood"]:checked');
    const enteredContent = document.querySelector("#content-input").value;
    const enteredTag = document.querySelector("#tag-input").value;
    const enteredMood = document.querySelector("#mood-input").value;
    const enteredYear = document.querySelector("#year-input").value;
    const enteredMonth = document.querySelector("#month-input").value;
    const enteredDay = document.querySelector("#day-input").value;
    const formattedDate = `${enteredYear}-${
      enteredMonth < 10 && !(enteredMonth[0] == 0) ? "0" : ""
    }${enteredMonth}-${
      enteredDay < 10 && !(enteredDay[0] == 0) ? "0" : ""
    }${enteredDay}`.toString();

    if (!enteredYear) {
      alert("Please enter YEAR.");
      return;
    } else if (!enteredMonth) {
      alert("Please enter MONTH.");
      return;
    } else if (!enteredDay) {
      alert("Please enter DAY.");
      return;
    } else if (!selectedTag) {
      alert("Please select your tag");
      return;
    } else if (!selectedMood) {
      alert("Please select your mood.");
      return;
    } else if (!enteredContent) {
      alert("Please enter diary content.");
      return;
    } else if (selectedTag.value === "其他" && !enteredTag) {
      alert("Please enter your tag content.");
      return;
    } else if (selectedMood.value === "其他" && !enteredMood) {
      alert("Please enter your mood content.");
      return;
    } else if (!dateIsValid(formattedDate)) {
      alert("Please enter valid date (YYYY/MM/DD)");
    } else {
      const date = getStoredDate(formattedDate);
      console.log(date);
      let tag;
      let mood;
      if (selectedTag.value === "其他") {
        tag = selectedTag.value + " (" + enteredTag + ")";
      } else {
        tag = selectedTag.value;
      }
      if (selectedMood.value === "其他") {
        mood = selectedMood.value + " (" + enteredMood + ")";
      } else {
        mood = selectedMood.value;
      }
      const content = enteredContent;
      if (urlParams.get("tag") == 0) {
        await createDiary({ date, tag, mood, content });
      } else {
        await updateDiaryStatus(urlParams.get("id"), {
          date,
          tag,
          mood,
          content,
        });
      }
      window.location.href =
        "view.html?id=" +
        urlParams.get("id") +
        "&date=" +
        date +
        "&tag=" +
        tag +
        "&mood=" +
        mood +
        "&content=" +
        content;
    }
  });
}

async function createDiary(diary) {
  const response = await instance.post("/diarys", diary);
  return response.data;
}

async function updateDiaryStatus(id, diary) {
  const response = await instance.put(`/diarys/${id}`, diary);
  return response.data;
}

function dateIsValid(dateInput) {
  const date = new Date(dateInput.toString());
  return date instanceof Date && !isNaN(date);
}

function getStoredDate(formattedDate) {
  const date = new Date(formattedDate.toString());
  const dayOfWeek = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
  const storedDate = formattedDate.replace(/-/g, ".") + " (" + dayOfWeek + ")";
  return storedDate;
}

main();
