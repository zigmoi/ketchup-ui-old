import React, { useContext, useState } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin, Upload } from 'antd';
import axios from 'axios';

function Maven() {
    const [settingName, setSettingName] = useState('');
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const FormItem = Form.Item;
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };
    
    function handleUpload() {
        setUploading(true);
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('file[]', file);
        });
        formData.append('settingName', settingName);
    
        axios.post('http://localhost:8097/v1/resource/createBuildTool', formData)
        .then((response) => {
            setUploading(false);
            setSettingName('');
            setFileList([]);
            message.success('Maven settings.xml file added.', 5);
        })
        .catch((error) => {
            setUploading(false);
            message.error('Maven settings.xml upload error.', 5)
        });
    }

    const props = {
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: file => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Row type="flex" justify="center" align="middle" style={{ paddingTop: '2px', paddingBottom: '4px' }}>
                    <Col span={24}>
                        <label style={{ fontWeight: 'bold' }} >Upload Maven Setting.xml File</label>
                        <span>&nbsp;&nbsp;</span>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col span={20}  >
                        <Form style={{ backgroundColor: 'white' }}>
                            <FormItem {...formItemLayout} label="Setting Name" colon={false}>
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 15 }} />}
                                    placeholder="Setting Name"
                                    value={settingName}
                                    onChange={(e) => { setSettingName(e.target.value) }} />
                            </FormItem>

                            <FormItem {...formItemLayout} label="Upload Settings File " colon={false}>
                                <Row type="flex" justify="start" align="top">
                                    <Col>
                                        <Upload {...props} >
                                            <Button>
                                                <Icon type="upload" /> Select Maven Settings.xml File
                                            </Button>
                                        </Upload>
                                    </Col>
                                    <Col style={{ paddingLeft: 10}}>
                                        <Button type="primary" onClick={handleUpload}
                                            disabled={fileList.length === 0} loading={uploading}
                                        >
                                            {uploading ? 'Uploading' : 'Submit'}
                                        </Button>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
        </div>
    );
}

export default Maven;