/* global axios */
const itemTemplate = document.querySelector("#diary-item-template");
const diaryList = document.querySelector("#diarys");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();
  try {
    const diarys = await getDiarys();
    console.log(getDiarys());
    diarys.forEach((diary) => renderDiary(diary));
  } catch (error) {
    alert("Failed to load diarys!");
  }
}

function setupEventListeners() {
  const addDiaryButton = document.querySelector("#diary-add");
  addDiaryButton.addEventListener("click", async () => {
    const currentDate = getCurrentDate();
    window.location.href =
      "edit.html?id=" +
      0 +
      "&date=" +
      currentDate +
      "&tag=" +
      0 +
      "&mood=" +
      0 +
      "&content=" +
      0;
  });
}

function renderDiary(diary) {
  const item = createDiaryElement(diary);
  diaryList.appendChild(item);
}

function createDiaryElement(diary) {
  const item = itemTemplate.content.cloneNode(true);
  const container = item.querySelector(".diary-item");
  container.id = diary.id;
  const onbutton = item.querySelector("p.diary-on-button");
  onbutton.innerText = diary.date + "/" + diary.tag + "/" + diary.mood;
  const content = item.querySelector("p.diary-content");
  content.innerText = diary.content;
  const newButton = item.querySelector("button.view-diary");
  newButton.dataset.id = diary.id;
  newButton.addEventListener("click", () => {
    window.location.href =
      "view.html?id=" +
      diary.id +
      "&date=" +
      diary.date +
      "&tag=" +
      diary.tag +
      "&mood=" +
      diary.mood +
      "&content=" +
      diary.content;
  });
  return item;
}

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const dayOfWeek = ["日", "一", "二", "三", "四", "五", "六"][
    currentDate.getDay()
  ];
  const formattedDate = `${year}.${month < 10 ? "0" : ""}${month}.${
    day < 10 ? "0" : ""
  }${day} (${dayOfWeek})`;
  return formattedDate;
}

async function getDiarys() {
  const response = await instance.get("/diarys");
  return response.data;
}

main();
