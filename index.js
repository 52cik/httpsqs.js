"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const got_1 = __importDefault(require("got"));
const agentkeepalive_1 = __importDefault(require("agentkeepalive"));
const boolean = (value) => value === false || value === true;
class HTTPSQS {
    constructor(opts) {
        this.opts = Object.assign({
            host: '127.0.0.1',
            port: 1218,
            // charset: 'utf-8',
            name: '',
            // auth: '',
            keepAlive: false,
        }, opts);
        // 开启 keep-alive
        if (this.opts.keepAlive) {
            if (boolean(this.opts.keepAlive)) {
                this.agent = new agentkeepalive_1.default();
            }
            else {
                this.agent = new agentkeepalive_1.default(this.opts.keepAlive);
            }
        }
        this.url = `http://${this.opts.host}:${this.opts.port}`;
    }
    fetch({ opt, data, pos, num }) {
        const query = {
            name: this.opts.name,
            auth: this.opts.auth,
            charset: this.opts.charset,
            opt,
            data,
            pos,
            num,
        };
        return got_1.default(this.url, { query, agent: this.agent });
    }
    /**
     * 将文本信息放入一个队列
     * @param text
     */
    async put(text) {
        const { body } = await this.fetch({ opt: 'put', data: text });
        if (body === 'HTTPSQS_PUT_OK') {
            return true;
        }
        return false;
    }
    /**
     * 从一个队列中取出文本信息
     */
    async get() {
        const { body } = await this.fetch({ opt: 'get' });
        if (body === 'HTTPSQS_GET_END' ||
            body === 'HTTPSQS_ERROR' ||
            body === 'HTTPSQS_AUTH_FAILED') {
            return false;
        }
        return body;
    }
    /**
     * 查看队列状态
     */
    async status(josn = false) {
        const { body } = await this.fetch({ opt: josn ? 'status_json' : 'status' });
        if (body === 'HTTPSQS_ERROR' || body === 'HTTPSQS_AUTH_FAILED') {
            return false;
        }
        return body;
    }
    /**
     * 查看指定队列位置点的内容
     * @param pos
     */
    async view(pos) {
        const { body } = await this.fetch({ opt: 'view', pos });
        if (body === 'HTTPSQS_ERROR' || body === 'HTTPSQS_AUTH_FAILED') {
            return false;
        }
        return body;
    }
    /**
     * 重置指定队列
     */
    async reset() {
        const { body } = await this.fetch({ opt: 'reset' });
        if (body === 'HTTPSQS_RESET_OK') {
            return true;
        }
        return false;
    }
    /**
     * 更改指定队列的最大队列数量
     * @param num
     */
    async maxqueue(num) {
        const { body } = await this.fetch({ opt: 'maxqueue', num });
        if (body === 'HTTPSQS_MAXQUEUE_OK') {
            return true;
        }
        return false;
    }
    /**
     * 修改定时刷新内存缓冲区内容到磁盘的间隔时间
     * @param num
     */
    async synctime(num) {
        const { body } = await this.fetch({ opt: 'synctime', num });
        if (body === 'HTTPSQS_SYNCTIME_OK') {
            return true;
        }
        return false;
    }
}
module.exports = HTTPSQS;
