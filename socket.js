const WebSocket = require('ws');
const webUtils = require('./web-utils');
const { v4: uuidv4 } = require('uuid');

class OnoSocketClient {
    #id;
    #subscribed;
    #pingInterval;

    /**
     * @param {string} [coreHost]
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

        this.socket = new WebSocket(`${this.coreHost}?node-id=${this.#id}`);

        this.socket.on('open', () => {
            this.#subscribed = true;
            this.#pingInterval = setInterval(() => {
                this.socket.ping();
            }, 30000);
        });

        this.socket.on('close', () => {
            this.#subscribed = false;
            clearInterval(this.#pingInterval);
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
