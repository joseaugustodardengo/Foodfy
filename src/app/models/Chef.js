// const { date } = require('../../lib/utils')
const db = require('../../config/db')
 
module.exports = {
    all(callback){
        const query = `SELECT chefs.*, COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        `

        // db.query(`SELECT * FROM chefs ORDER BY name ASC`, function(err, results){
        db.query(query, function(err, results){
            if(err) throw `Database error! ${err}`
            
            callback(results.rows)
        })
    },

    create(data, callback){
        const query = `INSERT INTO chefs (
            name,
            avatar_url,            
            created_at
        ) VALUES ($1, $2, $3)
        RETURNING id`

        // const created_at = date(Date.now()).iso
       
        db.query(query, data, function(err, results){
            if(err) throw `Database error! ${err}`
            
            callback(results.rows[0])            
        })
    },

    find(id, callback){
        // const query = `SELECT * FROM chefs WHERE id = $1`
        const query = `SELECT chefs.*, COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1        
        GROUP BY chefs.id
        `

        db.query(query, [id], function(err, results){
            if(err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },

    findRecipes(id, callback) {
        const query = `SELECT recipes.*
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1        
        `

        db.query(query,[id],function(err, results){
            if(err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    
    update(data,callback){
        const query = `UPDATE chefs SET
            name = ($1),
            avatar_url = ($2)            
        WHERE id = $3
        `

        db.query(query, data, function(err, results){
            if(err) throw `Database error! ${err}`
            
            callback()            
        })
    },

    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}`
            
            callback()            
        })
    }
}