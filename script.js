// ★ Google Apps Script の Web API URL を貼る
const API_URL = "https://script.google.com/macros/s/AKfycbxI62WlYRxWZD5xZVUwaVdlGIT8UbhtGErE6zUImUWwNANwEboueNbSsInNMhqljrWIAQ/exec";

let username = "";
let current = 0;
let answers = [];

// ★ 10～20問のクイズ（例）
const quiz = [
  { q: "東京湾アクアラインの「海ほたるパーキングエリア」は海上に浮かぶ人工島にあります。この船の形をした人工島の「全長」はおよそ何メートルでしょうか？", c: ["約350ｍ", "約500ｍ", "約650ｍ", "約800ｍ"], correct: 2 },
  { q: "出光興産がゼネコンや運送会社と連携して実証・導入を進めている、既存のディーゼルエンジンをそのまま動かせる次世代バイオ燃料「出光リニューアルディーゼル(IRD)」の主な燃料は何でしょうか？", c: ["トウモロコシ", "藻類（ミドリムシなど）", "廃食用油", "木材チップ"], correct: 2 },
  { q: "障がいや難病のある方が利用する「就労継続支援Ｂ型事業所」の最大の特徴はどれでしょうか？", c: ["事業所と雇用契約を結び、最低賃金以上の給与が支払われる", "事業所と雇用契約を結ばず、作業に応じた「工賃」が支払われる", "原則として２年しか利用することができない", "原則として「６５歳未満」の年齢制限があり、高齢者は利用できない"], correct: 1 },
  { q: "サッカーは1チーム何人？", c: ["11人", "9人", "7人"], correct: 0 },
  { q: "地球は何番目の惑星？", c: ["3番目", "2番目", "4番目"], correct: 0},
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

  current = 0;
  answers = [];

  showPage("page-quiz");
  showQuestion();
}

function showQuestion() {
  const q = quiz[current];

  // タイトル
  document.getElementById("question-title").innerText = `Q${current + 1}. ${q.q}`;

  // 画像エリア
  const imageDiv = document.getElementById("question-image");
  imageDiv.innerHTML = "";   // ← 前の画像を消す（重要）

  if (q.img) {
    const img = document.createElement("img");
    img.src = q.img;
    img.classList.add("question-img");

    // 問題ごとのサイズ指定（任意）
    if (q.size) {
      img.style.maxWidth = q.size + "px";
    }

    imageDiv.appendChild(img);
  }

  // 選択肢エリア
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";  // ← 前の選択肢を消す

  q.c.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.classList.add("choice-btn");

    if (answers[current] === index) {
      btn.classList.add("selected");
    }

    btn.onclick = () => selectAnswer(index, btn);
    choicesDiv.appendChild(btn);
  });

  // ナビゲーション（前へ・次へ）
  const navDiv = document.createElement("div");
  navDiv.classList.add("nav-container");

  if (current > 0) {
    const prevBtn = document.createElement("button");
    prevBtn.innerText = "前へ";
    prevBtn.classList.add("nav-btn");
    prevBtn.onclick = prevQuestion;
    navDiv.appendChild(prevBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.innerText = current === quiz.length - 1 ? "回答を送信" : "次へ";
  nextBtn.classList.add("nav-btn");
  nextBtn.onclick = nextQuestion;
  navDiv.appendChild(nextBtn);

  choicesDiv.appendChild(navDiv);
}

function selectAnswer(index, btn) {
  answers[current] = index;

  // ★ 他のボタンの selected を外す
  document.querySelectorAll(".choice-btn").forEach(b => b.classList.remove("selected"));

  // ★ 選択したボタンだけ色を付ける
  btn.classList.add("selected");
}


function nextQuestion() {
  // ★ 未回答なら進ませない
  if (answers[current] === undefined) {
    alert("回答を選択してください");
    return;
  }

  // ★ 最終問題なら終了ページへ
  if (current >= quiz.length - 1) {
    finishQuiz();
    return;
  }

  current++;
  showQuestion();
}


function prevQuestion() {
  current--;
  showQuestion();
}

function finishQuiz() {
  showPage("page-finish");

  // ★ 正解数を計算
  let score = 0;
  quiz.forEach((q, index) => {
    if (answers[index] === q.correct) {
      score++;
    }
  });

  // ★ スコア表示
  document.getElementById("result-score").innerText =
    `${username}さんの正解数は ${score} / ${quiz.length} です`;

  // ★ 回答一覧を生成
  const summaryDiv = document.getElementById("answer-summary");
  summaryDiv.innerHTML = ""; // 初期化

  quiz.forEach((q, index) => {
    const userAnswerIndex = answers[index];
    const userAnswerText = userAnswerIndex !== undefined ? q.c[userAnswerIndex] : "未回答";

    const p = document.createElement("p");
    p.innerHTML = `Q${index + 1}. ${q.q}<br>あなたの回答: ${userAnswerText}`;
    summaryDiv.appendChild(p);
  });

  // ★ スプレッドシートへ送信（必要なら残す）
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name: username,
      answers: answers,
      score: score
    })
  });
}
