async function main() {
  setupEventListeners();
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const container = document.querySelector(".diary-item");
    container.id = urlParams.get("id");
    const date = document.getElementById("diary-date");
    date.innerText = "Date: " + urlParams.get("date");
    const tag = document.getElementById("diary-tag");
    tag.innerText = "Tag: " + urlParams.get("tag");
    const mood = document.getElementById("diary-mood");
    mood.innerText = "Mood: " + urlParams.get("mood");
    const content = document.getElementById("diary-content");
    content.innerText = "Content: " + urlParams.get("content");
  } catch (error) {
    alert("Failed to load diary!");
  }
}

function setupEventListeners() {
  const editDiaryButton = document.querySelector("#diary-edit");
  editDiaryButton.addEventListener("click", async () => {
    const container = document.querySelector(".diary-item");
    const date = document.getElementById("diary-date");
    const tag = document.getElementById("diary-tag");
    const mood = document.getElementById("diary-mood");
    const content = document.getElementById("diary-content");
    window.location.href =
      "edit.html?id=" +
      container.id +
      "&date=" +
      date.innerText.split(": ")[1] +
      "&tag=" +
      tag.innerText.split(": ")[1] +
      "&mood=" +
      mood.innerText.split(": ")[1] +
      "&content=" +
      content.innerText.split(": ")[1];
  });
  const backDiaryButton = document.querySelector("#diary-back");
  backDiaryButton.addEventListener("click", async () => {
    window.location.href = "index.html?";
  });
}

main();
