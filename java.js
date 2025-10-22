// --- DOM 참조 ---
const yesBtn = document.getElementById('yesBtn')
const noBtn = document.getElementById('noBtn')
const cardContainer = document.getElementById('cardContainer')
const stepLabel = document.getElementById('stepLabel')
const progressBar = document.getElementById('progressBar')

const resultSection = document.getElementById('resultSection')
const finalSection = document.getElementById('finalSection')
const answerValue = document.getElementById('answerValue')
const correctBtn = document.getElementById('correctBtn')
const wrongBtn = document.getElementById('wrongBtn')
const finalBox = document.getElementById('finalBox')
const restartBtn = document.getElementById('restartBtn')

// --- 카드 생성 ---
function makeCards() {
  const cards = []
  for (let bit = 0; bit < 5; bit++) {
    const card = []
    for (let n = 0; n < 32; n++) {
      if ((n >> bit) & 1) card.push(n)
    }
    cards.push(card)
  }
  return cards
}

const CARDS = makeCards()
let current = 0
let result = 0

// --- 카드 표시 (부드러운 페이드 효과) ---
function renderCard() {
  cardContainer.style.opacity = 0
  setTimeout(() => {
    cardContainer.innerHTML = ''

    const title = document.createElement('div')
    title.className = 'card-title'
    title.textContent = `[카드 ${current + 1}] 이 카드에 당신의 숫자가 있나요?`
    cardContainer.appendChild(title)

    const grid = document.createElement('div')
    grid.className = 'grid'
    CARDS[current].forEach((n) => {
      const cell = document.createElement('div')
      cell.className = 'num'
      cell.textContent = n
      grid.appendChild(cell)
    })
    cardContainer.appendChild(grid)

    stepLabel.textContent = `${current + 1} / 5`
    progressBar.style.width = `${(current / 5) * 100}%`

    // 페이드 인
    cardContainer.style.transition = 'opacity 0.6s ease'
    cardContainer.style.opacity = 1
  }, 300)
}

// --- 응답 처리 ---
function next(answerYes) {
  if (answerYes) result += 2 ** current
  current++

  if (current < 5) {
    renderCard()
  } else {
    progressBar.style.width = '100%'
    stepLabel.textContent = `5 / 5`
    showResult()
  }
}

// --- 결과 표시 ---
function showResult() {
  answerValue.textContent = result
  yesBtn.disabled = true
  noBtn.disabled = true
  resultSection.classList.remove('hidden')
}

// --- 정답 여부 ---
function showFinal(correct) {
  finalBox.textContent = correct
    ? '정답이에요! 🌹 당신의 마음을 읽었어요.'
    : '아쉽네요 💔 다시 해볼까요?'
  finalSection.classList.remove('hidden')
}

// --- 재시작 ---
function resetGame() {
  current = 0
  result = 0
  resultSection.classList.add('hidden')
  finalSection.classList.add('hidden')
  yesBtn.disabled = false
  noBtn.disabled = false
  renderCard()
}

// --- 이벤트 바인딩 ---
yesBtn.onclick = () => next(true)
noBtn.onclick = () => next(false)
correctBtn.onclick = () => showFinal(true)
wrongBtn.onclick = () => showFinal(false)
restartBtn.onclick = resetGame

// --- 단축키 지원 ---
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase()
  if (resultSection.classList.contains('hidden')) {
    if (key === 'y') next(true)
    if (key === 'n') next(false)
  }
  if (key === 'r') resetGame()
})

// --- 초기 표시 ---
renderCard()
