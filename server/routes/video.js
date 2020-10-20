const express = require('express');
const router = express.Router();
const multer = require('multer');
let ffmpeg =  require('fluent-ffmpeg');
const path = require('path');

// STORAGE MULTER CONFIG POUR LE FICHIER SOURCE
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/sources/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mov' && ext !== '.mxf' && ext !== '.mp4'){
            return cb(res.status(400).end('L\'extension de votre fichier ne semble pas correcte'), false)
        }
        cb(null,true)
    }
});
const upload = multer({storage: storage}).single("file");

//=================================
//             Video
//=================================


router.post("/uploadfiles", (req, res) => {

    upload (req, res, err => {
        if(!req.file) return res.send('La sauvegarde du fichier a échoué');
        if(err) {
            return res.json({success: false, err})
        }
        return res.json({success: true, url: req.file.path, fileName: req.file.filename })
    })
});

router.post("/thumbnail", (req, res) => {

    let filePath= "";
    let filename = "";
    let fileDuration = "";
    let codecName = "";
    let width = "";
    let height = "";
    let timecode = "";
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata);
        fileDuration = metadata.format.duration;
        codecName = metadata.streams[0].codec_name;
        width = metadata.streams[0].width;
        height = metadata.streams[0].height;
        timecode = metadata.streams[0].timecode;
    })

    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log('L\'app est en train de générer les miniatures ' + filenames.join(', '));
            filePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function(){
            console.log('Miniatures générées');
            return res.json({success:true, url: filePath, fileDuration:fileDuration, codecName: codecName, width: width, height: height, timecode: timecode})
        })
        .on('error', function(err){
            console.error(err);
        })
        .screenshot({
            count:3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            filename: 'thumbnail-%b.png'
        })
});

router.post("/process", (req, res) => {

        let filename = req.body.name;
        let ext = path.parse(filename).ext;
        let name = path.parse(filename).name;
        let newName = name + '_h264.mov';
        function preset(command) {
            command.size('1920x?').aspect('16:9').autopad('black').videoCodec('libx264').audioCodec('libmp3lame');
        }
        ffmpeg(req.body.path).preset(preset)
            .on('progress', function(progress) {
                console.log('Processing: ' + progress.percent + '% done');
            })
            .on('stderr', function(stderrLine) {
                console.log('Stderr output: ' + stderrLine);
            })
            .on('error', function(err, stdout, stderr) {
                console.log('Cannot process video: ' + err.message);
            })
            .on('end', function(stdout, stderr) {
                let filePath = "uploads/done/"+newName;
                console.log('Transcoding succeeded ! ' + filePath);
                return res.json({success:true, url: filePath, name: newName})
            })
            .save('uploads/done/'+newName);
});

module.exports = router;
