const crypto = require('crypto');
const secp256k1 = require('secp256k1');

/**
 * @param {string} text
 * @returns {string}
 */
exports.hash = (text) => crypto.createHash('sha256').update(text).digest('hex');

/**
 * @param {Array<string>} params
 * @param {Object} obj
 * @returns {string}
 */
exports.generateHashFromObjectParams = (params, obj) => {
    const sortedParams = params.toSorted();
    const hashStr = sortedParams.map((param) => String(obj[param])).join('');
    return this.hash(hashStr);
};

/**
 * @param {string} hash
 * @param {string} privateKey
 * @returns {string}
 */
exports.sing = (hash, privateKey) => {
    const hashBuffer = Buffer.from(hash, 'hex');
    const provateKeyBuffer = Buffer.from(privateKey, 'hex');
    const signature = secp256k1.ecdsaSign(hashBuffer, provateKeyBuffer);
    const signatureHex = Buffer.from(signature.signature).toString('hex');
    return signatureHex;
};
