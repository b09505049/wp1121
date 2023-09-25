/* global axios */
const urlParams = new URLSearchParams(window.location.search);

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();
  try {
    console.log("id: " + urlParams.get("id"));
    console.log("date: " + urlParams.get("date"));
    console.log("tag: " + urlParams.get("tag"));
    console.log("mood: " + urlParams.get("mood"));
    console.log("content: " + urlParams.get("content"));

    const container = document.querySelector(".diary-item");
    container.id = urlParams.get("id");
    const date = document.getElementById("diary-date");
    date.innerText = "Date: " + urlParams.get("date");

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
    console.log(selectedTag + selectedMood + enteredContent);

    if (!selectedTag) {
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
    } else {
      console.log(
        selectedTag.value + " " + selectedMood.value + " " + enteredContent,
      );
      const date = urlParams.get("date");
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

main();
