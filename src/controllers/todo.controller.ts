import { Request, Response } from 'express'
import pool from '../db'

export const getTodos = async (req: Request, res: Response) => {
  res.json([
    { id: 1, title: 'Test Todo', completed: false }
  ])
}

export const getTodoById = async (req: Request, res: Response) => {
  const { id } = req.params
  res.json({ id, title: 'Single Todo', completed: false })
}

export const createTodo = async (req: Request, res: Response) => {
  const { title } = req.body
  res.status(201).json({ id: 2, title, completed: false })
}

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params
  res.json({ id, completed: true })
}

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params
  res.status(204).send()
}
