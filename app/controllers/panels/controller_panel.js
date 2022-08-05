const express = require('express')
const router = express.Router()

const c_change_password = require('./controller_change_password')
const c_umat = require('./controller_umat')
const c_cetya = require('./controller_cetya')
const c_kelas = require('./controller_kelas')

const c_admin = require('../admin/controller_admin')
const c_auth = require('./controller_auth')

// const model = require('../../models/model_messages')

router.use("/admin", c_admin)
router.use('/auth', c_auth)

router.use(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/panels/auth')
        return
    }
    next()
});

router.get('/', async function (req, res) {
    // res.redirect('/panels/admin/ms_panel_users', { user: req.user })
    // return

    //get count
    // var [total, err] = await model.getTotalMessage();
    // var [send, err] = await model.getTotalSend();
    // var [receive, err] = await model.getTotalReceive();
    // var [byApi, err] = await model.getSendByApi();
    // var [byUser, err] = await model.getSendByUser();
    // var [success, err] = await model.getSuccess();
    // var [failed, err] = await model.getFailed();

    res.render("pages/welcome", { 
        user: req.user,
        total: "total",
        send: "total",
        received: "total",
        byApi: "total kelas",
        byUser: "byUser",
        success: "success",
        failed: "failed"
    })
});

router.use('/change_password', c_change_password)
router.use('/umat', c_umat)
router.use('/cetya', c_cetya)
router.use('/kelas', c_kelas)
// router.use('/template', c_template)
// router.use('/scenario', c_scenario)
// router.use('/compose', c_compose)
// router.use('/messages', c_messages)
// router.use('/logs', c_log)



module.exports = router