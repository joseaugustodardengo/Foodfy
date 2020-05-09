// const { date } = require('../../lib/utils')
const db = require('../../config/db')
 
module.exports = {
    all(){
        const query = `SELECT chefs.*, COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        `

        // db.query(`SELECT * FROM chefs ORDER BY name ASC`, function(err, results){
        return db.query(query)
    },

    create(data){
        const query = `INSERT INTO chefs (
            name,
            avatar_url,            
            created_at
        ) VALUES ($1, $2, $3)
        RETURNING id`

        // const created_at = date(Date.now()).iso
       
        return db.query(query, data)
    },

    find(id){
        // const query = `SELECT * FROM chefs WHERE id = $1`
        const query = `SELECT chefs.*, COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1        
        GROUP BY chefs.id
        `
        return db.query(query, [id])
    },

    findRecipes(id) {
        const query = `SELECT recipes.*
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1        
        `
        return db.query(query,[id])
    },
    
    update(data){
        const query = `UPDATE chefs SET
            name = ($1),
            avatar_url = ($2)            
        WHERE id = $3
        `
        return db.query(query, data)
    },

    delete(id) {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    }
}