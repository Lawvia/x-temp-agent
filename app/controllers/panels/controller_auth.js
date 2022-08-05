const express = require('express')
const router = express.Router()
const passport= require('passport')
const model_user = require('../../models/model_ms_panel_users');
const saltRounds = 10;
const bcrypt= require('bcrypt')
const axios = require('axios');
const qs = require('qs');

//router to login page
router.get("/", async function(req, res){
    if(req.isAuthenticated()){
        res.redirect('/panels/')
    } else{
        var error= req.session.error
        req.session.error= ""
        res.render("auth/login", {error: error})
    }
})

router.post('/login', async function(req, res, next){
       
    passport.authenticate('local', async function(err, user, info) {
        if(err || !user){
            req.session.error= 'Incorrect username or password!'
            res.redirect('/panels/auth')
            return
        }
        req.login(user, async function(err){
            if(err){
                req.session.error= 'Incorrect username or password!'
                res.redirect('/auth')
                return
            }
            res.redirect('/panels/')
        })
    })
    (req, res, next)
});

router.get('/logout', async function(req, res){
    req.session.destroy(async function (err) {
        req.logout()
        res.redirect('/panels/auth');
    })
});

module.exports = router