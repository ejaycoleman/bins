import 'mysql2/promise'
import { DataSource } from 'typeorm'
import entities from './entities'
import { subscribers } from './subscribers'

const {
	DB_HOST,
	DB_DATABASE,
	DB_USER,
	DB_PASSWORD,
	TE,
} = process.env
if (!DB_HOST) {
  throw new Error('no DB_HOST env var set')
}
if (!DB_USER) {
  throw new Error('no DB_USER env var set')
}
if (!DB_DATABASE) {
  throw new Error('no DB_DATABASE env var set')
}
const [host, port] = DB_HOST.split(':')

export const AppDataSource = new DataSource({
  type: 'mysql',
  synchronize: false,
  logging: false,

  host,
  port: parseInt(port, 10),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,

  entities,
	subscribers,
})

/* istanbul ignore next */
export const initializeDataSource = async () => {
	if (TE) {
		return new DataSource({
			type: 'sqlite',
			database: ':memory:',
			dropSchema: true,
			entities,
			subscribers,
			synchronize: true,
			logging: false
		})
	}

	const initialConnection = new DataSource({
		type: 'mysql',
		host,
		username: DB_USER,
		password: DB_PASSWORD,
	})

	await initialConnection.initialize()
	await initialConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_DATABASE}\`;`)
	
	await AppDataSource.initialize()
	await AppDataSource.synchronize(false)

	return AppDataSource
}
