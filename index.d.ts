/// <reference types="node" />
import http from 'http';
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
declare class HTTPSQS {
    private opts;
    private url;
    private agent;
    constructor(opts: HttpsqsOption);
    private fetch;
    /**
     * 将文本信息放入一个队列
     * @param text
     */
    put(text: string): Promise<boolean>;
    /**
     * 从一个队列中取出文本信息
     */
    get(): Promise<string | false>;
    /**
     * 查看队列状态
     */
    status(josn?: boolean): Promise<string | false>;
    /**
     * 查看指定队列位置点的内容
     * @param pos
     */
    view(pos: number): Promise<string | false>;
    /**
     * 重置指定队列
     */
    reset(): Promise<boolean>;
    /**
     * 更改指定队列的最大队列数量
     * @param num
     */
    maxqueue(num: number): Promise<boolean>;
    /**
     * 修改定时刷新内存缓冲区内容到磁盘的间隔时间
     * @param num
     */
    synctime(num: number): Promise<boolean>;
}
export = HTTPSQS;
