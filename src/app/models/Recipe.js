const db = require('../../config/db')
const fs = require('fs')
const Base = require('./Base')

Base.init({table: 'recipes'})

module.exports = {
    ...Base,

    async create(fields) {
        let keys = [],
        values = [],
        numbers = []

        try {
            
            Object.keys(fields).map((key, index, array) => {
                keys.push(key)
                values.push(fields[key])

                if(index < array.length){
                    numbers.push(`$${index+1}`)
                }
            })

            const query = `INSERT INTO ${this.table} (${keys.join(',')})
                VALUES (${numbers.join(',')})
                RETURNING id
            `

            const results = await db.query(query, values)
            return results.rows[0].id

        } catch (error) {
            console.error(error)
        }
    },

    async update(id, fields) {
        try {
            let keys = [],
            values = [],
            update = [],
            numbers= []

            Object.keys(fields).map((key, index, array) => { 
                keys.push(key)
                values.push(fields[key])

                if(index < array.length){
                    numbers.push(`$${index+1}`)
                }

                const line = `${key} = (${numbers[index]})`
                update.push(line)       
            })

            let query = `UPDATE ${this.table} SET
            ${update.join(',')} WHERE id = ${id}
            `

            return db.query(query, values)  
            
        } catch (error) {
            console.error(error)
        }                  
    }, 

    async findAll() {
        try {
            const results = await db.query(`SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY recipes.created_at DESC`)
    
            return results.rows
            
        } catch (error) {
            console.error(error)
        }
    },    

    async find(id) {
        try {
            const results = await db.query(`SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = ${id}`)
    
            return results.rows[0]
            
        } catch (error) {
            
        }
    },

    //buscar pelo search
    async findBy(search) {
        try {
            const query = `SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${search}%'
            ORDER BY updated_at DESC`
    
            const results = await db.query(query)

            return results.rows
            
        } catch (error) {
            console.error(er)
        }
    },

    delete(id) {
        return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },

    //função de paginação
    paginate(params) {
        let { search, limit, offset, callback } = params

        let query = "",
            searchQuery = "",
            totalQuery = `(SELECT COUNT(*) FROM recipes) AS total`

        if (search) {
            searchQuery = ` WHERE recipes.title ILIKE '%${search}%'
                `
            totalQuery = `(
                    SELECT COUNT(*) FROM recipes
                    ${searchQuery}
                    ) AS TOTAL`

        }

        query = `SELECT recipes.*, ${totalQuery} , chefs.name AS chef_name  
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${searchQuery}            
            ORDER BY recipes.updated_at DESC
            LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },   

    async files(recipeId) {
        try {
            const results = await db.query(`SELECT files.* 
            FROM files 
            JOIN recipes_files ON (recipes_files.file_id = files.id)
            WHERE recipes_files.recipe_id = $1`, [recipeId]) 
            
            return results.rows
            
        } catch (error) {
            console.log(error);            
        }
    }

}