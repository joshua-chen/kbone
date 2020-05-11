/* eslint-disable no-useless-escape */
/* eslint-disable eol-last */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable one-var */
/* eslint-disable no-array-constructor */
/* eslint-disable no-redeclare */
/* eslint-disable block-scoped-var */
/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-use-before-define */
/* eslint-disable func-names */
import {
    dateFormat
} from './Util';

const methods = {
    required(val, arg) {
        const isRequired = arg === undefined ? true : arg;
        if (Array.isArray(val)) {
            if (val.length !== 0) {
                let valid = true;
                // eslint-disable-next-line no-plusplus
                for (let i = 0, l = val.length; i < l; i++) {
                    // eslint-disable-next-line no-undef
                    valid = this.required(val[i], isRequired);
                    if ((isRequired && !valid) || (!isRequired && valid)) {
                        break;
                    }
                }
                return valid;
            }
            return !isRequired;
        } else if (typeof val === 'number' || typeof val === 'function') {
            return isRequired;
        } else if (typeof val === 'boolean') {
            return val === isRequired;
        } else if (typeof val === 'string') {
            return isRequired ? (val.length > 0) : (val.length <= 0);
        } else if (val !== null && typeof val === 'object') {
            return isRequired ? (Object.keys(val).length > 0) : (Object.keys(val).length <= 0);
        } else if (val === null || val === undefined) {
            return !isRequired;
        }
        return !isRequired;
    },
    /**
     * 判断输入值是否为空
     */
    optional(val) {
        return !this.required(val) && 'dependency-mismatch';
    },
    pattern(val, pat) {
        if (typeof val !== 'string' || !val) {
            return true;
        }
        if (typeof pat !== 'string') {
            return false;
        }
        const match = pat.match(new RegExp('^/(.*?)/([gimy]*)$'));
        if (!match) {
            return false;
        }
        return new RegExp(match[1], match[2]).test(val);
    },
    minlength(val, min) {
        if (typeof val === 'string') {
            return this.isInteger(min, 10) && val.length >= parseInt(min, 10);
        } else if (Array.isArray(val)) {
            return val.length >= parseInt(min, 10);
        } else if (val === null) {
            return true;
        }
        return false;
    },
    maxlength(val, max) {
        if (typeof val === 'string') {
            return this.isInteger(max, 10) && val.length <= parseInt(max, 10);
        } else if (Array.isArray(val)) {
            return val.length <= parseInt(max, 10);
        } else if (val === null) {
            return true;
        }
        return false;
    },
    rangelength(val, arg) {
        return (val.length >= arg[0] && val.length <= arg[1]);
    },
    min(val, arg) {
        return this.optional(val) || val === null || (!isNaN(+(val)) && !isNaN(+(arg)) && (+(val) >= +(arg)));
    },
    max(val, arg) {
        return this.optional(val) || val === null || (!isNaN(+(val)) && !isNaN(+(arg)) && (+(val) <= +(arg)));
    },
    /**
     * 验证一个值范围[min, max]
     */
    range(val, arg) {
        return this.optional(val) || (val >= arg[0] && val <= arg[1]);
    },
    isInteger(val) {
        return this.optional(val) || /^(-?[1-9]\d*|0)$/.test(val);
    },
    /**
     * 验证十进制数字
     */
    isNumber(val) {
        return this.optional(val) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(val);
    },

    /** *
     * 验证金额
     */
    isMoney(val) {
        return this.optional(val) || /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(val);
    },
    isPhone(val) {
        return this.isMobile(val) || this.isFixPhone(val);
    },
    isMobile(val) {
        return /^[1][3,4,5,7,8][0-9]{9}$/.test(val);
    },
    isFixPhone(val) {
        return /^0\d{2,3}-?\d{7,8}$/.test(val);
    },
    isChinese(val) {
        return this.optional(val) || /^[\u4E00-\u9FA5]+$/.test(val);
    },
    isEqual: (val1, val2) => {
        if (val1 == null && val2 == null) {
            return true;
        }

        if (val1 != null && val2 == null) return false;
        if (val1 == null && val2 != null) return false;


        const t = typeof val1;
        if (t == 'object') {
            return JSON.stringify(val1) == JSON.stringify(val2);
        }

        return val1 == val2;
    },
    isIdCard(val) {
        const vcity = {
            11: '北京',
            12: '天津',
            13: '河北',
            14: '山西',
            15: '内蒙古',
            21: '辽宁',
            22: '吉林',
            23: '黑龙江',
            31: '上海',
            32: '江苏',
            33: '浙江',
            34: '安徽',
            35: '福建',
            36: '江西',
            37: '山东',
            41: '河南',
            42: '湖北',
            43: '湖南',
            44: '广东',
            45: '广西',
            46: '海南',
            50: '重庆',
            51: '四川',
            52: '贵州',
            53: '云南',
            54: '西藏',
            61: '陕西',
            62: '甘肃',
            63: '青海',
            64: '宁夏',
            65: '新疆',
            71: '台湾',
            81: '香港',
            82: '澳门',
            91: '国外'
        };
        const checkIdentityCode = function (obj) {
            // 是否为空
            if (obj === '') {
                return false;
            }
            // 校验长度，类型
            if (isCardNo(obj) === false) {
                return false;
            }
            // 检查省份
            if (checkProvince(obj) === false) {
                return false;
            }
            // 校验生日
            if (checkBirthday(obj) === false) {
                return false;
            }
            // 检验位的检测
            if (checkParity(obj) === false) {
                return false;
            }
            return true;
        };
        // 检查号码是否符合规范，包括长度，类型
        // eslint-disable-next-line no-var
        function isCardNo(obj) {
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            const reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
            if (reg.test(obj) === false) {
                return false;
            }
            return true;
        }
        // 取身份证前两位,校验省份
        var checkProvince = function (obj) {
            const province = obj.substr(0, 2);
            if (typeof vcity[province] == 'undefined') {
                return false;
            }
            return true;
        };
        // 检查生日是否正确
        var checkBirthday = function (obj) {
            const len = obj.length;
            // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
            if (len == '15') {
                const re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
                var arr_data = obj.match(re_fifteen);
                var year = arr_data[2];
                var month = arr_data[3];
                var day = arr_data[4];
                var birthday = new Date(`19${year}/${month}/${day}`);
                return checkBirthday(`19${year}`, month, day, birthday);
            }
            // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
            if (len == '18') {
                const re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                var arr_data = obj.match(re_eighteen);
                var year = arr_data[2];
                var month = arr_data[3];
                var day = arr_data[4];
                var birthday = new Date(`${year}/${month}/${day}`);
                return checkBirthday(year, month, day, birthday);
            }
            return false;
        };
        // 校验日期
        var checkBirthday = function (year, month, day, birthday) {
            const now = new Date();
            const now_year = now.getFullYear();
            // 年月日是否合理
            if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
                // 判断年份的范围（3岁到100岁之间)
                const time = now_year - year;
                if (time >= 0 && time <= 130) {
                    return true;
                }
                return false;
            }
            return false;
        };
        // 校验位的检测
        var checkParity = function (obj) {
            // 15位转18位
            obj = changeFivteenToEighteen(obj);
            const len = obj.length;
            if (len == '18') {
                const arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                const arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                let cardTemp = 0,
                    i,
                    valnum;
                for (i = 0; i < 17; i++) {
                    cardTemp += obj.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[cardTemp % 11];
                if (valnum == obj.substr(17, 1)) {
                    return true;
                }
                return false;
            }
            return false;
        };
        // 15位转18位身份证号
        var changeFivteenToEighteen = function (obj) {
            if (obj.length == '15') {
                const arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                const arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                let cardTemp = 0,
                    i;
                obj = `${obj.substr(0, 6)}19${obj.substr(6, obj.length - 6)}`;
                for (i = 0; i < 17; i++) {
                    cardTemp += obj.substr(i, 1) * arrInt[i];
                }
                obj += arrCh[cardTemp % 11];
                return obj;
            }
            return obj;
        };

        return checkIdentityCode(val);
    },

    // 判断是否含有大写字母
    hasUpperCase: (str) => {
        const result = str.match(/^.*[A-Z]+.*$/);
        return result != null;
    },

    // 判断是否含有小写字母
    hasLowerCase: (str) => {
        const result = str.match(/^.*[a-z]+.*$/);
        return result != null;
    },
    noDuplicate: (values) => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values.length; j++) {
                if (values[i] == values[j] && i != j) {
                    return false;
                }
            }
        }
        return true;
    },
    isEmail(val) {
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(val);
    },
    isPassword(val) {
        let pattern = /^(?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[^a-zA-Z0-9]).{6,30}$/; // 数字、字母或符号
        return pattern.test(val);
    },
    isUrl(val) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(val);
    },
    /**
     * 验证日期格式
     */
    isDate(val) {
        return !/Invalid|NaN/.test(new Date(val).toString());
    },
    /**
     * 验证时间
     */
    afterDate(val, arg) {
        var result = this.compareDate(val, arg);
        return result == 1 || result == 0;
    },
    /**
     * 验证时间
     */
    beforeDate(val, arg) {
        var result = this.compareDate(val, arg);
        return result == -1 || result == 0;
    },

    compareDate(date1, date2) {
        date1 = dateFormat(new Date(date1), 'yyyy-MM-dd');
        date2 = dateFormat(new Date(date2), 'yyyy-MM-dd');

        date1 = Date.parse(date1);
        date2 = Date.parse(date2);

        if (date1 > date2) {
            return 1;
        } else if (date1 < date2) {
            return -1;
        }
        return 0;
    }
};


