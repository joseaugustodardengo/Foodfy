const db = require('../../config/db')
const fs = require('fs')

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

    async create(data) {
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
            if ((index + 1) < array.length) {
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
    },

    async delete(id) {
        try {

            const recipesResults = await db.query(
                `
            SELECT recipes.*, recipe_id, file_id
            FROM recipes
            LEFT JOIN recipes_files ON (recipes.id = recipes_files.recipe_id)
            WHERE recipes.user_id = $1
            `, [id]
            )
            const recipes = recipesResults.rows

            let files = await Promise.all(recipes.map(async recipe => {

                const results = await db.query(
                    `
                SELECT *
                FROM files
                WHERE files.id = $1
                `, [recipe.file_id])

                return results.rows[0]
            }))

            files.map(async file => {
                fs.unlinkSync(`public/${file.path}`)
            })

            await db.query(`
            DELETE FROM users
            WHERE id = $1
            `, [id])

            return
        } catch (err) {
            console.error(err)
        }
    }

}