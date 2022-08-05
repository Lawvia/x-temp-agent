const mysql = require('../module/mysql_connector')

module.exports = {
    getById: async function(id_panel_users){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_panel_users "+
            "WHERE id_panel_users="+id_panel_users+" "
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
            var sql= "SELECT * FROM ms_panel_users "+
            "WHERE "+
            "username LIKE '%"+data.search+"%' "+
            "OR active LIKE '%"+data.search+"%' "+
            "OR role LIKE '%"+data.search+"%' "+
            "OR last_login LIKE '%"+data.search+"%' "+
            "OR created_date LIKE '%"+data.search+"%' "+
            "OR updated_date LIKE '%"+data.search+"%' "+
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
            "FROM ms_panel_users "+
            "WHERE "+
            "username LIKE '%"+data.search+"%' "+
            "OR active LIKE '%"+data.search+"%' "+
            "OR role LIKE '%"+data.search+"%' "+
            "OR last_login LIKE '%"+data.search+"%' "+
            "OR created_date LIKE '%"+data.search+"%' "+
            "OR updated_date LIKE '%"+data.search+"%' "+
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
    addgroup: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "INSERT INTO tr_panel_user_apps (id_user,id_app,created,updated) "+
            "VALUES ("+
            data.id_user+", "+
            data.id_app+", "+
            "NOW(), "+
            "NOW() ) "
            
            var [result,cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    addTemplate: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "INSERT INTO tr_template_map (id_user,template_name, created, updated) "+
            "VALUES ("+
            data.id_user+", '"+
            data.name+"', "+
            "NOW(), "+
            "NOW() ) "
            
            var [result,cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getUserGroup: async function(id_panel_users){
        try {
            await mysql.connectAsync()
            var sql = "SELECT * FROM tr_panel_user_apps  "+
            "WHERE id_user='"+id_panel_users+"' "
            
            var [result,cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getUserTemplate: async function(id_panel_users){
        try {
            await mysql.connectAsync()
            var sql = "SELECT * FROM tr_template_map  "+
            "WHERE id_user='"+id_panel_users+"' "
            
            var [result,cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getUserAuthorizedApp: async function(id_panel_users){
        try {
            await mysql.connectAsync()
            var sql = "SELECT ma.id, ma.name FROM ms_application ma  "+
            "JOIN tr_panel_user_apps tp ON tp.id_app = ma.id "+
            "WHERE tp.id_user = "+id_panel_users;
            
            var [result,cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    selectUser : async function(username){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_panel_users "+
            "WHERE username='"+username+"' "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result[0], null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    
    addUser: async function(data){
        try{
            await mysql.connectAsync()
            var sql =  "INSERT INTO ms_panel_users (username,password,role,active,last_login,created_date,updated_date) "+
            "VALUES ("+
            "'"+data.username+"', "+
            "'"+data.password+"', "+
            "'"+data.role+"', "+
            "1, "+
            "NOW(), "+
            "NOW(), "+
            "NOW() )"
            var [result,cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        }catch(error){
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    resetPassword: async function(data){
        try {
            await mysql.connectAsync()
            var sql =   "UPDATE ms_panel_users SET "+
                        "password='"+data.password+"' "+
                        "WHERE id_panel_users="+data.id_panel_users+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return[result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    deleteUserGroup: async function(id_panel_users){
        try {
            var sql = "DELETE FROM tr_panel_user_apps WHERE id_user="+id_panel_users+" "
            var [result, cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        }
         catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    deleteUserTemplate: async function(id_panel_users){
        try {
            var sql = "DELETE FROM tr_template_map WHERE id_user="+id_panel_users+" "
            var [result, cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        }
         catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    
    isActive: async function (data) {
        try {
            await mysql.connectAsync()
            var sql =   "UPDATE ms_panel_users SET "+
                        "active="+data.active+" "+
                        "WHERE id_panel_users="+data.id_panel_users+" "
            
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