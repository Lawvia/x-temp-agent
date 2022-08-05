const express = require('express')
const router = express.Router()

const c_panel_users= require('./controller_ms_panel_users')
const c_panel_users_groups= require('./controller_ms_panel_users_groups')
const c_panel_waktu = require('./controller_ms_panel_waktu')
const c_panel_tahun = require('./controller_ms_panel_tahun')
const c_panel_pandita = require('./controller_ms_panel_pandita')

const c_panel_divisi = require('./controller_ms_panel_divisi')
const c_panel_daerah = require('./controller_ms_panel_daerah')

router.use(async function(req, res, next){
    if(!req.isAuthenticated()){
        res.redirect('/panels/auth')
        return
    }
    next()
})

router.use('/ms_panel_users', c_panel_users)
router.use('/ms_panel_users_groups',c_panel_users_groups)
router.use('/ms_panel_waktu', c_panel_waktu)
router.use('/ms_panel_tahun', c_panel_tahun)
router.use('/ms_pandita', c_panel_pandita)
router.use('/ms_divisi', c_panel_divisi)
router.use('/ms_daerah', c_panel_daerah)
module.exports = router