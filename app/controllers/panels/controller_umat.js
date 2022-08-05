const express = require('express')
const router = express.Router()
const model = require('../../models/model_umat')
const model_apps = require('../../models/model_application')
const model_tahun = require('../../models/model_tahun')
const model_waktu = require('../../models/model_waktu')
const model_pendidikan = require('../../models/model_pendidikan')
const model_kelas = require('../../models/model_kelas')

const model_pandita = require('../../models/model_pandita')
const model_gender = require('../../models/model_gender')

const model_user = require('../../models/model_ms_panel_users')

router.use(function(req, res, next) {
    res.locals.message_success = req.flash('message_success');
    res.locals.message_fail = req.flash('message_fail');
    res.locals.message_warning = req.flash('message_warning');
    next()
}),

router.get("/", async function (req, res) {
    // var result = groups.list
    res.render('panels/ms_umat', { user: req.user})
})

// ajaxList
router.post("/list", async function(req, res) {
    var start = req.body.start
    var length = req.body.length
    var order = req.body.columns[req.body.order[0].column].data
    var direction = req.body.order[0].dir
    var search = req.body.search.value
    var [ret, err] = await model.getList({
        start: parseInt(start),
        length: parseInt(length),
        search: search,
        order: order,
        direction: direction,
        id: req.body.id,
    })
    var [count, err] = await model.count({
        start: parseInt(start),
        length: parseInt(length),
        search: search,
        order: order,
        direction: direction,
        id: req.body.id,
    })
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        data : ret,
        recordsTotal:count,
        recordsFiltered:count,
    }));
}),

router.post("/get", async function(req,res) {
    var [result,error] = await model.getById(req.body.app_id);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        data:result,
    }))
}),

router.post("/get_user", async function(req,res) {
    var [result,error] = await model.getUserList(req.body.app_id);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        data:result,
    }))
}),

router.post("/input", async function(req, res) {
    var phone_id = req.body.phone_id
    var phone_name = req.body.phone_name
    var phone = req.body.phone
    var description = req.body.description

    var data_input = {
        id: phone_id,
        name: phone_name,
        phone: phone,
        description: description,
        created_by: req.user.username
    }
    if (!phone_id) {//insert
        //check for already exist name
        var [check, err] = await model.checkUsername(phone, null);
        if (check && check.length > 0){
            req.flash('message_fail', "Number already registered")
            res.redirect('/panels/phone')
            return
        }

        var [result, error] = await model.addPhone(data_input);
        req.flash('message_success', "Success insert data")
        res.redirect('/panels/phone')
    } else {//update
        var [check, err] = await model.checkUsername(phone, phone_id);
        if (check && check.length > 0){
            req.flash('message_fail', "Number already registered!")
            res.redirect('/panels/phone')
            return
        }

        var [result, error] = await model.updatePhone(data_input);
        req.flash('message_success', "Success update data")
        res.redirect('/panels/phone')
    }
})


router.get("/detail/:id_umat", async function (req, res) {
    // get app list by user id
    var id_umat = req.params.id_umat
    var [result,error] = await model.getById(id_umat);
    var [kelas,error] = await model.getAttendedKelas(id_umat);
    console.log("kelas ", kelas)

        var [apps, err] = await model_apps.getAll();
        var [pengajak, err] = await model.getAll();
        var [tahun, err] = await model_tahun.getAll();
        var [waktu, err] = await model_waktu.getAll();
        var [pandita, err] = await model_pandita.getAll();
        var [gender, err] = await model_gender.getAll();
        var [pendidikan, err] = await model_pendidikan.getAll();
        var [ikrar, err] = await model_kelas.getIkrarSuciUmat(id_umat);

    res.render('panels/ms_detail', { 
        user: req.user,
        apps: apps,
        result: result,
        pengajak: pengajak,
        tahun: tahun,
        waktu: waktu,
        pandita: pandita,
        gender: gender,
        pendidikan: pendidikan,
        ikrar: ikrar,
        kelas: kelas
        // phone: phone,
        // groups: groups,
        // scene: scene,
        // templates: templates
    })
})

router.get("/cetya", async function (req, res) {
    // get app list by user id
    var id_umat = 2
    var [result,error] = await model.getById(id_umat);

        var [apps, err] = await model_apps.getAll();
        var [pengajak, err] = await model.getAll();

    res.render('panels/ms_cetya', { 
        user: req.user,
        apps: apps,
        result: result,
        pengajak: pengajak,
        // phone: phone,
        // groups: groups,
        // scene: scene,
        // templates: templates
    })
})

router.get("/keluarga", async function (req, res) {
    // get app list by user id
    var id_umat = 2
    var [result,error] = await model.getById(id_umat);

        var [apps, err] = await model_apps.getAll();
        var [pengajak, err] = await model.getAll();

        //get nomor reg keluarga

        var reg = []

        for(var i=0;i< 10; i++){
            var obj = {
                id: i+1,
                name: "kel-00"+(i+1)
            }

            reg.push(obj)
        }

    res.render('panels/ms_keluarga', { 
        user: req.user,
        apps: apps,
        result: result,
        pengajak: pengajak,
        reg: reg,
        // phone: phone,
        // groups: groups,
        // scene: scene,
        // templates: templates
    })
})

router.get("/karir_suci", async function (req, res) {
    // get app list by user id
    var id_umat = 2
    var [result,error] = await model.getById(id_umat);

    var [apps, err] = await model_kelas.getSidangDharma();
    

        //get nomor reg keluarga

        var reg = []

        for(var i=0;i< 10; i++){
            var obj = {
                id: i+1,
                name: "kel-00"+(i+1)
            }

            reg.push(obj)
        }

    res.render('panels/karir_suci', { 
        user: req.user,
        apps: apps,
        result: result,
        reg: reg,
        // phone: phone,
        // groups: groups,
        // scene: scene,
        // templates: templates
    })
})

router.post('/getpesertasidang', async function (req, res){
    var [cek, err] = await model_kelas.getPesertaSidang(req.body.id_kelas);
    var [ikrar, err] = await model_kelas.getIkrarSuciKelas(req.body.id_kelas);

    console.log("ccc",req.body.id_kelas)

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        status: "SUCCESS",
        data: cek,
        ikrar: ikrar
    }));
})

//delete
router.post('/delete', async function (req, res){
    var [curr, err]= await model.deletePhone(req.body.id_app)

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        status: "SUCCESS"
    }));
})


module.exports = router

