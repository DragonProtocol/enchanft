import { useState } from 'react';

import styled from 'styled-components';

import Content from '../components/content';
import Header from '../components/header';

export function About() {
  return (
    <>
      <Header />
      <Content
        title="About"
        renderContent={() => (<div className='flex'>
          <div>Baatarverse is the first randomly generated collection of primitive Mongolian-style digital collections. Each digital collection has different characteristics and attributes, each of which is randomly created by attributes with different rarity according to the intelligent contract, making it unique.</div>
          <div>Baatarverse是随机生成的第一个原始蒙古风格数字藏品的集合。每个数字藏品都具有不同特征和属性，每一个都是由稀有度不同的属性根据智能合约随机创造出的，使其具有唯一性。</div>
        </div>)}
        content={`

Baatarverse是随机生成的第一个原始蒙古风格数字藏品的集合。每个数字藏品都具有不同特征和属性，每一个都是由稀有度不同的属性根据智能合约随机创造出的，使其具有唯一性。`}
      />
    </>
  );
}

export default About;
