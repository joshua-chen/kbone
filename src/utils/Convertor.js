/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
export default class Convertor {
    // 保留两位小数
    // 将浮点数四舍五入，取小数点后2位
    static toDecimal(x, precision) {
        // eslint-disable-next-line no-param-reassign
        precision = precision || 2;
        let f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }

        let a = 1;
        for (let i = 0; i < precision; i++) {
            a *= 10;
        }
        f = Math.round(x * a) / a;
        return f;
    }

    // 制保留2位小数，如：2，会在2后面补上00.即2.00
    static toDecimal2(x) {
        // eslint-disable-next-line no-undef
        const f = toDecimal(x, 2);
        if (typeof f === 'boolean' && !f) return false;

        let s = f.toString();
        let rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    }


}