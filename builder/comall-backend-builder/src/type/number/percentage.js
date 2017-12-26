import { NumberType } from './number';
import classNames from 'classnames';

/**
 * 百分比类型
 */
export class PercentageFormat extends NumberType {
    /**
     * 获取展示组件
     */
    getAvailableDisplayComponent(value, displayInfo) {
        const { className } = displayInfo;
        displayInfo = {
            ...displayInfo,
            className: classNames('format-percentage', className)
        };

        let result = parseInt(value * 100000, 10) / 1000 + '%';
        return super.getAvailableDisplayComponent(result, displayInfo);
    }
}
