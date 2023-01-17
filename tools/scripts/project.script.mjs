/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-23 13:33:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 16:37:16
 * @Description: file description
 */
import { execSync } from 'child_process';
// eslint-disable-next-line import/no-extraneous-dependencies
import chalk from 'chalk';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const path = require('path');
const projects = require('../../project.json');

const [, , command, name] = process.argv;

if (!command) {
  console.error(chalk.bold.red(`Please enter a specific command`));
  process.exit(1);
}
const project = name ? projects[name] : Object.values(projects)[0];
if (!project) {
  console.error(
    chalk.bold.red(
      `Project ${name} not found, please check project.json in home directory`
    )
  );
  process.exit(1);
}
const pkgPath = path.join('../../', project.dir, 'package.json');
// eslint-disable-next-line import/no-dynamic-require
const pkg = require(pkgPath);
const projectName = pkg.name;
execSync(`pnpm --filter ${projectName} ${command}`, { stdio: 'inherit' });
