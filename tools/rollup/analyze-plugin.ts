/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-24 14:28:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-24 14:28:33
 * @Description: file description
 */
import chalk from 'chalk';
import { logger } from '@nrwl/devkit';

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Byte';
    const k = 1000;
    const dm = 3;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function analyze() {
    return {
        name: 'rollup-plugin-analyzer',
        renderChunk(source, chunk) {
            const sourceBytes = formatBytes(source.length);
            const fileName = chunk.fileName;
            logger.info(`  ${chalk.bold(fileName)} ${chalk.cyan(sourceBytes)}`);
        },
    };
}
