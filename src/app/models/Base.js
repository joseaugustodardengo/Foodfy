const db = require('../../config/db')

function find(filters, table) {
    try {
        let query = `SELECT * FROM ${table}`

        if(filters) {
            Object.keys(filters).map(key => {
                query += ` ${key}`
    
                Object.keys(filters[key]).map(field => {
                    query += ` ${field} = '${filters[key][field]}' `
                })
            })
        }
        
        return db.query(query)       
        
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    init({table}) {
        if(!table) throw new Error('Invalid params')
        this.table = table

        return this
    },

    async findOne(filters) {
        try {
            const results = await find(filters, this.table)
        
            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },

    async findAll(filters) {
        try {
            const results = await find(filters, this.table)
        
            return results.rows
        } catch (error) {
            console.error(error)
        }
    },

    async create(fields) {
        let keys = []
        let values = []

        try {
            
            Object.keys(fields).map( key => {
                keys.push(key)
                values.push(`'${fields[key]}'`)
            })

            const query = `INSERT INTO ${this.table} (${keys.join(',')})
                VALUES (${values.join(',')})
                RETURNING id
            `

            const results = await db.query(query)
            return results.rows[0].id

        } catch (error) {
            console.error(error)
        }
    },

    update(id, fields) {
        try {

            let update = []

            Object.keys(fields).map(key=> {
                const line = `${key} = '${fields[key]}'`
                update.push(line)       
            })

            let query = `UPDATE ${this.table} SET
            ${update.join(',')} WHERE id = ${id}
            `

            return db.query(query)  
            
        } catch (error) {
            console.error(error)
        }                  
    }    
}