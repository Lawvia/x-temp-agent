const express = require('express')
const router = express.Router()
const model = require('../../models/model_cetya')
const model_umat = require('../../models/model_umat')
const model_apps = require('../../models/model_application')
const model_tahun = require('../../models/model_tahun')
const model_waktu = require('../../models/model_waktu')
const model_user = require('../../models/model_ms_panel_users')

router.use(function(req, res, next) {
    res.locals.message_success = req.flash('message_success');
    res.locals.message_fail = req.flash('message_fail');
    res.locals.message_warning = req.flash('message_warning');
    next()
}),

router.get("/", async function (req, res) {
    // var result = groups.list
    res.render('panels/ms_cetya_list', { user: req.user})
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
   var id_umat1 = req.body.umat1
   var id_umat2 = req.body.umat2
   var alamat = req.body.alamat
   var no_kontak = req.body.no_kontak
   var nama_cetya = req.body.nama_cetya
   var active = req.body.active
   var id_cetya = req.body.id_cetya

    var data_input = {
        id_umat1: id_umat1,
        id_umat2: id_umat2,
        alamat: alamat,
        no_kontak: no_kontak,
        nama_cetya: nama_cetya,
        active: 1 //fix later
    }
    if (id_cetya == 0) {//insert
        //check for already exist name
        // var [check, err] = await model.checkUsername(phone, null);
        // if (check && check.length > 0){
        //     req.flash('message_fail', "Number already registered")
        //     res.redirect('/panels/phone')
        //     return
        // }

        var [result, error] = await model.addApps(data_input);
        req.flash('message_success', "Success insert data")
        res.redirect('/panels/cetya')
    } else {//update
        // var [check, err] = await model.checkUsername(phone, phone_id);
        // if (check && check.length > 0){
        //     req.flash('message_fail', "Number already registered!")
        //     res.redirect('/panels/phone')
        //     return
        // }

        var [result, error] = await model.updateApps(data_input);
        req.flash('message_success', "Success update data")
        res.redirect('/panels/cetya')
    }
})


router.get("/detail/:id_cetya", async function (req, res) {
    // get app list by user id
    var id_cetya = req.params.id_cetya
    var [result,error] = await model.getById(id_cetya);

        var [apps, err] = await model_apps.getAll();
        var [pengajak, err] = await model_umat.getAll();

    res.render('panels/ms_cetya', { 
        user: req.user,
        apps: apps,
        result: result,
        pengajak: pengajak,
    })
})

router.get("/add", async function (req, res) {
    // get app list by user id
   var result = {
       id : 0,
       nama_cetya: "",
       alamat: "",
       no_kontak: "",
       id_umat1: 0,
       id_umat2: 0,
       active: 0,
   }

        var [apps, err] = await model_apps.getAll();
        var [pengajak, err] = await model_umat.getAll();

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

//delete
router.post('/delete', async function (req, res){
    var [curr, err]= await model.deletePhone(req.body.id_app)

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({
        status: "SUCCESS"
    }));
})


module.exports = router

