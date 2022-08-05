const mysql = require('../module/mysql_connector')

module.exports = {
    getAll: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_kelas ";
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    getSidangDharma: async function(){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM ms_kelas WHERE sidang_dharma = 1";
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getPesertaSidang: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT id_umat, nama_mandarin, nama_indo, no_chutao FROM tr_peserta tp "+
            "JOIN ms_umat mu ON tp.id_umat = mu.id "+
            "WHERE id_kelas = "+id;
            var [result, cache]= await mysql.queryAsync(sql)
            console.log("sidang", sql)
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
            var sql= "SELECT * FROM ms_kelas "+
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

    getIkrarSuciKelas: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM tr_karir_suci "+
            "WHERE id_kelas="+id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result[0], null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getIkrarSuciUmat: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM tr_karir_suci "+
            "WHERE id_umat="+id+" "
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
            var sql= "SELECT * FROM ms_kelas "+
            "WHERE "+
            "nama_kelas LIKE '%"+data.search+"%' "+
            "OR tanggal_kelas LIKE '%"+data.search+"%' "+
            "OR keterangan LIKE '%"+data.search+"%' "+
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
            "FROM ms_kelas "+
            "WHERE "+
            "nama_kelas LIKE '%"+data.search+"%' "+
            "OR tanggal_kelas LIKE '%"+data.search+"%' "+
            "OR keterangan LIKE '%"+data.search+"%' "+
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
            var sql =  "INSERT INTO ms_kelas (id_vihara,nama_kelas,tanggal_kelas,tanggal_selesai, sidang_dharma, keterangan) "+
            "VALUES ("+
            data.id_vihara+","+
            "'"+data.nama_kelas+"',"+
            "'"+data.tanggal_kelas+"',"+
            "'"+data.tanggal_selesai+"',"+
            ""+data.sidang_dharma+","+
            "'"+data.keterangan+"'"
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
            var sql =   "UPDATE ms_kelas SET "+
                        "id_vihara="+data.id_vihara+","+
                        "nama_kelas='"+data.nama_kelas+"', "+
                        "tanggal_kelas='"+data.tanggal_kelas+"', "+
                        "tanggal_selesai='"+data.tanggal_selesai+"', "+
                        "keterangan='"+data.keterangan+"' "+

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
    delete: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "DELETE FROM ms_kelas WHERE id="+id;
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getPesertaKelas: async function(id, gender){
        try {
            await mysql.connectAsync()
            var sql= "SELECT id_umat, nama_mandarin, nama_indo, no_chutao, sumbangan, cara_bayar, transportasi, gender, mg.value, id_daerah FROM tr_peserta tp "+
            "JOIN ms_umat mu ON mu.id = tp. id_umat "+
            "JOIN ms_gender mg ON mg.id = mu.gender "+
            "WHERE id_kelas="+id+" "
            
            if (gender!= "all"){
                sql += "AND mg.value='"+gender+"' "
            }
            console.log("cek", sql)
            
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getCountPeserta: async function(id, gender){
        try {
            await mysql.connectAsync()
            var sql= "SELECT COUNT(*) as count FROM tr_peserta tp "+
            "JOIN ms_umat mu ON mu.id = tp. id_umat "+
            "JOIN ms_gender mg ON mg.id = mu.gender "+
            "WHERE id_kelas="+id+" "
            
            if (gender!= "all"){
                sql += "AND mg.value='"+gender+"' "
            }
            console.log("cek", sql)
            
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result[0], null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getDownloadPeserta: async function(id, gender){
        try {
            await mysql.connectAsync()
            var sql= "SELECT nama_mandarin, nama_indo, no_chutao, sumbangan, cara_bayar, transportasi FROM tr_peserta tp "+
            "JOIN ms_umat mu ON mu.id = tp. id_umat "+
            "JOIN ms_gender mg ON mg.id = mu.gender "+
            "WHERE id_kelas="+id+" "
            
            if (gender!= "all"){
                sql += "AND mg.value='"+gender+"' "
            }
            console.log("cek", sql)
            
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getPengabdiKelas: async function(id, gender){
        try {
            await mysql.connectAsync()
            var sql= "SELECT id_umat, nama_mandarin, nama_indo, gender, no_chutao, sumbangan, cara_bayar, transportasi, tugas FROM tr_pengabdi tp "+
            "JOIN ms_umat mu ON mu.id = tp. id_umat "+
            "JOIN ms_gender mg ON mg.id = mu.gender "+
            "WHERE id_kelas="+id+" "

            if (gender!= "all"){
                sql += "AND mg.value='"+gender+"' "
            }

            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getCountPengabdi: async function(id, gender){
        try {
            await mysql.connectAsync()
            var sql= "SELECT COUNT(*) as 'count' FROM tr_pengabdi tp "+
            "JOIN ms_umat mu ON mu.id = tp. id_umat "+
            "JOIN ms_gender mg ON mg.id = mu.gender "+
            "WHERE id_kelas="+id+" "

            if (gender!= "all"){
                sql += "AND mg.value='"+gender+"' "
            }

            console.log("cek count pengabdi", sql)

            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result[0], null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getDonaturKelas: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM tr_donatur tp "+
            "WHERE id_kelas="+id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getSumbanganKelas: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM tr_sumbangan tp "+
            "WHERE id_kelas="+id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getCountPesertaKelas: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT COUNT(CASE WHEN value= 'm' THEN id_umat END) as males, COUNT(CASE WHEN value= 'f' THEN id_umat END) as females, COUNT(*) as total FROM tr_peserta tp "+
            "JOIN ms_umat mu ON mu.id = tp.id_umat "+
            "JOIN ms_gender mg ON mg.id = mu.gender "+
            "WHERE id_kelas="+id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getTotalSumbanganPeserta: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT SUM(CASE WHEN cara_bayar= 'cash' THEN sumbangan END) as sumbangan, SUM(CASE WHEN cara_bayar= 'transfer' THEN sumbangan END) as transfer, SUM(CASE WHEN cara_bayar= 'qris' THEN sumbangan END) as qris, SUM(sumbangan) as total FROM tr_peserta "+
            "WHERE id_kelas="+id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    
    getTotalSumbanganDonatur: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT SUM(CASE WHEN cara_bayar= 'cash' THEN sumbangan END) as sumbangan, SUM(CASE WHEN cara_bayar= 'transfer' THEN sumbangan END) as transfer, SUM(CASE WHEN cara_bayar= 'qris' THEN sumbangan END) as qris, SUM(sumbangan) as total FROM tr_donatur "+
            "WHERE id_kelas="+id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getTotalSumbanganPengabdi: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT SUM(CASE WHEN cara_bayar= 'cash' THEN sumbangan END) as sumbangan, SUM(CASE WHEN cara_bayar= 'transfer' THEN sumbangan END) as transfer, SUM(CASE WHEN cara_bayar= 'qris' THEN sumbangan END) as qris, SUM(sumbangan) as total FROM tr_pengabdi "+
            "WHERE id_kelas="+id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getTotalPengeluaranDivisi: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT SUM(nominal) as total, md.id FROM ms_divisi md "+
            "LEFT JOIN tr_biaya tb ON md.id = tb.divisi "+
            "WHERE id_kelas="+id+" "+
            "GROUP BY md.id "+
            "ORDER BY md.id ASC "
            
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getTotalPengeluaran: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT SUM(nominal) as total FROM tr_biaya "+
            "WHERE id_kelas="+id+" "
            
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },

    getBiayaKelas: async function(id){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM tr_biaya tp "+
            "WHERE id_kelas="+id+" "
            var [result, cache]= await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },


    
}