import { readFileSync } from 'fs';
import { Pool } from 'pg';
import logger from 'debug';
import Config from '../config';
import { NullError, SQLExecError } from '../errors/error';

export default class Model {
  constructor(table) {
    this.table = table;
    this.pool = Model.initConn();
    this.debug = logger(`stackoverflow-api-node:${__filename.split(/[\\/]/).pop()}`);
    if (!table) {
      throw new NullError('Table name must be defined');
    }

    this.pool.on('error', (err) => {
      this.debug('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  execSQL(sql) {
    /**
     * Executes sql statements and runs result in callback function
     */
    return new Promise(((resolve, reject) => {
      this.pool.query(sql)
        .then((res) => {
          this.debug(`execSQL - Client response after executing SQL: ${res.rows}`);
          this.debug(sql);
          resolve(res);
        })
        .catch(err => setImmediate(() => { reject(new SQLExecError(`execSQL - An error occurred: ${err}`)); }));
    }));
  }

  bootstrapTables() {
    /**
     * Sets up the tables up in the database
     */
    const tableSQL = readFileSync('models/sql/tables.sql', 'utf8');
    return this.execSQL(tableSQL);
  }

  static initConn() {
    /**
     * This instantiates the database connection to the db
     */
    return new Pool({ connectionString: Config('development').DATABASE_URI });
    // return new Pool({ connectionString: Config(process.env.NODE_ENV).DATABASE_URI });
  }

  selectAll(fields) {
    this.debug(`selectAll - Selecting all fields in ${this.table}`);
    const sql = `SELECT ${fields.join(',')} from ${this.table}`;
    return new Promise((resolve) => {
      this.execSQL(sql).then(resp => resolve(resp));
    });
  }

  selectWithConstraints(fields, constraints) {
    this.debug(`selectWithConstraints - Selecting fields ${fields} from table ${this.table} with constraints: ${constraints.toString()}`);
    if (!constraints) {
      return this.selectAll(fields);
    }
    const sql = `SELECT ${fields.join(',')} FROM ${this.table} WHERE ${Model.parseToSQLFormat(constraints, ' AND ')}`;
    this.debug(sql);
    return new Promise(resolve => this.execSQL(sql).then(resp => resolve(resp)));
  }

  selectOne(fields, constraints) {
    this.debug(`selectOne - Selecting fields ${fields} from table ${this.table} with constraints: ${constraints.toString()}`);
    const sql = `SELECT ${fields.join(',')} FROM ${this.table} WHERE ${Model.parseToSQLFormat(constraints, ' AND ')} LIMIT 1`;
    this.debug(sql);
    return new Promise(resolve => this.execSQL(sql).then(resp => resolve(resp)));
  }

  delete(constraints) {
    this.debug(`delete - Deleting fields from table ${this.table} with constraints: ${constraints.toString()}`);
    const sql = `DELETE FROM ${this.table} WHERE ${Model.parseToSQLFormat(constraints, ' AND ')}`;
    this.debug(sql);
    return new Promise(resolve => this.execSQL(sql).then(resp => resolve(resp)));
  }

  insert(constraints, fields) {
    this.debug(`insert - Inserting into table ${this.table} with constraints ${constraints.toString()} and returning fields ${fields}`);
    const sql = `INSERT INTO ${this.table} (${Object.keys(constraints).join(',')}) VALUES(${Object.values(constraints).map(x => `'${x}'`).join(',')})`;
    this.debug(sql);
    const self = this;
    return new Promise(resolve => this.execSQL(sql).then(() => {
      this.execSQL(sql).then(() => {
        self.selectOne(fields, constraints).then(resp => resolve(resp));
      });
    }));
  }

  update(updateFields, constraints, fields) {
    this.debug(`update - Inserting into table ${this.table} with constraints ${constraints.toString()} and returning fields ${fields}`);
    const sql = `UPDATE ${this.table} SET  ${Model.parseToSQLFormat(updateFields)} WHERE ${Model.parseToSQLFormat(constraints, ',')}`;
    this.debug(sql);
    const self = this;
    return new Promise((resolve) => {
      this.execSQL(sql).then(() => {
        this.execSQL(sql).then(() => {
          self.selectOne(fields, updateFields).then(resp => resolve(resp));
        });
      });
    });
  }

  static handleResponse(resp) {
    console.log(resp.rows);
  }

  static parseToSQLFormat(object, delimiter) {
    return Object.keys(object).map(key => `${key}='${object[key]}'`).join(delimiter);
  }
}

// new Model('users').update({ name: 'Bakare Emmanuel', username: 'Tiemma', password: 'blank' },
// { name: 'Bakare b' }, ['name'], Model.handleResponse);
