import { useState } from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import styled from 'styled-components';

import Content from '../components/content';
import Header from '../components/header';

const QA = [
  {
    question: 'What is  BAATARVERSE value?',
    answer: (
      <div className="flex">
        <div>
        <div className="question">What is  BAATARVERSE value?</div>
          {`Nherited culture, far beyond NFT
Keep historical elements alive, presenting Dynasties change and collisions of modern times.
Each Baatar artwork contains Mongolia culture in the details from clothing to Accessories
Baatarverse Collectors inherit Mongol Culture in immutable blockchain world and deliver the Baatar spirit in Metaverse.`}</div>
        <div>
        <div className="question">BAATARVERSE 的价值是什么？</div>
          {`继承文化，远超NFT本身价值
保持历史元素的活力，呈现朝代的变迁和现代的碰撞。
每件巴塔艺术作品都包含了蒙古文化，从服装到配件的细节都有。
Baatarverse收藏家在不可改变的区块链世界中继承蒙古文化，在Metaverse中传递巴特尔精神。`}</div>
      </div>
    ),
  },
  {
    question: 'Where did BAATARVERSE come from?',
    answer: (
      <div className="flex">
        <div>
        <div className="question">Where did BAATARVERSE come from?</div>
          {`Original from world-class artist
All elements of Baatarverse are exclusively designed from Yideer, most famous Mongolian-style artist in the world.`}</div>
        <div>
        <div className="question">BAATARVERSE 从何而来？</div>
          {`来自世界级艺术大师的原创
Baatarverse的所有元素都是由世界上最著名的蒙古风格艺术大师Yideer独家设计的。`}</div>
      </div>
    ),
  },
  {
    question: 'Sounds awesome - How do I get involved?',
    answer: (
      <div className="flex">
        <div>
        <div className="question">Sounds awesome - How do I get involved?</div>
          {`A great place to start is our Discord, home to a very large and very active community of BAATARVERSE enthusiasts. You don't need to be a BAATARVERSE holder to join us there! All are welcome to jump into the conversation, let us know your ideas, and hang out with many others who like the BAATARVERSES`}</div>
        <div>
        <div className="question">太棒了 - 我该如何加入？</div>
          {`可以从我们的Discord开始，这里有一个非常大和非常活跃的BAATARVERSE爱好者的社区。你不需要是BAATARVERSE的持有者来加入我们。我们欢迎所有人加入对话，让我们知道你的想法，并与许多喜欢BAATARVERSE的人一起玩耍。`}</div>
      </div>
    ),
  },
  {
    question: 'Are BAATARVERSE a good investment?',
    answer: (
      <div className="flex">
        <div>
          <div className="question">Are BAATARVERSE a good investment?</div>
          {`The success of the project depends on many factors. We do not have a magic to predict, so it is impossible to know how it will go, but we strongly believe in our project and think it has a bright future ahead, but ultimately you will have to decide for yourself.`}</div>
        <div>
        <div className="question">BAATARVERSE 是一项好的投资吗？</div>
          {`项目的成功取决于许多因素。我们没有魔法去预测，所以不可能知道它将如何发展，但我们坚信我们的项目，并认为它有一个光明的未来，但最终需要你自己决定。`}</div>
      </div>
    ),
  },
];

export function FAQ() {
  return (
    <>
      <Header />

      <Content
        title="FAQ"
        content={renderToString(
          <div>
            {QA.map(({ question, answer }) => (
              <div className="item">
                {/* <div className="question">{question}</div> */}
                <p className="answer">{answer}</p>
              </div>
            ))}
          </div>
        )}
      />
    </>
  );
}

export default FAQ;
