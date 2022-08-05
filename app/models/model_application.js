const mysql = require('../module/mysql_connector')

module.exports = {
    getAll: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_vihara ";
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
            var sql= "SELECT * FROM ms_vihara "+
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
    getUserList: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT mpu.username, mpu.active, tpa.created FROM tr_panel_user_apps tpa "+
            "JOIN ms_panel_users mpu ON tpa.id_user = mpu.id_panel_users "+
            "WHERE tpa.id_app="+id+" ";

            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    checkUsername: async function(name, id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_vihara "+
            "WHERE name='"+name+"' ";

            if (id != null) sql += " AND id != "+id

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
            var sql= "SELECT * FROM ms_vihara "+
            "WHERE "+
            "name LIKE '%"+data.search+"%' "+
            "OR kota LIKE '%"+data.search+"%' "+
            "OR alamat LIKE '%"+data.search+"%' "+
            "OR active LIKE '%"+data.search+"%' "+
            "OR created_by LIKE '%"+data.search+"%' "+
            "OR created LIKE '%"+data.search+"%' "+
            "OR updated LIKE '%"+data.search+"%' "+
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
            "FROM ms_vihara "+
            "WHERE "+
            "name LIKE '%"+data.search+"%' "+
            "OR kota LIKE '%"+data.search+"%' "+
            "OR alamat LIKE '%"+data.search+"%' "+
            "OR active LIKE '%"+data.search+"%' "+
            "OR created_by LIKE '%"+data.search+"%' "+
            "OR created LIKE '%"+data.search+"%' "+
            "OR updated LIKE '%"+data.search+"%' "+
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
            var sql =  "INSERT INTO ms_vihara (name,alamat,kota,active,created_by) "+
            "VALUES ("+
            "'"+data.name+"', "+
            "'"+(data.alamat).replace("'","\\'")+"', "+
            "'"+data.kota+"', "+
            "1, "+
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

    updateApps: async function(data){
        try {
            await mysql.connectAsync()
            var sql =   "UPDATE ms_vihara SET "+
                        "name='"+data.name+"', "+
                        "alamat='"+(data.alamat).replace("\\","\\\\")+"', "+
                        "kota='"+data.kota+"', "+
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
    
    isActive: async function (data) {
        try {
            await mysql.connectAsync()
            var sql =   "UPDATE ms_vihara SET "+
                        "active="+data.active+" "+
                        "WHERE id="+data.id+" "
            
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