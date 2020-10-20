const fs = require('fs');
let path = require('path');
const { Dropbox } = require('dropbox');

module.exports = {
    upload: async function (accessToken, lien, name) {
        let dbx = new Dropbox({accessToken});
        fs.readFile( lien, (err, contents) => {
            if (err) {
                console.log('Error: ', err);
            }
            return dbx.filesUpload({ path: '/Applications/VideoShareIt/'+name, contents })
                .then((response) => {
                    console.log(response);
                    return true;
                })
                .catch((uploadErr) => {
                    console.log(uploadErr);
                    return false;
                });
        });
    }
}
