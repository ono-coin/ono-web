const webUtils = require('./web-utils');
const { v4: uuidv4 } = require('uuid');

class OnoSocketClient {
    #id;
    #subscribed;

    /**
     * @param {string} [coreHost]s
     */
    constructor(coreHost) {
        this.coreHost = coreHost ? webUtils.toWsAddress(coreHost) : 'ws://core.ono.gg';
        this.#subscribed = false;
        this.#id = uuidv4();
    }

    /**
     * @param {function} handler
     * @param {function} errorHandler
     */
    subscribe(handler, errorHandler) {
        if (this.#subscribed) return;

        this.socket = new WebSocket(`${this.coreHost}/node-id=${this.#id}`);

        this.socket.on('open', () => {
            this.#subscribed = true;
        });

        this.socket.on('close', () => {
            this.#subscribed = false;
        });

        this.socket.on('message', async (message) => {
            try {
                const parsedMessage = JSON.parse(message.toString());
                handler(parsedMessage, this);
            } catch (error) {
                errorHandler(error);
            }
        });
    }

    /**
     * @param {string} address
     */
    setCoreHost(address) {
        this.coreHost = webUtils.toWsAddress(address);
    }

    disconnect() {
        this.socket.close();
        this.#subscribed = false;
    }
}

module.exports = OnoSocketClient;
