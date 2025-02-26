const bip39 = require('bip39');
const HDKey = require('hdkey');

const HD_PATH = "m/44'/2909'/0'/0";

/**
 * @typedef {Object} WalletData
 * @property {string} mnemonic
 * @property {string} seed
 */

/**
 * @param {string} mnemonic
 * @returns {Promise<WalletData>}
 */
exports.walletDataFromMnemonic = async (mnemonic) => {
    const seedBuffer = await bip39.mnemonicToSeed(mnemonic);
    const seed = seedBuffer.toString('hex');
    return { mnemonic, seed };
};

/**
 * @returns {Promise<WalletData>}
 */
exports.newWalletData = async () => {
    const mnemonic = bip39.generateMnemonic();
    return this.walletDataFromMnemonic(mnemonic);
};

/**
 * @param {string} seed
 * @returns {HDKey}
 */
exports.hdWallet = (seed) => {
    const seedBuffer = Buffer.from(seed, 'hex');
    const hdWallet = HDKey.fromMasterSeed(seedBuffer);
    return hdWallet;
};

/**
 * @param {HDKey} hdWallet
 * @param {number} index
 * @returns {HDKey}
 */
exports.generateKeyPair = (hdWallet, index) => {
    const keyPair = hdWallet.derive(`${HD_PATH}/${index}`);
    return keyPair;
};
