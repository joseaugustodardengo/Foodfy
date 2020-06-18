const db = require('../../config/db')

module.exports = {
    async findAll(filters) {
        try {
            let query = `SELECT * FROM users`

            const results = await db.query(query)
            
            return results.rows
        } catch (error) {
            console.error(error)
        }
    },

    async findOne(filters) {
        try {
            let query = `SELECT * FROM users`

            Object.keys(filters).map(key => {
                query = `${query} 
                ${key}
                `
                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key][field]}' `
                })
            })
            
            const results = await db.query(query)
            
            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },

    async create(data){
        try {
            const query = `INSERT INTO users (name, email, password, is_admin) VALUES ($1, $2, $3, $4)
            RETURNING id`    
            
    
            const results = await db.query(query, data)
            return results.rows[0].id

        } catch (error) {
            console.log(error)  
        }

    },

    async update(id, fields) {
        let query = `UPDATE users SET`

            Object.keys(fields).map((key, index, array) => {
                if((index + 1) < array.length) {
                    query = `${query} 
                    ${key} = '${fields[key]}',
                    `
                } else {
                    query = `${query} 
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                    `
                }                
            })

            await db.query(query) 
    }
}