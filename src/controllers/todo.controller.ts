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
    res.status(500).json({ message: 'Server error' })
  }
}

export const patchTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { completed } = req.body

    if (completed === undefined) {
      return res.status(400).json({ message: 'Nothing to update' })
    }

    const result = await pool.query(
      `
      UPDATE todos
      SET completed = $1
      WHERE id = $2
      RETURNING *
      `,
      [completed, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Todo not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


