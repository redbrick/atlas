const ASSETS = {
  brickImageSrc: 'https://raw.githubusercontent.com/redbrick/design-system/main/assets/logos/redbrick.svg',
  boomImageSrc: '/assets/boom.svg',
  boomSoundSrc: '/assets/boom.wav',
  winSoundSrc: '/assets/win.wav'
}

const preloadedBrickImage = new Image()
preloadedBrickImage.src = ASSETS.brickImageSrc
preloadedBrickImage.decoding = 'async'

const preloadedBoomImage = new Image()
preloadedBoomImage.src = ASSETS.boomImageSrc
preloadedBoomImage.decoding = 'async'

const preloadedBoomAudio = new Audio(ASSETS.boomSoundSrc)
preloadedBoomAudio.preload = 'auto'
preloadedBoomAudio.load()

const preloadedWinAudio = new Audio(ASSETS.winSoundSrc)
preloadedWinAudio.preload = 'auto'
preloadedWinAudio.load()

function gameStart() {
  const gameDuration = 30
  let timeLeft = gameDuration
  const winAudio = preloadedWinAudio.cloneNode(true)
  const isMobile = window.matchMedia('(max-width: 640px)').matches

  const bar = document.createElement('div')
  bar.id = 'score-bar'
  bar.className = 'fixed bottom-0 left-0 z-[1000] flex h-[44px] w-full items-center justify-between gap-2 bg-black/50 px-2 pb-[env(safe-area-inset-bottom)] text-sm text-white sm:text-lg md:h-[50px] md:px-4 md:text-2xl'

  const scoreLabel = document.createElement('div')
  scoreLabel.id = 'score-value'
  scoreLabel.className = 'min-w-0 font-semibold tracking-wide'
  scoreLabel.textContent = 'Score: 1'

  const timerLabel = document.createElement('div')
  timerLabel.id = 'timer-value'
  timerLabel.className = 'min-w-0 truncate text-right font-semibold tracking-wide'
  timerLabel.textContent = isMobile ? 'Tap bricks fast!' : 'Click as many bricks as you can!!!'

  bar.appendChild(scoreLabel)
  bar.appendChild(timerLabel)
  document.body.appendChild(bar)

  const birthdayLabel = document.getElementById("birthday-message")
  birthdayLabel.textContent = `${timeLeft}s`

  const handleScore = (e) => {
    const score = e.detail.score
    scoreLabel.textContent = `Score: ${score}`
    updateBrickSpeed(timeLeft, gameDuration, score)
  }

  document.addEventListener('birthdayScore', handleScore)
  
  updateBrickSpeed(timeLeft, gameDuration, getCurrentScore())

  const countdown = setInterval(() => {
    timeLeft -= 1
    birthdayLabel.textContent = `${timeLeft}s`
    updateBrickSpeed(timeLeft, gameDuration, getCurrentScore())
    if (timeLeft <= 0) {
      clearInterval(countdown)
      document.removeEventListener('birthdayScore', handleScore)
      timerLabel.textContent = 'Time: 0s'
      scoreLabel.textContent = `Game Over! Final Score: ${scoreLabel.textContent.replace(/\D/g, '')}`
      birthdayLabel.textContent = '🎂 Happy 30th Birthday Redbrick! 🎉'
      winAudio.play()
      updateBrickSpeed(gameDuration, gameDuration, 0) // reset speed to normal
    }
  }, 1000)
}

function updateBrickSpeed(timeLeft, gameDuration, score = 0) {
  const elapsedRatio = Math.min(1, Math.max(0, (gameDuration - timeLeft) / gameDuration))
  const scoreBoost = Math.min(5, score * 0.36)
  const speedMultiplier = 1 + (elapsedRatio * 1.8) + scoreBoost // time + score scaling

  document.querySelectorAll('.birthday-brick').forEach((brick) => {
    const animation = brick.getAnimations().find((anim) => {
      return anim instanceof CSSAnimation && anim.animationName === 'fall'
    })

    if (animation) {
      animation.playbackRate = speedMultiplier
    }
  })
}

function createStackedAudioPlayer(baseAudio) {
  const activeSounds = new Set()

  return () => {
    const instance = baseAudio.cloneNode(true)
    activeSounds.add(instance)

    instance.addEventListener('ended', () => {
      activeSounds.delete(instance)
    }, { once: true })

    instance.play().catch(() => {
      activeSounds.delete(instance)
    })
  }
}

