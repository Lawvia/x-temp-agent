const mysql = require('../module/mysql_connector')

module.exports = {
    getAll: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_umat ";
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    getAllV2: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT id, CONCAT(name, ' - ', phone) as name FROM ms_umat ";
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
            var sql= "SELECT * FROM ms_umat "+
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

    getAttendedKelas: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT nama_kelas, tanggal_kelas from tr_peserta tp "+
            "JOIN ms_kelas mk ON mk.id = tp.id_kelas "+
            "WHERE id_umat="+id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getList: async function(data){
        try {
            await mysql.connectAsync()
            var sql= "SELECT mu.id, name, no_chutao, nama_mandarin, nama_indo, unfound, is_alive FROM ms_umat mu "+
            "JOIN ms_vihara mv ON mu.id_vihara = mv.id "+
            "WHERE "+
            "name LIKE '%"+data.search+"%' "+
            "OR no_chutao LIKE '%"+data.search+"%' "+
            "OR nama_mandarin LIKE '%"+data.search+"%' "+
            "OR nama_indo LIKE '%"+data.search+"%' "+
            "OR unfound LIKE '%"+data.search+"%' "+
            "OR is_alive LIKE '%"+data.search+"%' "+
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
            "FROM ms_umat mu "+
            "JOIN ms_vihara mv ON mu.id_vihara = mv.id "+
            "WHERE "+
            "name LIKE '%"+data.search+"%' "+
            "OR no_chutao LIKE '%"+data.search+"%' "+
            "OR nama_mandarin LIKE '%"+data.search+"%' "+
            "OR nama_indo LIKE '%"+data.search+"%' "+
            "OR unfound LIKE '%"+data.search+"%' "+
            "OR is_alive LIKE '%"+data.search+"%' "+
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
    
    addPhone: async function(data){
        try{
            await mysql.connectAsync()
            var sql =  "INSERT INTO ms_umat (name,phone,description,created_by) "+
            "VALUES ("+
            "'"+data.name+"', "+
            "'"+data.phone+"', "+
            "'"+data.description+"', "+
            "'"+data.created_by+"') "
            var [result,cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch(error){
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    checkUsername: async function(name, id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_umat "+
            "WHERE phone='"+name+"' ";

            if (id != null) sql += " AND id != "+id

            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    updatePhone: async function(data){
        try {
            await mysql.connectAsync()
            var sql =   "UPDATE ms_umat SET "+
                        "name='"+data.name+"', "+
                        "phone='"+data.phone+"', "+
                        "description='"+data.description+"', "+
                        "created_by='"+data.created_by+"' "+
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
    
    deletePhone: async function (id) {
        try {
            await mysql.connectAsync()
            var sql =   "DELETE FROM ms_umat "+
                        "WHERE id="+id+" "
            
            var [result, cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
}