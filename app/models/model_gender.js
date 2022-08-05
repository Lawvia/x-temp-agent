const mysql = require('../module/mysql_connector')

module.exports = {
    getAll: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_gender ";
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    getById: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_gender "+
            "WHERE id="+id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result[0], null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    
}