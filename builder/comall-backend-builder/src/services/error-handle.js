import { statusCode } from './status-code';
import { message } from 'antd';

message.config({
    duration: 2,
});

// const errorMessage = {

// };

export const errorHandle = (error) => {

    message.destroy();
    message.error(error.status === undefined ? 'Request has been terminated Possible causes: the network is offline.' : (error.response && error.response.body && error.response.body.err_msg) || statusCode[error.status]);

};
