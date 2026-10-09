/// <reference lib="webworker" />

import { WorkerInMessage, WorkerOutMessage } from './types'

let activeIntervalId: ReturnType<typeof setInterval> | null = null
let emergencyIntervalId: ReturnType<typeof setInterval> | null = null

let sessionStartTimestamp = 0
let sessionTotalDuration = 0

let emergencyStartTimestamp = 0
let emergencyTotalDuration = 0

function clearIntervals(): void {
  if (activeIntervalId !== null) {
    clearInterval(activeIntervalId)
    activeIntervalId = null
  }
  if (emergencyIntervalId !== null) {
    clearInterval(emergencyIntervalId)
    emergencyIntervalId = null
  }
}

function handleStart(duration: number, intervalMs = 200): void {
  clearIntervals()
  sessionStartTimestamp = performance.now()
  sessionTotalDuration = duration

  let lastReportedTimeLeft = duration

  // Immediate initial tick
  const initialMsg: WorkerOutMessage = {
    type: 'TICK',
    timeLeft: duration,
    elapsed: 0,
  }
  self.postMessage(initialMsg)

  activeIntervalId = setInterval(() => {
    const now = performance.now()
    const elapsedSeconds = Math.floor((now - sessionStartTimestamp) / 1000)
    const timeLeft = Math.max(0, sessionTotalDuration - elapsedSeconds)

    // Only post message if time changed or completed to minimize postMessage overhead
    if (timeLeft !== lastReportedTimeLeft || timeLeft === 0) {
      lastReportedTimeLeft = timeLeft
      const tickMsg: WorkerOutMessage = {
        type: 'TICK',
        timeLeft,
        elapsed: elapsedSeconds,
      }
      self.postMessage(tickMsg)
    }

    if (timeLeft <= 0) {
      clearIntervals()
      const completeMsg: WorkerOutMessage = { type: 'COMPLETE' }
      self.postMessage(completeMsg)
    }
  }, intervalMs)
}

function handleStartEmergency(duration: number, intervalMs = 200): void {
  // Clear any ticking session interval while emergency pause is running
  if (activeIntervalId !== null) {
    clearInterval(activeIntervalId)
    activeIntervalId = null
  }
  if (emergencyIntervalId !== null) {
    clearInterval(emergencyIntervalId)
    emergencyIntervalId = null
  }

  emergencyStartTimestamp = performance.now()
  emergencyTotalDuration = duration
  let lastReportedEmergency = duration

  const initialMsg: WorkerOutMessage = {
    type: 'EMERGENCY_TICK',
    emergencyTimeLeft: duration,
    elapsed: 0,
  }
  self.postMessage(initialMsg)

  emergencyIntervalId = setInterval(() => {
    const now = performance.now()
    const elapsedSeconds = Math.floor((now - emergencyStartTimestamp) / 1000)
    const emergencyTimeLeft = Math.max(0, emergencyTotalDuration - elapsedSeconds)

    if (emergencyTimeLeft !== lastReportedEmergency || emergencyTimeLeft === 0) {
      lastReportedEmergency = emergencyTimeLeft
      const tickMsg: WorkerOutMessage = {
        type: 'EMERGENCY_TICK',
        emergencyTimeLeft,
        elapsed: elapsedSeconds,
      }
      self.postMessage(tickMsg)
    }

    if (emergencyTimeLeft <= 0) {
      clearIntervals()
      const expiredMsg: WorkerOutMessage = { type: 'EMERGENCY_EXPIRED' }
      self.postMessage(expiredMsg)
    }
  }, intervalMs)
}

self.onmessage = (event: MessageEvent<WorkerInMessage>) => {
  const message = event.data

  switch (message.type) {
    case 'START':
      handleStart(message.duration, message.intervalMs)
      break

    case 'PAUSE':
      clearIntervals()
      break

    case 'RESUME':
      handleStart(message.timeLeft)
      break

    case 'START_EMERGENCY':
      handleStartEmergency(message.duration)
      break

    case 'RESUME_FROM_EMERGENCY':
      if (emergencyIntervalId !== null) {
        clearInterval(emergencyIntervalId)
        emergencyIntervalId = null
      }
      break

    case 'STOP':
    case 'RESET':
      clearIntervals()
      break
  }
}
