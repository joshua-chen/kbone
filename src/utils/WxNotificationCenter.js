/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-var */
/**
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 *
 * github地址: https://github.com/icindy/WxNotificationCenter
 *
 * for: 微信小程序通知广播模式类,降低小程序之间的耦合度
 * detail : http://weappdev.com/t/wxnotificationcenter/233
 */
// 存放
// eslint-disable-next-line no-underscore-dangle
// eslint-disable-next-line prefer-const
let __notices = [];
/**
 * addNotification
 * 注册通知对象方法
 *
 * 参数:
 * name： 注册名，一般let在公共类中
 * selector： 对应的通知方法，接受到通知后进行的动作
 * observer: 注册对象，指Page对象
 */
function addNotification(name, selector, observer) {
    if (name && selector) {
        if (!observer) {
            console.log("addNotification Warning: no observer will can't remove notice");
        }
        console.log(`addNotification:${name}`);
        const newNotice = {
            name,
            selector,
            observer
        };

        // eslint-disable-next-line no-use-before-define
        addNotices(newNotice);
    } else {
        console.log('addNotification error: no selector or name');
    }
}

/**
 * 仅添加一次监听
 *
 * 参数:
 * name： 注册名，一般let在公共类中
 * selector： 对应的通知方法，接受到通知后进行的动作
 * observer: 注册对象，指Page对象
 */
function addOnceNotification(name, selector, observer) {
    if (__notices.length > 0) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < __notices.length; i++) {
            const notice = __notices[i];
            if (notice.name === name) {
                if (notice.observer === observer) {
                    return;
                }
            }
        }
    }
    this.addNotification(name, selector, observer);
}

function addNotices(newNotice) {
    // if (__notices.length > 0) {
    //     for (var i = 0; i < __notices.length; i++) {
    //         var hisNotice = __notices[i];
    //         //当名称一样时进行对比，如果不是同一个 则放入数组，否则跳出
    //         if (newNotice.name === hisNotice.name) {
    //             if (!cmp(hisNotice, newNotice)) {
    //                 __notices.push(newNotice);
    //             }
    //             return;
    //         }else{
    //             __notices.push(newNotice);
    //         }

    //     }
    // } else {

    // }

    __notices.push(newNotice);
}

/**
 * removeNotification
 * 移除通知方法
 *
 * 参数:
 * name: 已经注册了的通知
 * observer: 移除的通知所在的Page对象
 */

function removeNotification(name, observer) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < __notices.length; i++) {
        const notice = __notices[i];
        if (notice.name === name) {
            if (notice.observer === observer) {
                __notices.splice(i, 1);
                return;
            }
        }
    }
}

/**
 * postNotificationName
 * 发送通知方法
 *
 * 参数:
 * name: 已经注册了的通知
 * info: 携带的参数
 */

function postNotificationName(name, info) {
    console.log(`postNotificationName:${name}`);
    if (__notices.length == 0) {
        console.log("postNotificationName error: u hadn't add any notice.");
        return;
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < __notices.length; i++) {
        const notice = __notices[i];
        if (notice.name === name) {
            notice.selector(info);
        }
    }
}

module.exports = {
    addNotification,
    removeNotification,
    postNotificationName,
    addOnceNotification
};
