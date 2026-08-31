// ★ Google Apps Script の Web API URL を貼る
const API_URL = "https://script.google.com/macros/s/AKfycbxI62WlYRxWZD5xZVUwaVdlGIT8UbhtGErE6zUImUWwNANwEboueNbSsInNMhqljrWIAQ/exec";

let username = "";
let current = 0;
let answers = [];

// ★ 10～20問のクイズ（例）
const quiz = [
  { q: "東京湾アクアラインの「海ほたるパーキングエリア」は海上に浮かぶ人工島にあります。この船の形をした人工島の「全長」はおよそ何メートルでしょうか？", c: ["約350ｍ", "約500ｍ", "約650ｍ", "約800ｍ"] },
  { q: "出光興産がゼネコンや運送会社と連携して実証・導入を進めている、既存のディーゼルエンジンをそのまま動かせる次世代バイオ燃料「出光リニューアルディーゼル(IRD)」の主な燃料は何でしょうか？", c: ["トウモロコシ", "藻類（ミドリムシなど）", "廃食用油", "木材チップ"] },
  { q: "障がいや難病のある方が利用する「就労継続支援Ｂ型事業所」の最大の特徴はどれでしょうか？", c: ["事業所と雇用契約を結び、最低賃金以上の給与が支払われる", "事業所と雇用契約を結ばず、作業に応じた「工賃」が支払われる", "原則として２年しか利用することができない", "原則として「６５歳未満」の年齢制限があり、高齢者は利用できない"] },
  { q: "サッカーは1チーム何人？", c: ["11人", "9人", "7人"] },
  { q: "地球は何番目の惑星？", c: ["3番目", "2番目", "4番目"] },
];

// ページ切り替え
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startQuiz() {
  username = document.getElementById("username").value.trim();
  if (!username) {
    alert("名前を入力してください");
    return;
  }
  showPage("page-quiz");
  showQuestion();
}

function showQuestion() {
  const q = quiz[current];
  document.getElementById("question-title").innerText = `Q${current + 1}. ${q.q}`;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  q.c.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => selectAnswer(index);
    choicesDiv.appendChild(btn);
  });

  document.getElementById("next-btn").disabled = true;
}

function selectAnswer(index) {
  answers[current] = index;
  document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
  current++;

  if (current >= quiz.length) {
    finishQuiz();
  } else {
    showQuestion();
  }
}

function finishQuiz() {
  showPage("page-finish");

  // ★ Google Apps Script に送信
  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: username,
      answers: answers
    })
  });
}
