const db = require('../../config/db')
const fs = require('fs')

module.exports = {

    create({filename, path}) {
        try {
            const query = `INSERT INTO files (
                name,
                path                        
            ) VALUES ($1, $2)
            RETURNING id`
    
            const values = [
                filename,
                path
            ]
        
            return db.query(query, values)
            
        } catch (error) {
            console.log(error);            
        }
    },

    findById(id) {
        try {
            return db.query('SELECT * FROM files WHERE id=$1',[id])
        } catch (error) {
            console.log(error)
        }
    },

    async delete(id) {
        try {            
            const result = await db.query('SELECT * FROM files WHERE id=$1',[id])
            const file = result.rows[0]
            
            fs.unlinkSync(`public${file.path}`)

            await db.query('DELETE FROM recipes_files WHERE file_id = $1',[id])
            
            await db.query('DELETE FROM files WHERE id = $1',[id])
        } catch (error) {
            console.error(error);            
        }
    },    
}