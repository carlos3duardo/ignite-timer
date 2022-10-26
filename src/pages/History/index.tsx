import { useContext } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { CyclesContext } from '../../contexts/CyclesContext'
import { HistoryContainer, HistoryList, TaskStatus } from './styles'

export function History() {
  const { cycles } = useContext(CyclesContext)

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map(
              ({
                id,
                task,
                minutesAmount,
                startedAt,
                finishedAt,
                interruptedAt,
              }) => {
                return (
                  <tr key={id}>
                    <td>{task}</td>
                    <td>{minutesAmount} minutos</td>
                    <td>
                      <span title={format(startedAt, 'dd/MM/yyyy HH:mm:ss')}>
                        {formatDistanceToNow(startedAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </td>
                    <td>
                      {finishedAt && (
                        <TaskStatus statusColor="green">Concluído</TaskStatus>
                      )}

                      {interruptedAt && (
                        <TaskStatus statusColor="red">Interrompido</TaskStatus>
                      )}

                      {!finishedAt && !interruptedAt && (
                        <TaskStatus statusColor="yellow">
                          Em andamento
                        </TaskStatus>
                      )}
                    </td>
                  </tr>
                )
              },
            )}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
