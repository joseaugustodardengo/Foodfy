const db = require('../../config/db')
const Base = require('./Base')

Base.init({table: 'chefs'})
 
module.exports = {
    ...Base,

    async findAll(){
        try {
            const results = await db.query(`SELECT chefs.*, files.path, COUNT(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            LEFT JOIN files ON (files.id = chefs.file_id)
            GROUP BY chefs.id, files.path
            `)      
            
            return results.rows
            
        } catch (error) {
            console.error(error);            
        }
    },    

    async findOne(id){
        try {
            const results = await db.query(`SELECT chefs.*, files.path, COUNT(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            LEFT JOIN files ON (files.id = chefs.file_id)
            WHERE chefs.id = $1        
            GROUP BY chefs.id, files.path
            `, [id])
            return results.rows[0]
            
        } catch (error) {
            console.error(error);            
        }
    },

    async findRecipes(id) {
        try {
            const results = await db.query(`SELECT recipes.*
                FROM chefs
                LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                WHERE chefs.id = $1        
            `,[id])
            return results.rows
            
        } catch (error) {
            console.error(error)
        }
    },

    async delete(id) {
        try {
            return db.query(`DELETE FROM chefs WHERE id = $1`, [id])            
        } catch (error) {
            console.error(error);            
        }
    },

    async files(chefId) {
        try {
            const results = await db.query(`SELECT files.* 
            FROM files 
            JOIN chefs ON (chefs.file_id = files.id)
            WHERE chefs.id = $1`, [chefId])        

            return results.rows[0]
            
        } catch (error) {
            console.log(error);            
        }
    }
}