import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { differenceInSeconds } from 'date-fns'
import { CycleInterface, cyclesReducer } from '../reducers/cycles/reducer'
import {
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
  amountSecondsPassed: number
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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedCyclesAsJSON = localStorage.getItem('@igniteTimer:cycles')

      if (storedCyclesAsJSON) {
        return JSON.parse(storedCyclesAsJSON)
      }

      return {
        cycles: [],
        activeCycleId: null,
      }
    },
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startedAt))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@igniteTimer:cycles', stateJSON)
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
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

    setAmountSecondsPassed(0)
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
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
