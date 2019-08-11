import React, { Component, useContext } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Row, Col, message, Spin, Upload } from 'antd';
import axios from 'axios';

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

class Maven extends Component {

    constructor(props) {
        super(props);
        this.state = {
            settingName: '',
            fileList: [],
            uploading: false
        }
    }

    componentDidMount() {
        document.title = "Maven"
    }

    handleUpload = () => {
        const { fileList, settingName } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('file[]', file);
        });
        formData.append('settingName', settingName);
    
        this.setState({
          uploading: true,
        });

        axios.post('http://localhost:8097/v1/resource/createBuildTool', formData)
        .then((response) => {
            this.setState({ uploading: false, fileList: [], settingName: '' });
            message.success('Maven settings.xml file added.', 5);
        })
        .catch((error) => {
            this.setState({ uploading: false });
            message.error('Maven settings.xml upload error.', 5)
        });
    }

    render = () => {
        const { uploading, fileList } = this.state;
        const props = {
        onRemove: file => {
            this.setState(state => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
                fileList: newFileList,
            };
            });
        },
        beforeUpload: file => {
            this.setState(state => ({
            fileList: [...state.fileList, file],
            }));
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
                            <FormItem {...formItemLayout} label="Setting Name " colon={false}>
                                <Input style={{ fontSize: 20 }} prefix={<Icon type="edit" style={{ fontSize: 20 }} />}
                                    placeholder=" Setting Name "
                                    value={this.state.settingName}
                                    onChange={(e) => { this.setState({ settingName: e.target.value }) }} />
                            </FormItem>

                            <FormItem {...formItemLayout} label="Upload Settings File " colon={false}>
                                <Row type="flex" justify="left" align="left">
                                    <Col>
                                        <Upload {...props} >
                                            <Button>
                                                <Icon type="upload" /> Select Maven Settings.xml File
                                            </Button>
                                        </Upload>
                                    </Col>
                                    <Col style={{ paddingLeft: 10}}>
                                        <Button type="primary" onClick={this.handleUpload}
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
}

export default Maven;