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

// 200개 이상의 초대형 음식 데이터베이스 (총 210개)
const foodDB = [
  // --- 매운맛 (35개) ---
  { name: "낙지볶음 덮밥", taste: "매운맛", main: "밥", origin: "한식" },
  { name: "제육덮밥", taste: "매운맛", main: "밥", origin: "한식" },
  { name: "김치볶음밥", taste: "매운맛", main: "밥", origin: "한식" },
  { name: "오징어덮밥", taste: "매운맛", main: "밥", origin: "한식" },
  { name: "전주 비빔밥", taste: "매운맛", main: "밥", origin: "한식" },
  { name: "매운 갈비찜", taste: "매운맛", main: "고기/구이", origin: "한식" },
  { name: "닭갈비", taste: "매운맛", main: "고기/구이", origin: "한식" },
  { name: "불닭", taste: "매운맛", main: "고기/구이", origin: "분식/야식" },
  { name: "매운 닭발", taste: "매운맛", main: "고기/구이", origin: "분식/야식" },
  { name: "볼케이노 치킨", taste: "매운맛", main: "고기/구이", origin: "분식/야식" },
  { name: "양념 곱창구이", taste: "매운맛", main: "고기/구이", origin: "한식" },
  { name: "짬뽕", taste: "매운맛", main: "면", origin: "중식" },
  { name: "신라면", taste: "매운맛", main: "면", origin: "분식/야식" },
  { name: "비빔냉면", taste: "매운맛", main: "면", origin: "한식" },
  { name: "쫄면", taste: "매운맛", main: "면", origin: "분식/야식" },
  { name: "마라샹궈", taste: "매운맛", main: "면", origin: "중식" },
  { name: "사천 짜장면", taste: "매운맛", main: "면", origin: "중식" },
  { name: "마라탕", taste: "매운맛", main: "국물/탕", origin: "중식" },
  { name: "김치찌개", taste: "매운맛", main: "국물/탕", origin: "한식" },
  { name: "육개장", taste: "매운맛", main: "국물/탕", origin: "한식" },
  { name: "순두부찌개", taste: "매운맛", main: "국물/탕", origin: "한식" },
  { name: "매운 매운탕", taste: "매운맛", main: "국물/탕", origin: "한식" },
  { name: "동태탕", taste: "매운맛", main: "국물/탕", origin: "한식" },
  { name: "감자탕", taste: "매운맛", main: "국물/탕", origin: "한식" },
  { name: "핫크리스피 버거", taste: "매운맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "매콤 타코", taste: "매운맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "스파이시 브리또", taste: "매운맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "떡볶이", taste: "매운맛", main: "면", origin: "분식/야식" },
  { name: "라볶이", taste: "매운맛", main: "면", origin: "분식/야식" },
  { name: "매운 어묵탕", taste: "매운맛", main: "국물/탕", origin: "분식/야식" },
  { name: "아구찜", taste: "매운맛", main: "해산물/회", origin: "한식" },
  { name: "해물찜", taste: "매운맛", main: "해산물/회", origin: "한식" },
  { name: "매운 쭈꾸미 볶음", taste: "매운맛", main: "해산물/회", origin: "한식" },
  { name: "양념 게장", taste: "매운맛", main: "해산물/회", origin: "한식" },
  { name: "칠리 새우", taste: "매운맛", main: "해산물/회", origin: "중식" },

  // --- 단맛 (35개) ---
  { name: "불고기 덮밥", taste: "단맛", main: "밥", origin: "한식" },
  { name: "오므라이스", taste: "단맛", main: "밥", origin: "양식" },
  { name: "치킨 마요 덮밥", taste: "단맛", main: "밥", origin: "일식" },
  { name: "파인애플 볶음밥", taste: "단맛", main: "밥", origin: "동남아식" },
  { name: "짜장면", taste: "단맛", main: "면", origin: "중식" },
  { name: "팟타이", taste: "단맛", main: "면", origin: "동남아식" },
  { name: "야키소바", taste: "단맛", main: "면", origin: "일식" },
  { name: "스파게티 보로네제", taste: "단맛", main: "면", origin: "양식" },
  { name: "탕수육", taste: "단맛", main: "고기/구이", origin: "중식" },
  { name: "돼지 갈비구이", taste: "단맛", main: "고기/구이", origin: "한식" },
  { name: "허니버터 치킨", taste: "단맛", main: "고기/구이", origin: "분식/야식" },
  { name: "데리야끼 닭꼬치", taste: "단맛", main: "고기/구이", origin: "일식" },
  { name: "떡갈비", taste: "단맛", main: "고기/구이", origin: "한식" },
  { name: "꿔바로우", taste: "단맛", main: "고기/구이", origin: "중식" },
  { name: "돈까스", taste: "단맛", main: "고기/구이", origin: "일식" },
  { name: "함박 스테이크", taste: "단맛", main: "고기/구이", origin: "양식" },
  { name: "단호박 스프", taste: "단맛", main: "국물/탕", origin: "양식" },
  { name: "옥수수 스프", taste: "단맛", main: "국물/탕", origin: "양식" },
  { name: "단팥죽", taste: "단맛", main: "국물/탕", origin: "한식" },
  { name: "호박죽", taste: "단맛", main: "국물/탕", origin: "한식" },
  { name: "불고기 전골", taste: "단맛", main: "국물/탕", origin: "한식" },
  { name: "불고기 버거", taste: "단맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "에그타르트 & 토스트", taste: "단맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "프렌치 토스트", taste: "단맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "와플 & 아이스크림", taste: "단맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "팬케이크", taste: "단맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "카야 토스트", taste: "단맛", main: "빵/패스트푸드", origin: "동남아식" },
  { name: "허니 브레드", taste: "단맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "꿀호떡", taste: "단맛", main: "빵/패스트푸드", origin: "분식/야식" },
  { name: "츄러스", taste: "단맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "단단면", taste: "단맛", main: "면", origin: "중식" },
  { name: "크림새우", taste: "단맛", main: "해산물/회", origin: "중식" },
  { name: "간장 새우장", taste: "단맛", main: "해산물/회", origin: "한식" },
  { name: "장어 구이(양념)", taste: "단맛", main: "해산물/회", origin: "일식" },
  { name: "고구마 튀김", taste: "단맛", main: "빵/패스트푸드", origin: "분식/야식" },

  // --- 짠맛 (35개) ---
  { name: "스팸 마요 덮밥", taste: "짠맛", main: "밥", origin: "한식" },
  // 간장게장 수정 반영 (간장게장 밥 -> 간장게장 / main: 해산물/회)
  { name: "간장게장", taste: "짠맛", main: "해산물/회", origin: "한식" },
  { name: "규동(소고기덮밥)", taste: "짠맛", main: "밥", origin: "일식" },
  { name: "가츠동", taste: "짠맛", main: "밥", origin: "일식" },
  { name: "까르보나라", taste: "짠맛", main: "면", origin: "양식" },
  { name: "알리오 올리오", taste: "짠맛", main: "면", origin: "양식" },
  { name: "돈코츠 라멘", taste: "짠맛", main: "면", origin: "일식" },
  { name: "쇼유 라멘", taste: "짠맛", main: "면", origin: "일식" },
  { name: "소바(모밀)", taste: "짠맛", main: "면", origin: "일식" },
  { name: "봉골레 파스타", taste: "짠맛", main: "면", origin: "양식" },
  { name: "훈제 바베큐 립", taste: "짠맛", main: "고기/구이", origin: "양식" },
  { name: "소세지 구이", taste: "짠맛", main: "고기/구이", origin: "양식" },
  { name: "양꼬치", taste: "짠맛", main: "고기/구이", origin: "중식" },
  { name: "감자탕", taste: "짠맛", main: "국물/탕", origin: "한식" },
  { name: "부대찌개", taste: "짠맛", main: "국물/탕", origin: "한식" },
  { name: "청국장", taste: "짠맛", main: "국물/탕", origin: "한식" },
  { name: "된장찌개", taste: "짠맛", main: "국물/탕", origin: "한식" },
  { name: "미소시루(미소라멘)", taste: "짠맛", main: "국물/탕", origin: "일식" },
  { name: "페퍼로니 피자", taste: "짠맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "수제 치즈버거", taste: "짠맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "베이컨 치즈 피자", taste: "짠맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "프렌치 프라이(감자튀김)", taste: "짠맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "퀘사디아", taste: "짠맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "치즈 스틱", taste: "짠맛", main: "빵/패스트푸드", origin: "분식/야식" },
  { name: "나초", taste: "짠맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "고등어 자반 구이", taste: "짠맛", main: "해산물/회", origin: "한식" },
  { name: "굴비 구이", taste: "짠맛", main: "해산물/회", origin: "한식" },
  { name: "임면수 구이", taste: "짠맛", main: "해산물/회", origin: "한식" },
  { name: "해물 쟁반짜장", taste: "짠맛", main: "면", origin: "중식" },
  { name: "명란젓 덮밥", taste: "짠맛", main: "밥", origin: "한식" },
  { name: "생선까스", taste: "짠맛", main: "해산물/회", origin: "일식" },
  { name: "타코야끼", taste: "짠맛", main: "빵/패스트푸드", origin: "일식" },
  { name: "오꼬노미야끼", taste: "짠맛", main: "빵/패스트푸드", origin: "일식" },
  { name: "양념 곱창전골", taste: "짠맛", main: "국물/탕", origin: "한식" },
  { name: "알탕", taste: "짠맛", main: "국물/탕", origin: "한식" },

  // --- 고소한맛 (35개) ---
  { name: "삼겹살 구이", taste: "고소한맛", main: "고기/구이", origin: "한식" },
  { name: "목살 구이", taste: "고소한맛", main: "고기/구이", origin: "한식" },
  { name: "소고기 등심 구이", taste: "고소한맛", main: "고기/구이", origin: "한식" },
  { name: "차돌박이 구이", taste: "고소한맛", main: "고기/구이", origin: "한식" },
  { name: "훈제 오리구이", taste: "고소한맛", main: "고기/구이", origin: "한식" },
  { name: "후라이드 치킨", taste: "고소한맛", main: "고기/구이", origin: "분식/야식" },
  { name: "전기구이 통닭", taste: "고소한맛", main: "고기/구이", origin: "분식/야식" },
  { name: "야키토리(꼬치구이)", taste: "고소한맛", main: "고기/구이", origin: "일식" },
  { name: "우삼겹 덮밥", taste: "고소한맛", main: "밥", origin: "일식" },
  { name: "전복죽", taste: "고소한맛", main: "밥", origin: "한식" },
  { name: "계란 볶음밥", taste: "고소한맛", main: "밥", origin: "중식" },
  { name: "알밥", taste: "고소한맛", main: "밥", origin: "한식" },
  { name: "콩국수", taste: "고소한맛", main: "면", origin: "한식" },
  { name: "들깨 칼국수", taste: "고소한맛", main: "면", origin: "한식" },
  { name: "크림 파스타", taste: "고소한맛", main: "면", origin: "양식" },
  { name: "투움바 파스타", taste: "고소한맛", main: "면", origin: "양식" },
  { name: "들깨 수제비", taste: "고소한맛", main: "국물/탕", origin: "한식" },
  { name: "도가니탕", taste: "고소한맛", main: "국물/탕", origin: "한식" },
  { name: "사골곰탕", taste: "고소한맛", main: "국물/탕", origin: "한식" },
  { name: "양송이 크림스프", taste: "고소한맛", main: "국물/탕", origin: "양식" },
  { name: "모듬 회", taste: "고소한맛", main: "해산물/회", origin: "일식" },
  { name: "광어회", taste: "고소한맛", main: "해산물/회", origin: "일식" },
  { name: "우럭회", taste: "고소한맛", main: "해산물/회", origin: "일식" },
  { name: "대방어회", taste: "고소한맛", main: "해산물/회", origin: "일식" },
  { name: "참치회", taste: "고소한맛", main: "해산물/회", origin: "일식" },
  { name: "연어회", taste: "고소한맛", main: "해산물/회", origin: "일식" },
  { name: "대하 소금구이", taste: "고소한맛", main: "해산물/회", origin: "한식" },
  { name: "조개구이", taste: "고소한맛", main: "해산물/회", origin: "한식" },
  { name: "모듬 튀김", taste: "고소한맛", main: "빵/패스트푸드", origin: "분식/야식" },
  { name: "크로와상", taste: "고소한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "마늘 바게트", taste: "고소한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "베이글 & 크림치즈", taste: "고소한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "파전 / 해물파전", taste: "고소한맛", main: "빵/패스트푸드", origin: "한식" },
  { name: "김치전", taste: "고소한맛", main: "빵/패스트푸드", origin: "한식" },
  { name: "감자전", taste: "고소한맛", main: "빵/패스트푸드", origin: "한식" },

  // --- 담백한맛 (35개) ---
  { name: "연어 덮밥(사케동)", taste: "담백한맛", main: "밥", origin: "일식" },
  { name: "곤드레 밥", taste: "담백한맛", main: "밥", origin: "한식" },
  { name: "월남쌈", taste: "담백한맛", main: "밥", origin: "동남아식" },
  { name: "보리밥 정식", taste: "담백한맛", main: "밥", origin: "한식" },
  { name: "소고기 쌀국수", taste: "담백한맛", main: "면", origin: "동남아식" },
  { name: "잔치국수", taste: "담백한맛", main: "면", origin: "한식" },
  { name: "바지락 칼국수", taste: "담백한맛", main: "면", origin: "한식" },
  { name: "우동", taste: "담백한맛", main: "면", origin: "일식" },
  { name: "평양냉면", taste: "담백한맛", main: "면", origin: "한식" },
  { name: "팟씨유", taste: "담백한맛", main: "면", origin: "동남아식" },
  { name: "수육 / 보쌈", taste: "담백한맛", main: "고기/구이", origin: "한식" },
  { name: "훈제 닭가슴살 샐러드", taste: "담백한맛", main: "고기/구이", origin: "양식" },
  { name: "안심 스테이크", taste: "담백한맛", main: "고기/구이", origin: "양식" },
  { name: "샤브샤브", taste: "담백한맛", main: "고기/구이", origin: "일식" },
  { name: "삼계탕", taste: "담백한맛", main: "국물/탕", origin: "한식" },
  { name: "설렁탕", taste: "담백한맛", main: "국물/탕", origin: "한식" },
  { name: "갈비탕", taste: "담백한맛", main: "국물/탕", origin: "한식" },
  { name: "나주곰탕", taste: "담백한맛", main: "국물/탕", origin: "한식" },
  { name: "북엇국", taste: "담백한맛", main: "국물/탕", origin: "한식" },
  { name: "콩나물국밥", taste: "담백한맛", main: "국물/탕", origin: "한식" },
  { name: "조개탕", taste: "담백한맛", main: "국물/탕", origin: "한식" },
  { name: "연포탕", taste: "담백한맛", main: "국물/탕", origin: "한식" },
  { name: "클럽 샌드위치", taste: "담백한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "리코타 치즈 샐러드", taste: "담백한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "치아바타 샌드위치", taste: "담백한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "서브웨이 샌드위치", taste: "담백한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "식빵 & 잼", taste: "담백한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "전복 회", taste: "담백한맛", main: "해산물/회", origin: "한식" },
  { name: "산낙지 회", taste: "담백한맛", main: "해산물/회", origin: "한식" },
  { name: "문어 숙회", taste: "담백한맛", main: "해산물/회", origin: "한식" },
  { name: "가리비 찜", taste: "담백한맛", main: "해산물/회", origin: "한식" },
  { name: "대게 / 킹크랩 찜", taste: "담백한맛", main: "해산물/회", origin: "한식" },
  { name: "메밀 소바", taste: "담백한맛", main: "면", origin: "일식" },
  { name: "야채 김밥", taste: "담백한맛", main: "밥", origin: "분식/야식" },
  { name: "충무 김밥", taste: "담백한맛", main: "밥", origin: "분식/야식" },

  // --- 새콤한맛 (35개) ---
  { name: "물냉면", taste: "새콤한맛", main: "면", origin: "한식" },
  { name: "김치말이 국수", taste: "새콤한맛", main: "면", origin: "한식" },
  { name: "열무 국수", taste: "새콤한맛", main: "면", origin: "한식" },
  { name: "초계 국수", taste: "새콤한맛", main: "면", origin: "한식" },
  { name: "중국식 냉면", taste: "새콤한맛", main: "면", origin: "중식" },
  { name: "분짜", taste: "새콤한맛", main: "면", origin: "동남아식" },
  { name: "모듬 초밥", taste: "새콤한맛", main: "해산물/회", origin: "일식" },
  { name: "연어 초밥", taste: "새콤한맛", main: "해산물/회", origin: "일식" },
  { name: "광어 초밥", taste: "새콤한맛", main: "해산물/회", origin: "일식" },
  { name: "초새우 초밥", taste: "새콤한맛", main: "해산물/회", origin: "일식" },
  { name: "회덮밥", taste: "새콤한맛", main: "밥", origin: "한식" },
  { name: "물회", taste: "새콤한맛", main: "해산물/회", origin: "한식" },
  { name: "오징어 초무침", taste: "새콤한맛", main: "해산물/회", origin: "한식" },
  { name: "골뱅이 소면 무침", taste: "새콤한맛", main: "면", origin: "분식/야식" },
  { name: "똠얌꿍", taste: "새콤한맛", main: "국물/탕", origin: "동남아식" },
  { name: "유린기", taste: "새콤한맛", main: "고기/구이", origin: "중식" },
  { name: "양장피", taste: "새콤한맛", main: "고기/구이", origin: "중식" },
  { name: "케이준 치킨 샐러드", taste: "새콤한맛", main: "고기/구이", origin: "양식" },
  { name: "토마토 파스타", taste: "새콤한맛", main: "면", origin: "양식" },
  { name: "해물 토마토 리조또", taste: "새콤한맛", main: "밥", origin: "양식" },
  { name: "마르게리따 피자", taste: "새콤한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "반미 샌드위치", taste: "새콤한맛", main: "빵/패스트푸드", origin: "동남아식" },
  { name: "타코(라임 소스)", taste: "새콤한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "분모자 분짜", taste: "새콤한맛", main: "면", origin: "동남아식" },
  { name: "김치 볶음밥(새콤)", taste: "새콤한맛", main: "밥", origin: "한식" },
  { name: "묵사발 / 묵밥", taste: "새콤한맛", main: "국물/탕", origin: "한식" },
  { name: "냉모밀", taste: "새콤한맛", main: "면", origin: "일식" },
  { name: "소라 무침", taste: "새콤한맛", main: "해산물/회", origin: "한식" },
  { name: "꼬막 무침", taste: "새콤한맛", main: "해산물/회", origin: "한식" },
  { name: "가츠산도", taste: "새콤한맛", main: "빵/패스트푸드", origin: "일식" },
  { name: "피클 & 수제 소시지", taste: "새콤한맛", main: "고기/구이", origin: "양식" },
  { name: "유부초밥", taste: "새콤한맛", main: "밥", origin: "일식" },
  { name: "칠리 핫도그", taste: "새콤한맛", main: "빵/패스트푸드", origin: "양식" },
  { name: "샐러드 파스타", taste: "새콤한맛", main: "면", origin: "양식" },
  { name: "나초 샐러드", taste: "새콤한맛", main: "빵/패스트푸드", origin: "양식" }
];

let currentMode = ''; 
let currentStepIndex = 0;
let userSelection = { taste: '', main: '', origin: '' };
let activeQuickTab = 'taste';

const stepKeys = ['taste', 'main', 'origin'];
const stepTitles = ['원하는 맛을 선택하세요', '주메뉴 종류를 선택하세요', '음식 출처를 선택하세요'];

// --- 초기화 및 이벤트 리스너 ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
  document.getElementById('btn-mode-step').addEventListener('click', () => initMode('step'));
  document.getElementById('btn-mode-quick').addEventListener('click', () => initMode('quick'));
  document.getElementById('btn-spin-step').addEventListener('click', spinCurrentStep);
  document.getElementById('btn-spin-quick').addEventListener('click', runDirectFinalSpin);
  document.getElementById('btn-spin-final').addEventListener('click', runFinalJackpot);
  document.getElementById('btn-reset').addEventListener('click', resetAll);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchQuickTab(e.target.getAttribute('data-tab'), e.target);
    });
  });
});

function initMode(mode) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  currentMode = mode;
  userSelection = { taste: '', main: '', origin: '' };
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

// --- 엄격한 필터링 적용 (완전 일치하는 항목만 노출) ---
function showFinalResultScreen() {
  hideAllScreens();
  document.getElementById('steps-indicator').classList.add('hidden');
  document.getElementById('screen-result').classList.remove('hidden');

  const container = document.getElementById('result-list-box');
  container.innerHTML = '';

  // 지정된 조건에 모두(100%) 부합하는 항목만 필터링
  const exactMatches = foodDB.filter(f => {
    if (userSelection.taste && f.taste !== userSelection.taste) return false;
    if (userSelection.main && f.main !== userSelection.main) return false;
    if (userSelection.origin && f.origin !== userSelection.origin) return false;
    return true;
  });

  // 조건에 일치하는 결과가 없는 경우 처리
  if (exactMatches.length === 0) {
    container.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-sub);">선택하신 조건에 완전히 일치하는 메뉴가 없습니다.<br>다른 조건으로 다시 시도해 보세요!</div>`;
    return;
  }

  // 화면에 100% 일치 결과 카드 생성
  exactMatches.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.innerHTML = `
      <span>${item.name}</span>
      <span class="result-item-sub">${item.origin} · ${item.main} · ${item.taste}</span>
    `;
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