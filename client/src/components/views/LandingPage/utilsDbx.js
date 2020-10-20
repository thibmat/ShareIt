import axios from 'axios';
const { Dropbox } = require('dropbox');
let CLIENT_ID = 'vdegf7xl2amz00f';
let dbx = new Dropbox({ clientId: CLIENT_ID });
let authUrl = dbx.auth.getAuthenticationUrl('http://localhost:3000/');
function parseQueryString(str) {
    const ret = Object.create(null);

    if (typeof str !== 'string') {
        return ret;
    }

    str = str.trim().replace(/^(\?|#|&)/, '');

    if (!str) {
        return ret;
    }

    str.split('&').forEach((param) => {
        const parts = param.replace(/\+/g, ' ').split('=');
        // Firefox (pre 40) decodes `%3D` to `=`
        // https://github.com/sindresorhus/query-string/pull/37
        let key = parts.shift();
        let val = parts.length > 0 ? parts.join('=') : undefined;

        key = decodeURIComponent(key);

        val = val === undefined ? null : decodeURIComponent(val);

        if (ret[key] === undefined) {
            ret[key] = val;
        } else if (Array.isArray(ret[key])) {
            ret[key].push(val);
        } else {
            ret[key] = [ret[key], val];
        }
    });

    return ret;
}
function getAccessTokenFromUrl() {
    return parseQueryString(window.location.hash).access_token;
}
function isAuthenticated() {
    return !!getAccessTokenFromUrl();
}
let accessToken = getAccessTokenFromUrl();
let isAuthent = isAuthenticated();
let level = 0;

const uploadAndTranscode = async (path, fileName) => {
    const variable = {
        path: path,
        name: fileName
    }
    let reponse = await axios.post('api/video/process', variable)
    const variable2 = {
        token: accessToken,
        path: reponse.data.url,
        name: reponse.data.name
    }
    let reponse2 = await upload('/api/dbx/upload', variable2)
    return !!reponse2;
}
const upload = async (path, fileName) => {
    const variable = {
        token: accessToken,
        path: path,
        name:fileName
    }
    let reponse = await axios.post('/api/dbx/upload', variable)
    return !!reponse.data.success;
}
const getLevel = () => {
    level = isAuthenticated()?2:1;
    return level;
}
export {
    authUrl,
    accessToken,
    isAuthent,
    uploadAndTranscode,
    upload,
    getLevel
}


