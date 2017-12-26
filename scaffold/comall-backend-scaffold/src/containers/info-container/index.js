import { connect } from 'react-redux';

import { Info } from '../../componnets/info';

const mapStateToProps = (state, props) => ({
    fields: props.entity.result
});

export const InfoContainer = connect(mapStateToProps)(Info);