import { useState } from 'react';

import styled from 'styled-components';

import Content from '../components/content';
import Header from '../components/header';

export function RoadMap() {
  return (
    <>
      <Header />

      <Content
        title="RoadMap"
        content={`The goal is to be a cultural brand of meta-universe.\nFashion clothing release\nCross-border joint name\nThe brand store was officially established\nAnimation, film and television, music, games...\n\n做元宇宙文化品牌\n潮流服饰发布\n跨界联名\n品牌店铺正式成立\n动漫、影视、音乐、游戏……`}
      />
    </>
  );
}

export default RoadMap;
