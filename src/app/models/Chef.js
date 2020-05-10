// const { date } = require('../../lib/utils')
const db = require('../../config/db')
 
module.exports = {
    all(){
        try {
            const query = `SELECT chefs.*, files.path, COUNT(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            LEFT JOIN files ON (files.id = chefs.file_id)
            GROUP BY chefs.id, files.path
            `
            return db.query(query)
            
        } catch (error) {
            console.error(error);            
        }
    },

    create(data){
        try {
            const query = `INSERT INTO chefs (
                name,
                file_id
            ) VALUES ($1, $2)
            RETURNING id`
           
            return db.query(query, data)
            
        } catch (error) {
            console.error(error);            
        }
    },

    find(id){
        try {
            const query = `SELECT chefs.*, files.path, COUNT(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            LEFT JOIN files ON (files.id = chefs.file_id)
            WHERE chefs.id = $1        
            GROUP BY chefs.id, files.path
            `
            return db.query(query, [id])
            
        } catch (error) {
            console.error(error);            
        }
    },

    findRecipes(id) {
        try {
            const query = `SELECT recipes.*
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                WHERE chefs.id = $1        
            `
            return db.query(query,[id])
            
        } catch (error) {
            console.error(error)
        }
    },
    
    update(data){
        try {
            const query = `UPDATE chefs SET
                name = ($1),
                file_id = ($2)            
            WHERE id = $3
            `
            return db.query(query, data)            
        } catch (error) {
            console.error(error);            
        }
    },

    async delete(id) {
        try {
            return db.query(`DELETE FROM chefs WHERE id = $1`, [id])            
        } catch (error) {
            console.error(error);            
        }
    },

    files(chefId) {
        try {
            return db.query(`SELECT files.* 
            FROM files 
            JOIN chefs ON (chefs.file_id = files.id)
            WHERE chefs.id = $1`, [chefId])        
            
        } catch (error) {
            console.log(error);            
        }
    }
}