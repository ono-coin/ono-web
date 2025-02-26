/**
 * @param {string} ip
 * @returns {string}
 */
exports.getIpV4 = (ip) => {
    if (ip.startsWith('::ffff:')) return ip.substring(7);
    return ip;
};

/**
 * @param {string} address
 * @returns {string}
 */
exports.toWsAddress = (address) => {
    if (!/^https?:\/\//i.test(address) && !/^ws?:\/\//i.test(address)) {
        return 'ws://' + address;
    }

    if (/^https:\/\//i.test(address)) {
        return 'wss://' + address.slice(8);
    }
    if (/^http:\/\//i.test(address)) {
        return 'ws://' + address.slice(7);
    }

    return address;
};
