import { Request, Response } from 'express'
import pool from '../db'

export const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}


export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await pool.query(
        'SELECT * FROM todos WHERE id = $1',
        [id]

    )

    if (result.rows.length === 0) {
        return res.status(404).json({message: 'Todo not found'})
    }
    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Server error'})
  }
  
}

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title } = req.body

    // ป้องกัน title ว่าง
    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const result = await pool.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}


export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    let { title, completed } = req.body

    // แปลง completed ให้เป็น boolean ถ้ามีส่งมา
    if (completed !== undefined) {
      completed = completed === true || completed === 'true'
    }

    const result = await pool.query(
      `
      UPDATE todos
      SET
        title = COALESCE($1, title),
        completed = COALESCE($2, completed)
      WHERE id = $3
      RETURNING *
      `,
      [title, completed, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('UPDATE TODO ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}


export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found' })
    }

    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

