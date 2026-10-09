import { PomodoroEngine } from './timerCore'
import {
  TimerConfig,
  TimerMode,
  TimerSnapshot,
  WorkerInMessage,
  WorkerOutMessage,
} from './types'

export type TimerEventListener = (snapshot: TimerSnapshot) => void

export class TimerWorkerClient {
  private engine: PomodoroEngine
  private worker: Worker | null = null
  private listeners: Set<TimerEventListener> = new Set()
  private fallbackIntervalId: ReturnType<typeof setInterval> | null = null
  private fallbackEmergencyId: ReturnType<typeof setInterval> | null = null
  private startTimestamp = 0
  private emergencyStartTimestamp = 0

  constructor(config?: Partial<TimerConfig>, workerFactory?: () => Worker) {
    this.engine = new PomodoroEngine(config)
    this.initWorker(workerFactory)
  }

  private initWorker(workerFactory?: () => Worker): void {
    try {
      if (workerFactory) {
        this.worker = workerFactory()
      } else if (typeof Worker !== 'undefined') {
        this.worker = new Worker(
          new URL('./timer.worker.ts', import.meta.url),
          { type: 'module' }
        )
      }

      if (this.worker) {
        this.worker.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
          this.handleWorkerMessage(event.data)
        }
      }
    } catch {
      // In environments where Worker is not supported (e.g. Node/jsdom without worker support),
      // we gracefully fall back to delta timestamp interval timer.
      this.worker = null
    }
  }

  private handleWorkerMessage(message: WorkerOutMessage): void {
    switch (message.type) {
      case 'TICK':
        this.engine.tick(message.timeLeft)
        this.notifyListeners()
        break
      case 'EMERGENCY_TICK':
        this.engine.tickEmergency(message.emergencyTimeLeft)
        this.notifyListeners()
        break
      case 'COMPLETE':
        this.engine.completeSession()
        this.notifyListeners()
        break
      case 'EMERGENCY_EXPIRED':
        this.engine.expireEmergency()
        this.notifyListeners()
        break
    }
  }

  private postToWorker(msg: WorkerInMessage): void {
    if (this.worker) {
      this.worker.postMessage(msg)
    } else {
      this.handleFallbackMessage(msg)
    }
  }

  private clearFallbackTimers(): void {
    if (this.fallbackIntervalId !== null) {
      clearInterval(this.fallbackIntervalId)
      this.fallbackIntervalId = null
    }
    if (this.fallbackEmergencyId !== null) {
      clearInterval(this.fallbackEmergencyId)
      this.fallbackEmergencyId = null
    }
  }

  private handleFallbackMessage(msg: WorkerInMessage): void {
    switch (msg.type) {
      case 'START':
      case 'RESUME': {
        this.clearFallbackTimers()
        const duration = msg.type === 'START' ? msg.duration : msg.timeLeft
        this.startTimestamp = performance.now()
        this.fallbackIntervalId = setInterval(() => {
          const elapsed = Math.floor((performance.now() - this.startTimestamp) / 1000)
          const timeLeft = Math.max(0, duration - elapsed)
          this.engine.tick(timeLeft)
          this.notifyListeners()
          if (timeLeft <= 0) {
            this.clearFallbackTimers()
          }
        }, 200)
        break
      }
      case 'START_EMERGENCY': {
        this.clearFallbackTimers()
        const duration = msg.duration
        this.emergencyStartTimestamp = performance.now()
        this.fallbackEmergencyId = setInterval(() => {
          const elapsed = Math.floor(
            (performance.now() - this.emergencyStartTimestamp) / 1000
          )
          const remaining = Math.max(0, duration - elapsed)
          this.engine.tickEmergency(remaining)
          this.notifyListeners()
          if (remaining <= 0) {
            this.clearFallbackTimers()
          }
        }, 200)
        break
      }
      case 'RESUME_FROM_EMERGENCY':
        if (this.fallbackEmergencyId !== null) {
          clearInterval(this.fallbackEmergencyId)
          this.fallbackEmergencyId = null
        }
        break
      case 'PAUSE':
      case 'STOP':
      case 'RESET':
        this.clearFallbackTimers()
        break
    }
  }

  public subscribe(listener: TimerEventListener): () => void {
    this.listeners.add(listener)
    listener(this.engine.getSnapshot())
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    const snapshot = this.engine.getSnapshot()
    for (const listener of this.listeners) {
      listener(snapshot)
    }
  }

  public getSnapshot(): TimerSnapshot {
    return this.engine.getSnapshot()
  }

  public start(): boolean {
    const ok = this.engine.start()
    if (ok) {
      this.postToWorker({
        type: 'START',
        duration: this.engine.getSnapshot().timeLeft,
      })
      this.notifyListeners()
    }
    return ok
  }

  public pause(): boolean {
    const wasRunning = this.engine.getSnapshot().status === 'running'
    const ok = this.engine.pause()
    if (ok && wasRunning) {
      const snap = this.engine.getSnapshot()
      if (snap.status === 'paused') {
        this.postToWorker({ type: 'PAUSE' })
      } else if (snap.status === 'emergency_pause') {
        this.postToWorker({
          type: 'START_EMERGENCY',
          duration: snap.emergencyDuration,
        })
      }
      this.notifyListeners()
    }
    return ok
  }

  public resume(): boolean {
    const snap = this.engine.getSnapshot()
    if (snap.status === 'paused') {
      const ok = this.engine.resume()
      if (ok) {
        this.postToWorker({
          type: 'RESUME',
          timeLeft: this.engine.getSnapshot().timeLeft,
        })
        this.notifyListeners()
      }
      return ok
    }

    if (snap.status === 'emergency_pause') {
      const ok = this.engine.resumeFromEmergency()
      if (ok) {
        this.postToWorker({ type: 'RESUME_FROM_EMERGENCY' })
        this.postToWorker({
          type: 'RESUME',
          timeLeft: this.engine.getSnapshot().timeLeft,
        })
        this.notifyListeners()
      }
      return ok
    }

    return false
  }

  public startEmergencyPause(): boolean {
    const ok = this.engine.startEmergencyPause()
    if (ok) {
      this.postToWorker({
        type: 'START_EMERGENCY',
        duration: this.engine.getSnapshot().emergencyDuration,
      })
      this.notifyListeners()
    }
    return ok
  }

  public reset(): void {
    this.engine.reset()
    this.postToWorker({
      type: 'RESET',
      duration: this.engine.getSnapshot().timeLeft,
    })
    this.notifyListeners()
  }

  public abandon(): void {
    this.engine.abandon()
    this.postToWorker({ type: 'STOP' })
    this.notifyListeners()
  }

  public setMode(mode: TimerMode): void {
    this.engine.setMode(mode)
    this.postToWorker({ type: 'STOP' })
    this.notifyListeners()
  }

  public updateConfig(config: Partial<TimerConfig>): void {
    this.engine.updateConfig(config)
    this.notifyListeners()
  }

  public destroy(): void {
    this.clearFallbackTimers()
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.listeners.clear()
  }
}
