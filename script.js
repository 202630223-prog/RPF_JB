// --- Web Audio API ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTick() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

function playChime() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.06);
    gain.gain.setValueAtTime(0.08, now + i * 0.06);
    gain.gain.linearRampToValueAtTime(0.001, now + i * 0.06 + 0.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + i * 0.06);
    osc.stop(now + i * 0.06 + 0.2);
  });
}

// --- 데이터 정의 ---
const optionsData = {
  taste: ['매운맛', '단맛', '짠맛', '고소한맛', '담백한맛', '새콤한맛'],
  main: ['밥', '면', '빵/패스트푸드', '고기/구이', '국물/탕', '해산물/회'],
  origin: ['한식', '중식', '일식', '양식', '동남아식', '분식/야식']
};

const foodDB = [
  { name: "낙지볶음 덮밥", taste: "매운맛", main: "밥", origin: "한식" },
  { name: "제육덮밥", taste: "매운맛", main: "밥", origin: "한식" },
  { name: "짬뽕", taste: "매운맛", main: "면", origin: "중식" },
  { name: "마라탕", taste: "매운맛", main: "면", origin: "중식" },
  { name: "핫크리스피 버거", taste: "매운맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "김치찌개", taste: "매운맛", main: "국물/탕", origin: "한식" },
  { name: "불고기 덮밥", taste: "단맛", main: "밥", origin: "한식" },
  { name: "짜장면", taste: "단맛", main: "면", origin: "중식" },
  { name: "팟타이", taste: "단맛", main: "면", origin: "동남아식" },
  { name: "탕수육", taste: "단맛", main: "고기/구이", origin: "중식" },
  { name: "까르보나라", taste: "짠맛", main: "면", origin: "양식" },
  { name: "돈코츠 라멘", taste: "짠맛", main: "면", origin: "일식" },
  { name: "페퍼로니 피자", taste: "짠맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "삼겹살 구이", taste: "고소한맛", main: "고기/구이", origin: "한식" },
  { name: "후라이드 치킨", taste: "고소한맛", main: "고기/구이", origin: "분식/야식" },
  { name: "모듬 회", taste: "고소한맛", main: "해산물/회", origin: "일식" },
  { name: "연어 덮밥", taste: "담백한맛", main: "밥", origin: "일식" },
  { name: "소고기 쌀국수", taste: "담백한맛", main: "면", origin: "동남아식" },
  { name: "샌드위치", taste: "담백한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "물냉면", taste: "새콤한맛", main: "면", origin: "한식" },
  { name: "초밥", taste: "새콤한맛", main: "해산물/회", origin: "일식" }
];

let currentMode = ''; 
let currentStepIndex = 0;
let userSelection = { taste: '', main: '', origin: '' };
let activeQuickTab = 'taste';

const stepKeys = ['taste', 'main', 'origin'];
const stepTitles = ['원하는 맛을 선택하세요', '주메뉴 종류를 선택하세요', '음식 출처를 선택하세요'];

// --- 초기화 및 이벤트 리스너 바인딩 ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
  document.getElementById('btn-mode-step').addEventListener('click', () => initMode('step'));
  document.getElementById('btn-mode-quick').addEventListener('click', () => initMode('quick'));
  document.getElementById('btn-spin-step').addEventListener('click', spinCurrentStep);
  document.getElementById('btn-spin-quick').addEventListener('click', runDirectFinalSpin);
  document.getElementById('btn-spin-final').addEventListener('click', runFinalJackpot);
  document.getElementById('btn-reset').addEventListener('click', resetAll);

  // 빠른 선택 탭 클릭 이벤트
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchQuickTab(e.target.getAttribute('data-tab'), e.target);
    });
  });
});

function initMode(mode) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  currentMode = mode;
  hideAllScreens();

  if (mode === 'step') {
    currentStepIndex = 0;
    document.getElementById('steps-indicator').classList.remove('hidden');
    document.getElementById('screen-step').classList.remove('hidden');
    renderStepContent();
  } else {
    document.getElementById('steps-indicator').classList.add('hidden');
    document.getElementById('screen-quick').classList.remove('hidden');
    renderQuickContent();
  }
}

function hideAllScreens() {
  document.getElementById('screen-start').classList.add('hidden');
  document.getElementById('screen-step').classList.add('hidden');
  document.getElementById('screen-quick').classList.add('hidden');
  document.getElementById('screen-result').classList.add('hidden');
}

