/* =========================
   Binary Card Trick (0~31)
   - Intro → Game flow
   - Rose/Pink theme UX
   ========================= */

/* ------- DOM References ------- */
const introSection = document.getElementById('introSection')
const startBtn = document.getElementById('startBtn')

const gamePanel = document.getElementById('gamePanel')
const cardContainer = document.getElementById('cardContainer')
const stepLabel = document.getElementById('stepLabel')
const progressBar = document.getElementById('progressBar')
const yesBtn = document.getElementById('yesBtn')
const noBtn = document.getElementById('noBtn')

const resultSection = document.getElementById('resultSection')
const answerValue = document.getElementById('answerValue')
const correctBtn = document.getElementById('correctBtn')
const wrongBtn = document.getElementById('wrongBtn')

const finalSection = document.getElementById('finalSection')
const finalBox = document.getElementById('finalBox')
const restartBtn = document.getElementById('restartBtn')

/* ------- State ------- */
let cards = []
let current = 0 // 0..4
let result = 0 // 0..31
let gameStarted = false

/* ------- Logic ------- */
// bit(0..4)별 해당 비트가 1인 숫자 목록 생성
function makeCards() {
  const out = []
  for (let bit = 0; bit < 5; bit++) {
    const list = []
    for (let n = 0; n < 32; n++) {
      if ((n >> bit) & 1) list.push(n)
    }
    out.push(list)
  }
  return out
}

// 카드 렌더 (부드러운 전환)
function renderCard() {
  if (!gameStarted || current < 0 || current > 5) return

  cardContainer.style.opacity = 0
  setTimeout(() => {
    cardContainer.innerHTML = ''

    const title = document.createElement('div')
    title.className = 'card-title'
    title.textContent = `[카드 ${current + 1}] 이 카드에 당신의 숫자가 있나요?`
    cardContainer.appendChild(title)

    const grid = document.createElement('div')
    grid.className = 'grid'
    cards[current].forEach((n) => {
      const cell = document.createElement('div')
      cell.className = 'num'
      cell.textContent = n
      grid.appendChild(cell)
    })
    cardContainer.appendChild(grid)

    stepLabel.textContent = `${current + 1} / 5`
    progressBar.style.width = `${(current / 5) * 100}%`

    cardContainer.style.transition = 'opacity .45s ease'
    cardContainer.style.opacity = 1
  }, 180)
}

function next(answerYes) {
  if (!gameStarted) return

  if (answerYes) result += 2 ** current // 해당 비트의 가중치 더하기
  current++

  if (current < 5) {
    renderCard()
  } else {
    progressBar.style.width = '100%'
    stepLabel.textContent = `5 / 5`
    showResult()
  }
}

function showResult() {
  answerValue.textContent = String(result)
  yesBtn.disabled = true
  noBtn.disabled = true
  resultSection.classList.remove('hidden')
}

function showFinal(correct) {
  finalBox.textContent = correct
    ? '정답입니다. 멋집니다!'
    : '아쉽습니다. 다시 도전해보세요.'
  finalSection.classList.remove('hidden')
}

function resetGame() {
  // 본 게임만 초기화 (인트로로 돌아가진 않음)
  current = 0
  result = 0
  yesBtn.disabled = false
  noBtn.disabled = false
  resultSection.classList.add('hidden')
  finalSection.classList.add('hidden')
  progressBar.style.width = '0%'
  stepLabel.textContent = '1 / 5'
  renderCard()
}

function startGame() {
  // 인트로 → 게임 패널로 전환
  introSection.classList.add('fade-out')
  setTimeout(() => {
    introSection.classList.add('hidden')
    gamePanel.classList.remove('hidden')
    gamePanel.classList.add('fade-in')

    // 초기화 및 렌더
    cards = makeCards()
    current = 0
    result = 0
    gameStarted = true

    yesBtn.disabled = false
    noBtn.disabled = false
    progressBar.style.width = '0%'
    stepLabel.textContent = '1 / 5'

    renderCard()
    // 접근성: 시작 후 '있다' 버튼에 포커스
    yesBtn.focus()
  }, 600)
}

/* ------- Events ------- */
startBtn.addEventListener('click', startGame)
yesBtn.addEventListener('click', () => next(true))
noBtn.addEventListener('click', () => next(false))

correctBtn.addEventListener('click', () => showFinal(true))
wrongBtn.addEventListener('click', () => showFinal(false))
restartBtn.addEventListener('click', resetGame)

// 단축키: Enter=시작, Y/N=응답, R=다시하기
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase()

  // 아직 게임 시작 전
  if (!gameStarted) {
    if (key === 'enter') startGame()
    return
  }

  const resultOpen = !resultSection.classList.contains('hidden')
  const finalOpen = !finalSection.classList.contains('hidden')

  if (!resultOpen && !finalOpen) {
    if (key === 'y') next(true)
    else if (key === 'n') next(false)
  }

  if (key === 'r') resetGame()
})
