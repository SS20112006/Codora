import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TimerWorkerClient } from '../timerWorkerClient'
import { WorkerInMessage, WorkerOutMessage } from '../types'

describe('TimerWorkerClient', () => {
  let mockWorker: {
    postMessage: ReturnType<typeof vi.fn>
    terminate: ReturnType<typeof vi.fn>
    onmessage: ((event: MessageEvent<WorkerOutMessage>) => void) | null
  }

  beforeEach(() => {
    mockWorker = {
      postMessage: vi.fn(),
      terminate: vi.fn(),
      onmessage: null,
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes and sends START message to worker', () => {
    const client = new TimerWorkerClient(
      { focusDuration: 1500 },
      () => mockWorker as unknown as Worker
    )

    const subscriber = vi.fn()
    client.subscribe(subscriber)
    expect(subscriber).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'idle', timeLeft: 1500 })
    )

    client.start()

    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      type: 'START',
      duration: 1500,
    } satisfies WorkerInMessage)
    expect(subscriber).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'running' })
    )

    client.destroy()
    expect(mockWorker.terminate).toHaveBeenCalled()
  })

  it('handles TICK and COMPLETE incoming messages from worker', () => {
    const client = new TimerWorkerClient(
      { focusDuration: 1500, shortBreakDuration: 300 },
      () => mockWorker as unknown as Worker
    )

    const snapshots: string[] = []
    client.subscribe((s) => snapshots.push(`${s.status}:${s.timeLeft}`))

    client.start()

    // Simulate worker ticks
    mockWorker.onmessage?.({
      data: { type: 'TICK', timeLeft: 1490, elapsed: 10 },
    } as MessageEvent<WorkerOutMessage>)

    expect(client.getSnapshot().timeLeft).toBe(1490)

    // Simulate worker completion
    mockWorker.onmessage?.({
      data: { type: 'COMPLETE' },
    } as MessageEvent<WorkerOutMessage>)

    const finalSnap = client.getSnapshot()
    expect(finalSnap.status).toBe('completed')
    expect(finalSnap.mode).toBe('short_break')
    expect(finalSnap.timeLeft).toBe(300)
    expect(finalSnap.sessionsCompleted).toBe(1)

    client.destroy()
  })

  it('handles emergency pause and expiration messages from worker', () => {
    const client = new TimerWorkerClient(
      { emergencyDuration: 180 },
      () => mockWorker as unknown as Worker
    )

    client.start()
    client.startEmergencyPause()

    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      type: 'START_EMERGENCY',
      duration: 180,
    } satisfies WorkerInMessage)
    expect(client.getSnapshot().status).toBe('emergency_pause')

    // Simulate worker emergency expiration
    mockWorker.onmessage?.({
      data: { type: 'EMERGENCY_EXPIRED' },
    } as MessageEvent<WorkerOutMessage>)

    expect(client.getSnapshot().status).toBe('failed')

    client.destroy()
  })
})