// --- 단계별 모드 ---
function renderStepContent() {
  const key = stepKeys[currentStepIndex];
  document.getElementById('step-title-text').innerText = stepTitles[currentStepIndex];
  
  for(let i = 0; i < 3; i++) {
    const pill = document.getElementById(`pill-${i+1}`);
    if (i <= currentStepIndex) pill.classList.add('active');
    else pill.classList.remove('active');
  }

  const grid = document.getElementById('step-options-grid');
  grid.innerHTML = '';
  optionsData[key].forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.innerText = opt;
    btn.onclick = () => onUserManualSelect(key, opt);
    grid.appendChild(btn);
  });
}

function onUserManualSelect(category, val) {
  userSelection[category] = val;
  showPraiseModal("훌륭하신 선택입니다.", val, () => {
    advanceStep();
  });
}

function advanceStep() {
  if (currentStepIndex < 2) {
    currentStepIndex++;
    renderStepContent();
  } else {
    showFinalResultScreen();
  }
}

function spinCurrentStep() {
  const key = stepKeys[currentStepIndex];
  runSpinAnimation(optionsData[key], (selected) => {
    userSelection[key] = selected;
    advanceStep();
  });
}

// --- 빠른 선택 모드 ---
function switchQuickTab(tabKey, targetBtn) {
  activeQuickTab = tabKey;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  targetBtn.classList.add('active');
  renderQuickContent();
}

function renderQuickContent() {
  const grid = document.getElementById('quick-options-grid');
  grid.innerHTML = '';
  optionsData[activeQuickTab].forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    if (userSelection[activeQuickTab] === opt) btn.style.borderColor = 'var(--primary)';
    btn.innerText = opt;
    btn.onclick = () => {
      userSelection = { taste: '', main: '', origin: '' };
      userSelection[activeQuickTab] = opt;
      showPraiseModal("훌륭하신 선택입니다.", opt, () => {
        renderQuickContent();
      });
    };
    grid.appendChild(btn);
  });
}

function runDirectFinalSpin() {
  if (!userSelection[activeQuickTab]) {
    userSelection[activeQuickTab] = optionsData[activeQuickTab][0];
  }
  showFinalResultScreen();
}

// --- 결과 화면 및 연출 ---
function showFinalResultScreen() {
  hideAllScreens();
  document.getElementById('steps-indicator').classList.add('hidden');
  document.getElementById('screen-result').classList.remove('hidden');

  const container = document.getElementById('result-list-box');
  container.innerHTML = '';

  let filtered = foodDB.filter(f => {
    let match = true;
    if (userSelection.taste && f.taste !== userSelection.taste) match = false;
    if (userSelection.main && f.main !== userSelection.main) match = false;
    if (userSelection.origin && f.origin !== userSelection.origin) match = false;
    return match;
  });

  if (filtered.length === 0) {
    filtered = foodDB.slice(0, 4);
  }

  filtered.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `<span>${item.name}</span><span style="font-size:0.75rem; color:var(--text-sub);">${item.origin} / ${item.taste}</span>`;
    container.appendChild(div);
  });
}

function runFinalJackpot() {
  const items = document.querySelectorAll('.result-item span:first-child');
  const list = Array.from(items).map(i => i.innerText);
  if (list.length === 0) return;

  runSpinAnimation(list, (winner) => {
    showPraiseModal("오늘의 추천 음식", winner, null, 2500);
  });
}

function showPraiseModal(subtitle, title, callback, delay = 1000) {
  const modal = document.getElementById('app-modal');
  document.getElementById('modal-subtitle').innerText = subtitle;
  document.getElementById('modal-title').innerText = title;
  
  modal.classList.add('active');
  playChime();

  setTimeout(() => {
    modal.classList.remove('active');
    if (callback) callback();
  }, delay);
}

function runSpinAnimation(optionsArray, onComplete) {
  const modal = document.getElementById('app-modal');
  const sub = document.getElementById('modal-subtitle');
  const main = document.getElementById('modal-title');

  sub.innerText = "선택 중...";
  modal.classList.add('active');

  let idx = 0;
  const interval = setInterval(() => {
    main.innerText = optionsArray[idx % optionsArray.length];
    playTick();
    idx++;
  }, 50);

  setTimeout(() => {
    clearInterval(interval);
    const finalSelected = optionsArray[Math.floor(Math.random() * optionsArray.length)];
    sub.innerText = "선택 완료";
    main.innerText = finalSelected;
    playChime();

    setTimeout(() => {
      modal.classList.remove('active');
      onComplete(finalSelected);
    }, 900);
  }, 1200);
}

function resetAll() {
  userSelection = { taste: '', main: '', origin: '' };
  currentStepIndex = 0;
  hideAllScreens();
  document.getElementById('screen-start').classList.remove('hidden');
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('theme-toggle-btn').innerText = next === 'dark' ? 'Light Mode' : 'Dark Mode';
}