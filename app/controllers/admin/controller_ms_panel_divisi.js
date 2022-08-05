const express = require('express')
const router = express.Router()
const app_config = require("../../config/app")
const model = require('../../models/model_divisi')
const crypto = require('crypto');
const saltRounds = 10;

router.use(function(req, res, next) {
    res.locals.message_success = req.flash('message_success');
    res.locals.message_fail = req.flash('message_fail');
    res.locals.message_warning = req.flash('message_warning');
    next()
}),

router.get("/", async function (req, res) {
    // var result = groups.list
    res.render('admin/ms_panel_divisi', { user: req.user})
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
    var app_id = req.body.app_id
    var app_name = req.body.app_name
    var nama_mandarin = req.body.nama_mandarin

    var data_input = {
        id: app_id,
        name: app_name,
        nama_mandarin: nama_mandarin
    }
    console.log("ddd", data_input)
    if (!app_id) {//insert
        //check for already exist name
        // var [check, err] = await model.checkUsername(app_name, null);
        // if (check && check.length > 0){
        //     req.flash('message_fail', "App Name already used!")
        //     res.redirect('/panels/admin/ms_divisi')
        //     return
        // }

        var [result, error] = await model.addApps(data_input);
        req.flash('message_success', "Success insert data")
        res.redirect('/panels/admin/ms_divisi')
    } else {//update
        // var [check, err] = await model.checkUsername(app_name, app_id);
        // if (check && check.length > 0){
        //     req.flash('message_fail', "App Name already used!")
        //     res.redirect('/panels/admin/ms_divisi')
        //     return
        // }

        var [result, error] = await model.updateApps(data_input);
        req.flash('message_success', "Success update data")
        res.redirect('/panels/admin/ms_divisi')
    }
})




module.exports = router

