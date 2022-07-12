import { useState } from 'react';

import styled from 'styled-components';

import Content from '../components/content';
import Header from '../components/header';


export function Story() {
  return (
    <>
      <Header />

      <Content
        title="We are a tribe"
        content={`Nomadic world,
Baatarverse universe.
In the gap between free utopia and collapse reality
Nine heroes on the prairie and one shaman
Still struggling to find the power to rebuild their homes.
To construct the meta-universe of the spiritual world-BAATARVERSE.

This is a world full of adventure, aggression and war.
This is a universe that pursues spirit, civilization and tradition.
The vast land has been reduced to a dark jungle
Only communities that are well versed in the law can survive.

We need the power to believe.
We need the power of consensus.
We need the strength of courage.
We need the power to explore.
We need the strength of unity.

BAATARVERSE, Hero Universe, welcome to join us!
BAATAR is the Mongolian word for "hero".
VERSE is taken from meta-universe Metaverse.
All the individuals who join us
All expressed their consensus and enthusiasm for BAATARVERSE.
Welcome to join us.
To pursue the power to rebuild our homeland together.
Together to build a spiritual home in the meta-universe!
A new journey
Let's go!

游牧世界，
英雄宇宙。
在自由乌托邦与崩塌现实的夹缝中，
9位草原上的英雄与1位萨满，
还在苦苦寻找重建家园的力量，
来建构精神世界的元宇宙——BAATARVERSE。

这里是充满冒险、侵略、战争的世界，
这里是追求精神、文明、传统的宇宙。
广袤的大地已沦落为黑暗丛林，
只有深谙法则的群落才能存活。

我们需要相信的力量
我们需要共识的力量
我们需要勇敢的力量
我们需要探索的力量
我们需要团结的力量

BAATARVERSE，英雄宇宙，欢迎你的到来！
BAATAR为蒙古语中的“英雄”，
VERSE取自元宇宙Metaverse。
所有加入我们的个体，
都表达了对BAATARVERSE的共识与热情，
我们欢迎你的加入，
欢迎你们和我们，
一起追寻重建家园的力量，
一起构建元宇宙中的精神家园！
新的旅程，
一起出发！`}
      />
    </>
  );
}

export default Story;
