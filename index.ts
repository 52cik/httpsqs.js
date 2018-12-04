import http from 'http';
import got from 'got';
import Agent from 'agentkeepalive';

interface KeepAliveOptions extends http.AgentOptions {
  keepAlive?: boolean;
  freeSocketTimeout?: number;
  freeSocketKeepAliveTimeout?: number;
  timeout?: number;
  socketActiveTTL?: number;
}

interface HttpsqsOption {
  /** ip 或 域名 */
  host?: string;
  /** 端口，默认 1218 */
  port?: number;
  /** 字符集，默认 utf-8 */
  charset?: 'utf-8' | 'gbk';
  /** 队列名 */
  name?: string;
  /** 授权密码 */
  auth?: string;
  /** keep-alive */
  keepAlive: boolean | KeepAliveOptions;
}

interface FetchOption {
  opt: string;
  data?: string;
  pos?: number;
  num?: number;
}

const boolean = (value: unknown): value is boolean =>
  value === false || value === true;

class HTTPSQS {
  private opts: HttpsqsOption;
  private url: string;
  private agent: any;

  constructor(opts: HttpsqsOption) {
    this.opts = Object.assign(
      {
        host: '127.0.0.1',
        port: 1218,
        // charset: 'utf-8',
        name: '',
        // auth: '',
        keepAlive: false, // 默认开启
      },
      opts,
    );

    // 开启 keep-alive
    if (this.opts.keepAlive) {
      if (boolean(this.opts.keepAlive)) {
        this.agent = new Agent();
      } else {
        this.agent = new Agent(this.opts.keepAlive);
      }
    }

    this.url = `http://${this.opts.host}:${this.opts.port}`;
  }

  private fetch({ opt, data, pos, num }: FetchOption) {
    const query = {
      name: this.opts.name,
      auth: this.opts.auth,
      charset: this.opts.charset,
      opt,
      data,
      pos,
      num,
    };

    return got(this.url, { query, agent: this.agent });
  }

  /**
   * 将文本信息放入一个队列
   * @param text
   */
  async put(text: string) {
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
    if (
      body === 'HTTPSQS_GET_END' ||
      body === 'HTTPSQS_ERROR' ||
      body === 'HTTPSQS_AUTH_FAILED'
    ) {
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
  async view(pos: number) {
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
  async maxqueue(num: number) {
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
  async synctime(num: number) {
    const { body } = await this.fetch({ opt: 'synctime', num });
    if (body === 'HTTPSQS_SYNCTIME_OK') {
      return true;
    }
    return false;
  }
}

export = HTTPSQS;
