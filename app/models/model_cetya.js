const mysql = require('../module/mysql_connector')

module.exports = {
    getAll: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_cetya ";
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
            var sql= "SELECT * FROM ms_cetya "+
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
            var sql= "SELECT * FROM ms_cetya "+
            "WHERE "+
            "nama_cetya LIKE '%"+data.search+"%' "+
            "OR no_kontak LIKE '%"+data.search+"%' "+
            "OR alamat LIKE '%"+data.search+"%' "+
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
            "FROM ms_cetya "+
            "WHERE "+
            "nama_cetya LIKE '%"+data.search+"%' "+
            "OR no_kontak LIKE '%"+data.search+"%' "+
            "OR alamat LIKE '%"+data.search+"%' "+
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
            var sql =  "INSERT INTO ms_cetya (nama_cetya,alamat,no_kontak,id_umat1,id_umat2,active) "+
            "VALUES ("+
            "'"+data.nama_cetya+"',"+
            "'"+data.alamat+"',"+
            "'"+data.no_kontak+"',"+
            ""+data.id_umat1+","+
            ""+data.id_umat2+","+
            ""+data.active+""
            +") "
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
            var sql =   "UPDATE ms_cetya SET "+
                        "nama_cetya='"+data.nama_cetya+"', "+
                        "alamat='"+data.alamat+"', "+
                        "no_kontak='"+data.no_kontak+"', "+
                        "id_umat1="+data.id_umat1+", "+
                        "id_umat2="+data.id_umat2+", "+
                        "active="+data.active+", "+

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