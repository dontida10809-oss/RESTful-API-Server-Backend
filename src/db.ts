import{Pool} from 'pg'

const pool=new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: 'password',
    port: 5432,
})

export default pool