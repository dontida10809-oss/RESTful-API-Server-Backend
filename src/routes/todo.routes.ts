import { Router } from 'express'
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  patchTodo,
  deleteTodo
} from '../controllers/todo.controller'

const router = Router()

router.get('/', getTodos)
router.get('/:id', getTodoById)
router.post('/', createTodo)
router.put('/:id', updateTodo)
router.patch('/:id', updateTodo)
router.patch('/:id', patchTodo)
router.delete('/:id', deleteTodo)

export default router
