import { useMemo } from 'react'
import { useAppSelector } from '../store/hooks'
import { selectAll } from '../features/user/todoTasksSlice'
import { TaskTodoCompleteStatus } from '../types/entities'
function useTodoTasksGroup() {
  const todoTasks = useAppSelector(selectAll)
  const todoItems = useMemo(() => todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.TODO), [todoTasks])
  const inProgressItems = useMemo(
    () => todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.IN_PRGRESS),
    [todoTasks],
  )
  const completedItems = useMemo(
    () => todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.COMPLETED),
    [todoTasks],
  )
  const wonItems = useMemo(() => todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.WON), [todoTasks])
  const lostItems = useMemo(() => todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.LOST), [todoTasks])
  const closedItems = useMemo(
    () => todoTasks.filter((task) => task.status === TaskTodoCompleteStatus.CLOSED),
    [todoTasks],
  )

  return { todoItems, inProgressItems, completedItems, wonItems, lostItems, closedItems }
}

export default useTodoTasksGroup
