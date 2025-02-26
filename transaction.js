const Big = require('big.js');
const cryptoUtils = require('./crypto-utils');

const HASH_PARAMS = ['from', 'to', 'timestamp', 'amount'];
const TRANSACTION_FEE_PERCENT = 0.0001;
const MAX_TRANSACTION_FEE = 0.01;
let coreHost = new URL('http://core.ono.gg');

/**
 * @param {string} pathname
 * @returns {string}
 */
function getFullUrl(pathname) {
    const url = new URL(coreHost);
    url.pathname = pathname;
    return url.toString();
}

/**
 * @typedef {import('hdkey')} HDNode
 */

/**
 * @param {URL} url
 */
exports.setCoreHost = (url) => {
    coreHost = url;
};

/**
 * @param {number} amount
 * @returns {number}
 */
exports.calculateFee = (amount) => {
    const fee = Big(amount).times(TRANSACTION_FEE_PERCENT).toNumber();
    return Math.min(fee, MAX_TRANSACTION_FEE);
};

/**
 * @typedef {Object} Transaction
 * @property {string} hash
 * @property {string} from
 * @property {string} to
 * @property {number} amount
 * @property {number} fee
 * @property {number} timestamp
 * @property {string} signature
 */

/**
 * @param {string} to
 * @param {number} amount
 * @param {Object} keyPair
 * @param {string} keyPair.publicKey
 * @param {string} keyPair.privateKey
 * @returns {Transaction}
 */
exports.generateTransaction = (to, amount, keyPair) => {
    const newTransaction = {
        from: keyPair.publicKey,
        timestamp: Math.round(Date.now() / 1000),
        to,
        amount: Number(amount),
        fee: this.calculateFee(amount),
    };
    newTransaction.hash = cryptoUtils.generateHashFromObjectParams(HASH_PARAMS, newTransaction);
    newTransaction.signature = cryptoUtils.sing(newTransaction.hash, keyPair.privateKey);
    // @ts-ignore
    return newTransaction;
};

/**
 * @param {Transaction} transactionData
 */
exports.sendTransaction = async (transactionData) => {
    const url = getFullUrl('/transaction/init');
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(transactionData),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
};
