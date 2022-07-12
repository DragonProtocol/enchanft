import { useState } from 'react';

import styled from 'styled-components';
import { renderToString } from 'react-dom/server';
import Image from 'next/image';

import Content from '../components/content';
import Header from '../components/header';

const teamData = [
  {
    name: 'Oddie',
    text: `A founder of multi-angle body decoration.Experienced in a wide
range of different industries with the ability to adapt and apply
variety of experience to solve complex problems.Also play the role
of Baatarverse's NFT operator.
一位身饰多角的创始人，在各种不同的行业有丰富的经验，能够适应和应用各种经验来解决复杂的问题，也担任BaatarverseNFT运营者角色`,
  },
  {
    name: 'Yideer',
    text: `Mongolian painter / tattoo artist / trend designer
A professional artist with a large following among the Mongolians.
Yideer's collection of works have a large number of Mongolian humanities, history, customs, as well as modern life, culture, subculture and other themes.
蒙古族画家/纹身艺术家/潮流设计师
在蒙古族中拥有大批追随者的职业艺术家
伊德尔的作品集中拥有着大量的蒙古族人文，历史，风俗，以及现代的生活，文化，亚文化等主题。`,
  },
  {
    name: 'Tony',
    text: `Early investors in Bitcoin, interested in blockchain and NFT development
比特币早期投资者，爱好区块链与NFT开发`,
  },
];

export function Team() {
  return (
    <>
      <Header />

      <Content
        title="Team"
        renderContent={() =>
          teamData.map(({ name, text }) => (
            <Weapper>
              <ImageBox>
                <Image
                  src={`/static/images/${name}.png`}
                  width={110}
                  height={110}
                  layout="fixed"
                  // objectFit='cover'
                  alt={'basic'}
                />
              </ImageBox>
              <div>
                <h2>{name}</h2>
                {text}
              </div>
            </Weapper>
          ))
        }
        //         content={`Oddie
        // A founder of multi-angle body decoration.Experienced in a wide range of different industries with the ability to adapt and apply variety of experience to solve complex problems.Also play the role of Baatarverse's NFT operator.
        // 一位身饰多角的创始人，在各种不同的行业有丰富的经验，能够适应和应用各种经验来解决复杂的问题，也担任BaatarverseNFT运营者角色

        // Yideer
        // Mongolian painter / tattoo artist / trend designer
        // A professional artist with a large following among the Mongolians.
        // Yideer's collection of works have a large number of Mongolian humanities, history, customs, as well as modern life, culture, subculture and other themes.
        // 蒙古族画家/纹身艺术家/潮流设计师
        // 在蒙古族中拥有大批追随者的职业艺术家
        // 伊德尔的作品集中拥有着大量的蒙古族人文，历史，风俗，以及现代的生活，文化，亚文化等主题。

        // Tony
        // Early investors in Bitcoin, interested in blockchain and NFT development
        // 比特币早期投资者，爱好区块链与NFT开发`}
      />
    </>
  );
}

export default Team;

const Weapper = styled.div`
  display: flex;
  margin-bottom: 30px;
  h2 {
    font-weight: bolder;
  }
`;
const ImageBox = styled.div`
  border-radius: 10px;
  overflow: hidden;
  display: inline-block;
  height: 110px;
  flex-shrink: 0;
  margin-right: 15px;
`;
