/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-23 13:33:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-25 19:18:08
 * @Description: file description
 */
import { execSync } from 'child_process';
import chalk from 'chalk';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const projectAlias = require('../../project.alias.json');

const [, , command, ...args] = process.argv;
const name = args.pop()

if (!command) {
  console.error(chalk.bold.red(`Please enter a specific command`));
  process.exit(1);
}
// 没有指定具体项目，默认运行项目 collector-page
const projectName = projectAlias[name] ?? name
const str = `pnpm --filter ${projectName} exec ${command} ${args.join(" ")}`
console.log(`script: ${str}`);
execSync(str, { stdio: 'inherit' });
