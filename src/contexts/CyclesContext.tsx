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

interface CyclesStateProps {
  cycles: CycleInterface[]
  activeCycleId: string | null
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderInterface) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesStateProps, action: any) => {
      switch (action.type) {
        case 'CREATE_NEW_CYCLE':
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          }
        case 'INTERRUPT_CURRENT_CYCLE':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interruptedAt: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
        case 'FINISH_CURRENT_CYCLE':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, finishedAt: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
        default:
          return state
      }
    },
    {
      cycles: [],
      activeCycleId: null,
    },
  )

  const [amountSecondsaPassed, setAmountSecondsaPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

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

    setAmountSecondsaPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
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
