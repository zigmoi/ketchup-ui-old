import { Empty, Icon, Popover, Tag } from 'antd';
import React from 'react';

function AdditionalInfo(props) {
    let detailsView;
    if (props.createdOn || props.createdBy || props.lastUpdatedOn || props.lastUpdatedBy) {
        detailsView = (
            <React.Fragment>
                {props.lastUpdatedOn ?
                    <React.Fragment>
                        <label style={{ fontWeight: 'bold' }}>Last Updated On: </label>
                        <Tag color="#2f54eb">{props.lastUpdatedOn}</Tag>
                        <br /><br />
                    </React.Fragment>
                    : null
                }
                {props.lastUpdatedBy ?
                    <React.Fragment>
                        <label style={{ fontWeight: 'bold' }}>Last Updated By: </label>
                        <Tag color="#eb2f96">{props.lastUpdatedBy}</Tag>
                        <br /><br />
                    </React.Fragment>
                    : null
                }
                {props.createdOn ?
                    <React.Fragment>
                        <label style={{ fontWeight: 'bold' }}>Created On: </label>
                        <Tag color="#2f54eb">{props.createdOn}</Tag>
                        <br /><br />
                    </React.Fragment>
                    : null
                }
                {props.createdBy ?
                    <React.Fragment>
                        <label style={{ fontWeight: 'bold' }}>Created By: </label>
                        <Tag color="#eb2f96">{props.createdBy}</Tag>
                    </React.Fragment>
                    : null
                }
            </React.Fragment>);
    } else {
        detailsView = (
            <Empty description={"No Information Found!"} />
        );
    }
    return (
        <Popover placement="bottomRight"
            content={detailsView}>
            <Icon type="info-circle" />
        </Popover>
    );
}

export default AdditionalInfo;