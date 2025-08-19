import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import React from 'react';

// 创建一个自定义的可写流，用于将流内容拼接成字符串
class StringWritable extends Writable {
    data: string = '';
    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        this.data += chunk.toString();
        callback();
    }
}

export default function renderToStream(jsx: React.ReactElement): Promise<string> {
    return new Promise((resolve, reject) => {
        const writableStream = new StringWritable();

        const { pipe } = renderToPipeableStream(jsx, {
            onAllReady() {
                pipe(writableStream);
            },
            onError(err) {
                reject(err);
            },
        });

        writableStream.on('finish', () => {
            resolve(writableStream.data);
        });

        writableStream.on('error', (err) => {
            reject(err);
        });
    });
}
