import{Pool} from 'pg'

const pool=new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo_db',
    password: '10809',
    port: 5432,
})

export default pool