function getCurrentScore() {
  const scoreEl = document.getElementById('score-value')
  if (!scoreEl) return 0

  return Number(scoreEl.innerText.replace(/\D/g, '')) || 0
}

function createBoomFx(boomImageTemplate, rect) {
  const boomFx = document.createElement('div')
  boomFx.className = 'fixed z-[9999] -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none'
  boomFx.style.left = `${rect.left + rect.width / 2}px`
  boomFx.style.top = `${rect.top + rect.height / 2}px`

  const boomSize = Math.max(90, rect.width * 2)
  boomFx.style.width = `${boomSize}px`
  boomFx.style.height = `${boomSize}px`

  const boomImg = boomImageTemplate.cloneNode(false)
  boomImg.alt = ''
  boomImg.className = 'block h-full w-full select-none'
  boomImg.draggable = false
  boomFx.appendChild(boomImg)

  return boomFx
}

function generateBricksMarkup(brickSrc, count = 30, isMobile = false) {
  let bricks = ''

  for (let i = 0; i < count; i++) {
    const left = Math.random() * 100
    const duration = 15 + Math.random() * 20
    const delay = Math.random() * -30
    const minSize = isMobile ? 44 : 30
    const sizeRange = isMobile ? 34 : 40
    const size = minSize + Math.random() * sizeRange

    bricks += '<img class="birthday-brick absolute -top-[100px] cursor-pointer pointer-events-auto" ' +
      'src="' + brickSrc + '" data-base-duration="' + duration.toFixed(2) + '" style="' +
      'left: ' + left + 'vw;' +
      'width: ' + size + 'px;' +
      'animation: fall ' + duration + 's linear ' + delay + 's infinite;' +
      '" />'
  }

  return bricks
}


export function triggerBirthday() {
  const brickSrc = ASSETS.brickImageSrc
  const isMobile = window.matchMedia('(max-width: 640px)').matches
  const brickCount = isMobile ? 20 : 30
  let triggeredGame = false
  const playBoom = createStackedAudioPlayer(preloadedBoomAudio)

  const bricks = generateBricksMarkup(brickSrc, brickCount, isMobile)

  document.body.innerHTML = `
    <style>
      @keyframes wiggle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      @keyframes fall {
        from { transform: translateY(0); }
        to { transform: translateY(110vh); }
      }
      html, body {
        touch-action: manipulation;
        overscroll-behavior: none;
      }
      .birthday-brick {
        user-select: none;
        touch-action: manipulation;
        -webkit-user-drag: none;
      }

      .birthday-brick.popped {
        opacity: 0;
        pointer-events: none;
        pointer-cursor: default;
        user-select: none;
      }
    </style>
    <div id="birthday-brick-layer" class="fixed inset-0 z-[2] overflow-hidden">
      ${bricks}
    </div>
    <div class="relative z-[1] flex h-[100dvh] items-center justify-center bg-gradient-to-br from-black to-red-700">
      <h1 class="animate-[wiggle_0.5s_ease-in-out_infinite] px-4 text-center text-3xl font-black text-white sm:px-6 sm:text-5xl md:text-6xl" id="birthday-message">
        🎂 Happy 30th Birthday Redbrick! 🎉
      </h1>
    </div>
  `


  const brickLayer = document.getElementById('birthday-brick-layer')

  brickLayer?.addEventListener('animationiteration', (event) => {
    const brick = event.target.closest('.birthday-brick')
    if (!brick) return

    // Brick reached top again; make it visible/clickable for next fall
    brick.classList.remove('popped')
  })

  brickLayer?.addEventListener('pointerdown', (event) => {
    const brick = event.target.closest('.birthday-brick')
    if (!brick || brick.classList.contains("popped")) return
    event.preventDefault()

    if (!triggeredGame) {
      triggeredGame = true
      gameStart()
    }
    else {
      // update score with custom event so it can be tracked in analytics
      const count = getCurrentScore() + 1
      const scoreEvent = new CustomEvent('birthdayScore', { detail: { score: count } })
      document.dispatchEvent(scoreEvent)
    }
    playBoom()

    const rect = brick.getBoundingClientRect()
    brick.classList.add('popped')

    const boomFx = createBoomFx(preloadedBoomImage, rect)

    // append to body so it is not clipped by brick layer overflow
    document.body.appendChild(boomFx)

    setTimeout(() => boomFx.remove(), 250)
  })
}
