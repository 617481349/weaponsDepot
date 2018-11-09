export const resizeRem = () => {
    let t = navigator.userAgent;
    let e = document.documentElement.clientWidth || window.innerWidth;
    if (t.indexOf('Windows') > 1) return;
    let n = e / 7.5;
    document.querySelector('html').style.fontSize = n + 'px';
};

export const getParams = (path = window.location.href) => {
    let search = path.split('?');
    const { length } = search;
    search = search[length - 1].split('#')[0];
    const paramsList = search.split('&');
    let params = {};
    paramsList.forEach((v) => {
        const item = v.split('=');
        params[item[0]] = item[1];
    });
    return params;
};