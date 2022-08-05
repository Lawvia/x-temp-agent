const mysql = require('../module/mysql_connector')

module.exports = {
    getAll: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_divisi ";
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
            var sql= "SELECT * FROM ms_divisi "+
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

    getList: async function(data){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_divisi "+
            "WHERE "+
            "name LIKE '%"+data.search+"%' "+
            "ORDER BY "+data.order+" "+data.direction+" "+
            "LIMIT "+data.start+", "+data.length
        var [result, cache]= await mysql.queryAsync(sql)
        await mysql.endPool()
        return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    count : async function(data){
        try{
            await mysql.connectAsync()
            var sql = "SELECT COUNT(*) as 'count' "+
            "FROM ms_divisi "+
            "WHERE "+
            "name LIKE '%"+data.search+"%' "+
            "ORDER BY "+data.order+" "+data.direction
            var [result,cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result[0].count, null]
        }catch(error){
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    
    addApps: async function(data){
        try{
            await mysql.connectAsync()
            var sql =  "INSERT INTO ms_divisi (name, nama_mandarin) "+
            "VALUES ("+
            "'"+data.name+"', '"+data.nama_mandarin+"') "
            var [result,cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch(error){
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    updateApps: async function(data){
        try {
            await mysql.connectAsync()
            var sql =   "UPDATE ms_divisi SET "+
                        "name='"+data.name+"', "+
                        "nama_mandarin='" +data.nama_mandarin+"' "+
                        "WHERE id="+data.id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return[result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    
}