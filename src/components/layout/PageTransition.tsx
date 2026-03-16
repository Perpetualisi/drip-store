import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear any pending timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Start exit phase
    setPhase("exit")

    timeoutRef.current = setTimeout(() => {
      // Swap content and start enter phase
      setDisplayChildren(children)
      setPhase("enter")

      timeoutRef.current = setTimeout(() => {
        setPhase("idle")
      }, 300)
    }, 180)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [location.pathname])

  const styles: Record<string, React.CSSProperties> = {
    idle: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
    exit: {
      opacity: 0,
      transform: "translateY(6px)",
      transition: "opacity 0.18s ease, transform 0.18s ease",
    },
    enter: {
      opacity: 0,
      transform: "translateY(-8px)",
      transition: "none",
    },
  }

  return (
    <div style={styles[phase]}>
      {displayChildren}
    </div>
  )
}