import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, useLocation } from "react-router-dom"
import "./index.css"
import App from "./App.tsx"
import { useThemeStore } from "./store/themeStore"

function ScrollToTopWrapper() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])
  return null
}

function Root() {
  const isDark = useThemeStore((s) => s.isDark)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.setAttribute("data-theme", "dark")
    } else {
      root.setAttribute("data-theme", "light")
    }
  }, [isDark])

  return <App/>
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTopWrapper/>
      <Root/>
    </BrowserRouter>
  </StrictMode>,
)