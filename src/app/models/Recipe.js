// const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(callback) {
        const query = `SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.title ASC`

        db.query(query, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },

    create(data, callback) {
        const query = `INSERT INTO recipes (
            chef_id,
            image,
            title,
            ingredients,
            preparation,
            information,
            created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id`

        // const created_at = date(Date.now()).iso

        db.query(query, data, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },

    find(id, callback) {
        const query = `SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`

        db.query(query, [id], function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
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

    update(data, callback) {
        const query = `UPDATE recipes SET
            chef_id = ($1),
            image = ($2),
            title = ($3),
            ingredients = ($4),
            preparation = ($5),
            information = ($6)
        WHERE id = $7
        `

        db.query(query, data, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback()
        })
    },

    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function (err, results) {
            if (err) throw `Database error! ${err}`

            callback()
        })
    },

    chefsSelectOptions(callback) {
        db.query(`SELECT id, name FROM chefs`, function (err, results) {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
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
    }
}