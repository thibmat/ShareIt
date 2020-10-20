const express = require('express');
const router = express.Router();
const utils = require ("./utils");

//=================================
//             Dropbox
//=================================

router.post("/upload", async (req, res) => {
    let token = req.body.token;
    let path = req.body.path;
    let name = req.body.name;
    utils.upload(token, path, name)
        .then(()=>{
            return res.json({success: true})
        })
});
module.exports = router;
