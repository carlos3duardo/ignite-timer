import { createContext, ReactNode, useReducer, useState } from 'react'

interface CreateCycleInterface {
  task: string
  minutesAmount: number
}

interface CycleInterface {
  id: string
  task: string
  minutesAmount: number
  startedAt: Date
  finishedAt?: Date
  interruptedAt?: Date
}

interface CyclesContextInterface {
  cycles: CycleInterface[]
  activeCycle: CycleInterface | undefined
  activeCycleId: string | null
  amountSecondsaPassed: number
  finishCurrentCycle: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleInterface) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextInterface)

interface CyclesContextProviderInterface {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderInterface) {
  // const [cycles, setCycles] = useState<CycleInterface[]>([])
  const [cycles, dispatch] = useReducer(
    (state: CycleInterface[], action: any) => {
      if (action.type === 'CREATE_NEW_CYCLE') {
        return [...state, action.payload.newCycle]
      }
      return state
    },
    [],
  )

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsaPassed, setAmountSecondsaPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsaPassed(seconds)
  }

  function finishCurrentCycle() {
    dispatch({
      type: 'FINISH_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedAt: new Date() }
    //     }

    //     return cycle
    //   }),
    // )
    setActiveCycleId(null)
  }

  function createNewCycle(data: CreateCycleInterface) {
    const newCycleId = String(new Date().getTime())

    const newCycle: CycleInterface = {
      id: newCycleId,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startedAt: new Date(),
    }

    dispatch({
      type: 'CREATE_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })

    // setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycleId)
    setAmountSecondsaPassed(0)
  }

  function interruptCurrentCycle() {
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedAt: new Date() }
    //     }

    //     return cycle
    //   }),
    // )
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })

    setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        finishCurrentCycle,
        amountSecondsaPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