/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
export default class Validator {
    static required = (val) => {
        return {
            isValid: methods.required(val),
            message: '为必填项'
        };
    }
    static pattern = (val, arg) => {
        return {
            isValid: methods.pattern(val, arg),
            message: `不满足正则表达式${arg.toString()}`
        };
    }
    static minlength = (val, arg) => {
        return {
            isValid: methods.minlength(val, arg),
            message: `的长度必须大于等于${arg}`
        };
    }
    static maxlength = (val, arg) => {
        return {
            isValid: methods.maxlength(val, arg),
            message: `的长度必须小于等于${arg}`
        };
    }
    static min = (val, arg) => {
        return {
            isValid: methods.min(val, arg),
            message: `的值必须大于等于${arg}`
        };
    }
    static max = (val, arg) => {
        return {
            isValid: methods.max(val, arg),
            message: `的值必须小于等于${arg}`
        };
    }


    static mail = (val) => {
        return {
            isValid: methods.isEmail(val),
            message: '的值必须为邮件格式'
        };
    }

    static password = (val) => {
        return {
            isValid: methods.isPassword(val),
            message: '格式不正确'
        };
    };

    static chinese = (val) => {
        return {
            isValid: methods.isChinese(val),
            message: '必须为中文字符'
        };
    };
    static number = (val) => {
        return {
            isValid: methods.isNumber(val),
            message: '的值必须为数字'
        };
    }
    static money = (val) => {
        return {
            isValid: methods.isMoney(val),
            message: '的值必须为金额'
        };
    }

    static phone = (val) => {
        return {
            isValid: methods.isPhone(val),
            message: '格式不正确',
        };
    }

    static fixphone = (val) => {
        return {
            isValid: methods.isFixPhone(val),
            message: '格式不正确',
        };
    }

    static mobile = (val) => {
        return {
            isValid: methods.isMobile(val),
            message: '格式不正确',
        };
    }

    static idcard = (val) => {
        return {
            isValid: methods.isIdCard(val),
            message: '格式不正确',
        };
    }

    static
    default = {
        isValid: true,
        message: '',
    }

    static equal = (val1, val2) => {
        var isValid = methods.isEqual(val1, val2);
        return {
            isValid,
            message: '不相同',
        };
    }


    static validate = (method, name, val, val2) => {
        let result = {
            isValid: true
        };
        if (typeof method == 'string') {
            result = Validator[method](val, val2);
        } else if (typeof method == 'function') {
            result = method(val, val2);
        }

        return {
            isValid: result.isValid,
            message: name + result.message,
        };
    };
}