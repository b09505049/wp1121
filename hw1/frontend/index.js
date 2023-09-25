/* global axios */
const itemTemplate = document.querySelector("#diary-item-template");
const diaryList = document.querySelector("#diarys");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  console.log(diaryList);
  setupEventListeners();
  try {
    const diarys = await getDiarys();
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
  const selectFilter = document.getElementById("filter");
  const buttonFilter = document.getElementById("filter-button");
  buttonFilter.addEventListener("click", async () => {
    const filter = selectFilter.value;
    let key;
    let value;
    if (filter === "學業") {
      key = "tag";
      value = "學業";
    } else if (filter === "人際") {
      key = "tag";
      value = "人際";
    } else if (filter === "社團") {
      key = "tag";
      value = "社團";
    } else if (filter === "快樂") {
      key = "mood";
      value = "快樂";
    } else if (filter === "生氣") {
      key = "mood";
      value = "生氣";
    } else if (filter === "難過") {
      key = "mood";
      value = "難過";
    }
    const filteredDiarys = await getFilteredDiary(key, value);
    console.log(filteredDiarys);
    const parent = document.getElementById("diarys");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    filteredDiarys.forEach((diary) => renderDiary(diary));
    console.log(diaryList);
  });
  const showAllFilter = document.getElementById("show-all-button");
  showAllFilter.addEventListener("click", async () => {
    const parent = document.getElementById("diarys");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    const diarys = await getDiarys();
    diarys.forEach((diary) => renderDiary(diary));
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

async function getFilteredDiary(key, value) {
  const response = await instance.get(`/diarys/${key}/${value}`);
  return response.data;
}

main();
