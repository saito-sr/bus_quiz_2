// ★ Google Apps Script の Web API URL を貼る
const API_URL = "https://script.google.com/macros/s/AKfycbxGM71atngYTxRYKr-zteNRDpbl4E0Kbkh_hZl5HLZ65Sd9-pzd2cGkRJFMF0jd_De4Ng/exec";

let username = "";
let current = 0;
let answers = [];

// ★ 20問のクイズ（例）
const quiz = [
  { q: "東京湾アクアラインの「海ほたるパーキングエリア」は海上に浮かぶ人工島にあります。この船の形をした人工島の「全長」はおよそ何メートルでしょうか？", c: ["約350ｍ", "約500ｍ", "約650ｍ", "約800ｍ"], correct: 2, img: "", explanation: "海ほたるは全長約650ｍ、幅約100ｍの木葉型（船のような形）をしています。ちなみに、アクアラインの川崎側にあるもう一つの円形人工島「風の塔」は、直径が約200ｍです。" },
  { q: "出光興産がゼネコンや運送会社と連携して実証・導入を進めている、既存のディーゼルエンジンをそのまま動かせる次世代バイオ燃料「出光リニューアルディーゼル(IRD)」の主な燃料は何でしょうか？", c: ["トウモロコシ", "藻類（ミドリムシなど）", "廃食用油", "木材チップ"], correct: 2 , explanation: ""},
  { q: "障がいや難病のある方が利用する「就労継続支援Ｂ型事業所」の最大の特徴はどれでしょうか？", c: ["事業所と雇用契約を結び、最低賃金以上の給与が支払われる", "事業所と雇用契約を結ばず、作業に応じた「工賃」が支払われる", "原則として２年しか利用することができない", "原則として「６５歳未満」の年齢制限があり、高齢者は利用できない"], correct: 1, explanation: "事業所と雇用契約を結ばず、作業に応じた「工賃」が支払われます。雇用契約を結ばないため、体調やペースに合わせて柔軟に働くことができるのが特徴です。Ａは就労継続支援Ａ型の特徴です。ＣとＤは主に就労移行支援などに適用されるルールで、Ｂ型にはこれらの制限はありません。" },
  { q: "植松支部長は船橋支部で歴代、何代目の支部長でしょうか？", c: ["第21代", "第22代", "第23代", "第24代"], correct: 3, img: "", explanation: ""},
  { q: "船橋支部ではこれまで女性の支部長は何人おられたでしょうか？", c: ["1人", "2人", "3人", "4人"], correct: 2, img: "", explanation: "第13代及川清子支部長、第19代大味実枝子支部長、第21代田島雅子支部長"},
  { q: "船橋支部管内の労基署である東金労基署の管轄の市は次のうちどこでしょう？", c: ["佐倉市", "印西市", "富里市", "白井市"], correct: 0, img: "", explanation: ""},
  { q: "社会保険労務士法が施行されたのはいつでしょう？", c: ["昭和42年(1967年)", " 昭和43年（1968年）", "昭和44年（1969年）", "昭和45年（1970年）"], correct: 1, img: "", explanation: "社会保険労務士制度は、昭和43年6月3日に制定公布、同年12月2日に社会保険労務士法が施行。この日が「社労士の日」とされています。"},
  { q: "第1回社会保険労務士試験が実施されたのはいつでしょう？？", c: ["昭和43年（1968年）", "昭和44年（1969年）", "昭和45年（1970年）", "昭和46年（1971年）"], correct: 1, img: "", explanation: "法律が施行された翌年の昭和44年に、第1回社労士試験が実施されました。"},
  { q: "社会保険労務士法で「信用失墜行為の禁止」が定められているのは何条でしょう？？", c: ["第10条", "第15条", "第16条", "第18条"], correct: 0, img: "", explanation: "社会保険労務士法第16条には、「社会保険労務士は、その信用又は品位を害するような行為をしてはならない」と規定されています。"}, 
  { q: "第58回社会保険労務士試験(8月23日実施)選択式雇用保険法より<br>雇用保険法第4条第3項において、「失業」とは、被保険者が離職し、（　　　　　　）を有するにもかかわらず、職業に就くことができない状態にあること」と規定している", c: ["求職の意思", "求職の意思及び能力", "労働の意思", "労働の意思及び能力"], correct: 3, img: "", explanation: "基礎中の基礎なので正解すべき問題！Byクレアール速報解説より"},
  { q: "第58回社会保険労務士試験(8月23日実施)選択式労務管理その他労働に関する一般常識より<br>令和7年6月1日現在の民間企業に雇用されている障害者の数は704,610人で、実雇用率は14年連続で過去最高の（　　　　）％、法定雇用率達成企業の割合は46％であった。", c: ["1.82％", "2.41％", "3.07％", "3.69％"], correct: 1, img: "", explanation: "障害者雇用状況の集計結果（厚生労働省）によれば、「実雇用率」は令和6年、令和7年共に2.41％で、過去最高のまま14年連続更新しています。ちなみに「障害者雇用率」は2026年7月から2.7％へ引き上げられています。"},
  { q: "第58回社会保険労務士試験(8月23日実施)選択式社会保険に関する一般常識より<br>令和6年末の、国民年金保険料の全額免除•猶予者数は592万人であり、全額免除•猶予者数が国民年金の第1号被保険者数（任意加入被保険者を除く）に占める割合は（　　　　）％となっている", c: ["4.0％", "24.0％", "44.0％", "64.0％"], correct: 2, img: "", explanation: "かなり難問で取りづらい統計問題でした。が、国民年金の第1号被保険者が大体1300万人、3号が大体600万人などの数字が頭に入っている受験生なら、592万人をみて割合を計算できたかも、というところでしょうか（Byフォーサイト解答速報）"},
  { q: "東京湾アクアライン全体の延長はおよそ何ｍでしょうか？？", c: ["15.1Km", " 5.1Km", "25.1Km", "35.1Km"], correct: 0, img: "", explanation: ""},
  { q: "出光興産千葉事務所は、出光グループの中でどのような位置づけでしょうか？？", c: ["最大規模の事業所", "最小規模の事業所", "研究専門の事業所", "販売専門の事業所"], correct: 0, img: "", explanation: ""},
  { q: "AolnAolnオーキッドガーデンでは仕事を一つの大きな工程ではなく、細かな作業に分けています。その目的は？？", c: ["作業時間をできるだけ長くするため", "できるだけ機械化するため", "一人一人に合った仕事を見つけやすくするため", "栽培する花の種類を増やしていくため"], correct: 2, img: "", explanation: ""},
  { q: "令和8年10月1日から適用される千葉県の地域別最低賃金（時間額）はいくらでしょう？", c: ["1,140円", "1,165円", "1,195円", "1,210円"], correct: 3, img: "", explanation: "令和8年の千葉県最低賃金は、前年度から55円引き上げられ、1,195円になりました。"},
  { q: "？", c: ["", "", "", ""], correct: 0, img: "", explanation: ""},
  { q: "？", c: ["", "", "", ""], correct: 0, img: "", explanation: ""},
  { q: "？", c: ["", "", "", ""], correct: 0, img: "", explanation: ""},
  { q: "？", c: ["", "", "", ""], correct: 0, img: "", explanation: ""},  
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
  imageDiv.innerHTML = "";

  if (q.img) {
    const img = document.createElement("img");
    img.src = q.img;
    img.classList.add("question-img");

    if (q.size) {
      img.style.maxWidth = q.size + "px";
    }

    imageDiv.appendChild(img);
  }

  // 選択肢エリア
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  const labels = ["A", "B", "C", "D"];  // 記号を定義

  q.c.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.classList.add("choice-btn");
    btn.textContent = `${labels[index]}. ${choice}`;

    if (answers[current] === index) {
      btn.classList.add("selected");
    }

    btn.onclick = () => selectAnswer(index, btn);
    choicesDiv.appendChild(btn);
  });

  // ナビゲーション（次へ）
  const navDiv = document.createElement("div");
  navDiv.classList.add("nav-container");

  const nextBtn = document.createElement("button");
  nextBtn.innerText = current === quiz.length - 1 ? "回答終了" : "次へ";
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

const labels = ["A", "B", "C", "D"];  // 記号を定義

quiz.forEach((q, index) => {
  const userAnswerIndex = answers[index];

  // あなたの回答（記号付き）
  let userAnswerText = "未回答";
  if (userAnswerIndex !== undefined) {
    const userLabel = labels[userAnswerIndex];
    userAnswerText = `${userLabel}. ${q.c[userAnswerIndex]}`;
  }

  // 正解（記号付き）
  const correctLabel = labels[q.correct];
  const correctText = `${correctLabel}. ${q.c[q.correct]}`;

  // 解説文（正解＋解説）
  const explanationText = q.explanation
    ? `正解は${correctText}。${q.explanation}`
    : `正解は${correctText}。`;

  // ★ 解説文を色付きにする（例：青色）
  const coloredExplanation = `<span style="color: #0066cc;">${explanationText}</span>`;

  // 表示
  const p = document.createElement("p");
  p.innerHTML =
    `Q${index + 1}. ${q.q}<br><br>` +                     // 問題文の下に1行空ける
    `<strong>あなたの回答: ${userAnswerText}</strong><br><br>` +  // 太字＋さらに1行空ける
    `${coloredExplanation}`;                             // ★ 色付き解説文

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
