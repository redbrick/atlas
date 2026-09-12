document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre > code").forEach((code) => {
    const pre = code.parentElement

    if (pre.querySelector(".copy-code-button")) return

    const button = document.createElement("button")
    button.type = "button"
    button.className = "copy-code-button"
    button.setAttribute("aria-label", "Copy code to clipboard")

    const copyIcon = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2v-2h2V5h-9v2H8Zm-3 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Zm0 2v9h9v-9H5Z"/>
      </svg>
    `

    const checkIcon = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9.55 18.2-5.7-5.7 1.4-1.4 4.3 4.3 9.2-9.2 1.4 1.4-10.6 10.6Z"/>
      </svg>
    `

    const showCopy = () => {
      button.innerHTML = `${copyIcon}<span>Copy</span>`
      button.classList.remove("copied")
    }

    showCopy()

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(
          code.textContent.replace(/\n$/, "")
        )

        button.innerHTML = `${checkIcon}<span>Copied</span>`
        button.classList.add("copied")

        setTimeout(showCopy, 2000)
      } catch (error) {
        console.error("Failed to copy code:", error)
      }
    })

    pre.appendChild(button)
  })
})