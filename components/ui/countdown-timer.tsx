"use client"

import { useState, useEffect } from "react"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

type CountdownStatus = "beforeOpen" | "open" | "closed"

type CountdownResult = {
  status: CountdownStatus
  timeLeft: TimeLeft | null
  message: string
}

const calculateTimeLeft = (openDateStr: string, closeDateStr: string): CountdownResult => {
  const now = new Date()
  const openDate = new Date(openDateStr)
  const closeDate = new Date(closeDateStr)

  if (now < openDate) {
    const difference = +openDate - +now
    return {
      status: "beforeOpen",
      timeLeft: {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      },
      message: "Pendaftaran Akan Dibuka Dalam",
    }
  } else if (now >= openDate && now < closeDate) {
    const difference = +closeDate - +now
    return {
      status: "open",
      timeLeft: {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)), // Days remaining for the open period
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      },
      message: "Pendaftaran Akan Ditutup Dalam",
    }
  } else {
    // now >= closeDate
    return {
      status: "closed",
      timeLeft: null,
      message: "Pendaftaran Telah Ditutup",
    }
  }
}

const CountdownCircle = ({ value, maxValue, unit }: { value: number; maxValue: number; unit: string }) => {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  // Ensure progress is not NaN and is between 0 and 1
  const progress = maxValue > 0 ? value / maxValue : 0
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center justify-center rounded-full bg-card/50 backdrop-blur-sm border border-white/10 shadow-md w-28 h-28 relative">
      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="4"
          fill="transparent"
          className="opacity-20"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-primary tabular-nums">{String(value).padStart(2, "0")}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{unit}</div>
      </div>
    </div>
  )
}

interface CountdownTimerProps {
  registrationOpenDate: string
  registrationCloseDate: string
}

const CountdownTimer = ({ registrationOpenDate, registrationCloseDate }: CountdownTimerProps) => {
  const [countdownResult, setCountdownResult] = useState<CountdownResult | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    setCountdownResult(calculateTimeLeft(registrationOpenDate, registrationCloseDate))

    const timer = setInterval(() => {
      setCountdownResult(calculateTimeLeft(registrationOpenDate, registrationCloseDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [registrationOpenDate, registrationCloseDate, isClient])

  if (!isClient || !countdownResult) {
    // Render placeholder or loading state if not client or result not ready
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 justify-items-center">
        <CountdownCircle value={0} maxValue={365} unit="Days" />
        <CountdownCircle value={0} maxValue={24} unit="Hours" />
        <CountdownCircle value={0} maxValue={60} unit="Minutes" />
        <CountdownCircle value={0} maxValue={60} unit="Seconds" />
      </div>
    )
  }

  if (countdownResult.status === "closed") {
    return (
      <div className="text-center text-4xl font-bold text-primary uppercase tracking-wider">
        {countdownResult.message}
      </div>
    )
  }

  return (
    <>
      {/* Only show the message if the status is "open" (i.e., counting down to close) */}
      {countdownResult.status === "open" && (
        <div className="text-center text-xl font-semibold text-foreground/80 mb-4">{countdownResult.message}</div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 justify-items-center">
        <CountdownCircle value={countdownResult.timeLeft?.days || 0} maxValue={365} unit="Days" />
        <CountdownCircle value={countdownResult.timeLeft?.hours || 0} maxValue={24} unit="Hours" />
        <CountdownCircle value={countdownResult.timeLeft?.minutes || 0} maxValue={60} unit="Minutes" />
        <CountdownCircle value={countdownResult.timeLeft?.seconds || 0} maxValue={60} unit="Seconds" />
      </div>
    </>
  )
}

export default CountdownTimer
