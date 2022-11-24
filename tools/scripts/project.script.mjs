/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-23 13:33:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-23 22:49:22
 * @Description: file description
 */
import { execSync } from 'child_process';
import chalk from 'chalk';
const projectNameAlias = {
  'collector-page': 'enchanft-collector-page',
  'wl-user': '@ecnft/wl-user-react'
}
const [, , command, name] = process.argv;

if (!command) {
  console.error(chalk.bold.red(`Please enter a specific command`));
  process.exit(1);
}
// 没有指定具体项目，默认运行项目 collector-page
const projectName = projectNameAlias[name] ?? name ?? projectNameAlias['collector-page']
execSync(`pnpm --filter ${projectName} ${command}`, { stdio: 'inherit' });
