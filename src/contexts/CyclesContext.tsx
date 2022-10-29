import { createContext, ReactNode, useReducer, useState } from 'react'
import { CycleInterface, cyclesReducer } from '../reducers/cycles/reducer'
import {
  ActionTypes,
  createNewCycleAction,
  finishCurrentCycleAction,
  interruptCurrentCycleAction,
} from '../reducers/cycles/actions'

interface CreateCycleInterface {
  task: string
  minutesAmount: number
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
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const [amountSecondsaPassed, setAmountSecondsaPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsaPassed(seconds)
  }

  function finishCurrentCycle() {
    dispatch(finishCurrentCycleAction())
  }

  function createNewCycle(data: CreateCycleInterface) {
    const newCycleId = String(new Date().getTime())

    const newCycle: CycleInterface = {
      id: newCycleId,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startedAt: new Date(),
    }

    dispatch(createNewCycleAction(newCycle))

    setAmountSecondsaPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
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
