import React, {useState} from 'react'
import { Typography, Icon, Row, Col, Button, Spin } from 'antd';
import { DropboxOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import Dropzone from 'react-dropzone';
const utils = require ("./utilsDbx");

function LandingPage() {
    const [filePath, setFilePath] = useState("");
    const [fileName, setFileName] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [duration, setDuration] = useState("");
    const [codecName, setCodecName] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [timecode, setTimecode] = useState("");
    const [level, setLevel] = useState(utils.getLevel);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    let isAuthenticated = utils.isAuthent;
    let authUrl = utils.authUrl;
    const uploadAndTrans = async (e) =>{
        e.preventDefault();
        setLoading2(true);
        let reponse = await utils.uploadAndTranscode(filePath, fileName);
        if(reponse) {
            setLoading2(false);
            window.location.reload(false);
        }

    }
    const upload = async (e) =>{
        e.preventDefault();
        setLoading3(true);
        let reponse = await utils.upload(filePath, fileName);
        if(reponse) {
            setLoading3(false);
            window.location.reload(false);
        }
    }
    const onDrop = (files) => {
        setLoading(true);
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0]);
        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    setFilePath(response.data.url);
                    setFileName(response.data.fileName);
                    const variable = {
                        url: response.data.url,
                    }
                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if(response.data.success) {
                                setThumbnail(response.data.url);
                                setDuration(response.data.fileDuration);
                                setCodecName(response.data.codecName);
                                setWidth(response.data.width);
                                setHeight(response.data.height);
                                setTimecode(response.data.timecode);
                                setLevel(3);
                                setLoading(false);
                            } else {
                                alert('Echec de la création des miniatures')
                            }
                        })
                } else {
                    alert('Erreur lors de la sauvegarde du fichier')
                }
            })
    }

    if (!loading){
        return (
            <div style={{ maxWidth: '100%', margin: '2rem auto'}}>
                <br/>
                <Row gutter={24} style={{ background: '#ECECEC', padding: '30px', display:'flex', alignItems: 'middle', opacity: level===1?'100%':'20%', transition: 'opacity 1s'}}>
                    <div style={{ width:'100px', height:'100px', border: '1px solid black', borderRadius: '50%', justifySelf: 'start', display:'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px'}}>
                        <span>1</span>
                    </div>
                    {!isAuthenticated &&
                    <div style={{padding:'30px', wordBreak: 'break-all', justifySelf: 'center', flexGrow: '1', textAlign: 'center'}} id={"pre-auth-section"}>
                        <a href={authUrl} id="authlink" className="button">
                            Pour commencer, connectez vous à votre compte Dropbox afin de pouvoir uploader votre video.
                            <DropboxOutlined />
                        </a>
                    </div>
                    }
                    {isAuthenticated &&
                    <div style={{background: '#ECECEC', padding:'30px', wordBreak: 'break-all', justifySelf: 'center', flexGrow: '1', textAlign: 'center'}} id={"authed-section"}>
                        <p>Vous êtes connecté à votre compte Dropbox, il faut maintenant choisir une vidéo à envoyer.</p>
                    </div>
                    }
                </Row>
                <br/>
                <Row gutter={24} style={{ background: '#ECECEC', padding: '30px', display:'flex', alignItems: 'middle', opacity: level>1?'100%':'20%', transition: 'opacity 1s'}}>
                    <div style={{ width:'100px', height:'100px', border: '1px solid black', borderRadius: '50%', justifySelf: 'start', display:'flex', flexShrink: '0', alignItems: 'middle', justifyContent: 'center', fontSize: '60px'}}>
                        <span>2</span>
                    </div>
                    <Col span={12} style={{ borderRight: '1px solid black'}}>
                        <Dropzone onDrop={onDrop} multiple={false}>
                            {({ getRootProps, getInputProps}) => (
                                <Col span={24} style={{margin:'auto'}} >
                                    <div style={{width: '50%', margin: 'auto', height:'240px', border:'1px solid lightgray', cursor: 'pointer', borderRadius: '2%', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', display:level>2?'none':'flex'}} {...getRootProps()}>
                                        <input {...getInputProps()}/>
                                        <Icon type="plus" style={{minWidth:'100%', fontSize: '3rem'}}/>
                                        <Typography style={{minWidth:'100%', textAlign: 'center', fontStyle:'italic', fontWeight:'bold'}}>Cliquer ici pour commencer le transfert d'un fichier vidéo</Typography>
                                    </div>
                                </Col>
                            )}
                        </Dropzone>
                        {thumbnail !== "" &&
                        <Col span={24}>
                            <div style={{width: '50%', margin: 'auto', height:'240px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <img src={`http://localhost:5000/${thumbnail}`} alt="miniature" />
                            </div>
                        </Col>
                        }
                    </Col>
                    {thumbnail &&
                    <Col span={12}>
                        <Row gutter={16} style={{margin:'1rem'}}>
                            <Col span={12}>
                                Lien de la vidéo
                            </Col>
                            <Col span={12}>
                                {filePath}
                            </Col>
                        </Row>
                        <Row gutter={16} style={{margin:'1rem'}}>
                            <Col span={12}>
                                Durée de la vidéo
                            </Col>
                            <Col span={12}>
                                {duration}
                            </Col>
                        </Row>
                        <Row gutter={16} style={{margin:'1rem'}}>
                            <Col span={12}>
                                Lien de la miniature
                            </Col>
                            <Col span={12}>
                                {thumbnail}
                            </Col>
                        </Row>
                        <Row gutter={16} style={{margin:'1rem'}}>
                            <Col span={12}>
                                Nom du codec vidéo
                            </Col>
                            <Col span={12}>
                                {codecName}
                            </Col>
                        </Row>
                        <Row gutter={16} style={{margin:'1rem'}}>
                            <Col span={12}>
                                Taille de la vidéo
                            </Col>
                            <Col span={12}>
                                {width} x {height}
                            </Col>
                        </Row>
                        <Row gutter={16} style={{margin:'1rem'}}>
                            <Col span={12}>
                                Timecode
                            </Col>
                            <Col span={12}>
                                {timecode}
                            </Col>
                        </Row>
                    </Col>
                    }
                </Row>
                <br/>
                <Row gutter={24} style={{ background: '#ECECEC', padding: '30px', display:'flex', alignItems: 'middle', opacity: level===3?'100%':'20%', transition: 'opacity 1s'}}>
                    <div style={{ width:'100px', height:'100px', border: '1px solid black', borderRadius: '50%', justifySelf: 'start', display:'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px'}}>
                        <span>3</span>
                    </div>
                    {isAuthenticated &&
                    <div style={{padding:'30px', wordBreak: 'break-all', justifySelf: 'center', flexGrow: '1', textAlign: 'center'}}>
                        <Button variant="outline-info" style={{margin:'1rem'}} onClick={uploadAndTrans}>
                            Envoyer la video sur mon compte Dropbox (avec transcodage en h264)
                            <DropboxOutlined />
                            {loading2 &&
                            <Spin indicator={<LoadingOutlined style={{fontsize:24, margin:'5px'}} spin/>}/>
                            }
                        </Button>
                        <Button variant="outline-info" onClick={upload}>
                            Envoyer la video sur mon compte Dropbox (sans transcodage)
                            <DropboxOutlined />
                            {loading3 &&
                            <Spin indicator={<LoadingOutlined style={{fontsize:24, margin:'5px'}} spin/>}/>
                            }
                        </Button>
                    </div>
                    }
                </Row>
            </div>

        )
    }
    return (
        <div style={{width: '100%', margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt={"Loader"} />
        </div>
    )
}
export default LandingPage

