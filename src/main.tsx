import { StrictMode, useEffect } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, useLocation } from "react-router-dom"
import App from "./App"
import "./index.css"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pathname])

  return null
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>
)