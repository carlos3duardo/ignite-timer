import { ActionTypes } from './actions'

export interface CycleInterface {
  id: string
  task: string
  minutesAmount: number
  startedAt: Date
  finishedAt?: Date
  interruptedAt?: Date
}

interface CyclesStateProps {
  cycles: CycleInterface[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesStateProps, action: any) {
  switch (action.type) {
    case ActionTypes.CREATE_NEW_CYCLE:
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }
    case ActionTypes.INTERRUPT_CURRENT_CYCLE:
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
    case ActionTypes.FINISH_CURRENT_CYCLE:
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
}
