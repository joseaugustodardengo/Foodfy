// const { date } = require('../../lib/utils')
const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    all() {
        const query = `SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.title ASC`

        return db.query(query)
    },

    create(data) {
        try {
            const query = `INSERT INTO recipes (
                chef_id,
                user_id,
                title,
                ingredients,
                preparation,
                information            
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`
    
            return db.query(query, data)            
        } catch (error) {
            console.error(error)
        }
    },

    find(id) {
        try {
            const query = `SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`
    
            return db.query(query, [id])
            
        } catch (error) {
            
        }
    },

    //buscar pelo search
    findBy(search, callback) {
        const query = `SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${search}%'
        ORDER BY recipes.title ASC`

        db.query(query, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },

    update(data) {
        try {
            const query = `UPDATE recipes SET
                chef_id = ($1),
                user_id = ($2),
                title = ($3),
                ingredients = ($4),
                preparation = ($5),
                information = ($6)
            WHERE id = $7
            `
    
            return db.query(query, data)
            
        } catch (error) {
            console.error(error)
        }
    },

    delete(id) {
        return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },

    chefsSelectOptions() {
        try {
            return db.query(`SELECT id, name FROM chefs`)            
        } catch (error) {
            console.error(error)
        }
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
            ORDER BY recipes.title ASC
            LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },

    createRecipeFiles({recipe_id, file_id}) {
        try {
            const query = `INSERT INTO recipes_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id`

            const values = [
                recipe_id,
                file_id
            ]

            return db.query(query,values)
        } catch (error) {
            console.error(error)
        }
    },    

    files(recipeId) {
        try {
            return db.query(`SELECT files.* 
            FROM files 
            JOIN recipes_files ON (recipes_files.file_id = files.id)
            WHERE recipes_files.recipe_id = $1`, [recipeId])        
            
        } catch (error) {
            console.log(error);            
        }
    }

}