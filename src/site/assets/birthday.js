export function triggerBirthday() {
  const brickSrc = 'https://raw.githubusercontent.com/redbrick/design-system/main/assets/logos/redbrick.svg'
  
  // Generate falling bricks
  let bricks = ''
  for (let i = 0; i < 30; i++) {
    const left = Math.random() * 100
    const duration = 15 + Math.random() * 20
    const delay = Math.random() * -30
    const size = 30 + Math.random() * 40
    bricks += `<img src="${brickSrc}" style="
      position: absolute;
      top: -100px;
      left: ${left}vw;
      width: ${size}px;
      animation: fall ${duration}s linear ${delay}s infinite;
    " />`
  }

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
    </style>
    <div style="position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 2;">
      ${bricks}
    </div>
    <div style="position: relative; z-index: 1; display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #000000 0%, #cc0000 100%);">
      <h1 style="font-size: 4rem; color: white; text-align: center; font-family: system-ui, sans-serif; animation: wiggle 0.5s ease-in-out infinite;">
        🎂 Happy 30th Birthday Redbrick! 🎉
      </h1>
    </div>
  `
}
