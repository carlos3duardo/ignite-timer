import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'

import {
  CountdownButton,
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  TaskInput,
} from './styles'
import { useState, useEffect } from 'react'

const formValidationRules = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo não pode ser menor que 5 minutos')
    .max(60, 'O ciclo não pode ser maior de 60 minutos'),
})

type NewCycleInterface = zod.infer<typeof formValidationRules>

interface CycleInterface {
  id: string
  task: string
  minutesAmount: number
  startedAt: Date
}

export function Home() {
  const [cycles, setCycles] = useState<CycleInterface[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsaPassed, setAmountSecondsaPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleInterface>({
    resolver: zodResolver(formValidationRules),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  useEffect(() => {
    if (activeCycle) {
      setInterval(() => {
        setAmountSecondsaPassed(
          differenceInSeconds(new Date(), activeCycle.startedAt),
        )
      }, 1000)
    }
  }, [activeCycle])

  function handleCreateNewCycle(data: NewCycleInterface) {
    const newCycleId = String(new Date().getTime())

    const newCycle: CycleInterface = {
      id: newCycleId,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startedAt: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycleId)

    reset()
  }

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsaPassed : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Cevadis im ampola pa arma uma pindureta" />
            <option value="In elementis mé pra quem é amistosis quis leo" />
            <option value="Viva Forevis aptent taciti sociosqu ad litora torquent" />
            <option value="Suco de cevadiss eh leite divinis qui tem lupuliz matis aguis e fermentis" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <CountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Começar
        </CountdownButton>
      </form>
    </HomeContainer>
  )
}
