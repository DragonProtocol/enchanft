import { useState } from 'react';
import classnames from 'classnames'
import styled from 'styled-components';
import Image from 'next/image';

import Content from '../components/content';
import Header from '../components/header';

export function About() {

  const [isExpand,setIsExpand] = useState(false)

  const scrollToAnchor = (anchorName) => {
    console.log('anchorName', anchorName)
    if (anchorName) {
      // const tabBar = document.getElementById('tab-bar').offsetHeight
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView()
      }
    }
  }
  return (
    <Wrapper>
      asdasd
      <div className={classnames('sidebar',{'expand': isExpand})}>
        <div className="image-container more" onClick={() => setIsExpand(isExpand => !isExpand)}>
          <Image
            className='image'
            src={'/static/images/more.png'}
            layout="fill"
            objectFit="contain"
            alt={'basic'}
          />
        </div>
        {
          ['Home', 'CaskBaatar contract', 'About', 'Story', 'Rodmap', 'Steam', 'FAQ']
            ?.map(key => <div className='sidebar-item' key={key} onClick={() => scrollToAnchor(key)}>{key}</div>)
        }
      </div>
      {
        ['Home', 'CaskBaatar contract', 'About', 'Story', 'Rodmap', 'Steam', 'FAQ']
          ?.map(key => <div className='box' id={key} key={key + '1'}></div>)
      }
      {/* <div className='box' ></div>
      <div className='box'></div>
      <div className='box'></div>
      <div className='box'></div>
      <div className='box'></div> */}
    </Wrapper>
  );
}

export default About;

const Wrapper = styled.div`
  .sidebar{
    position: fixed;
    top: 100px;
    right: 20px;
    width: 75px;
    max-height: 60px;
    overflow: hidden;
    border-radius: 55px;
    font-size: .5rem;
    transition: all 1.5s cubic-bezier(0.075, 0.82, 0.165, 1);
    .sidebar-item{
      text-align: center;
      margin: 20px auto;
      cursor: pointer;
      &:hover{
      color: #00a791;}
    }
  }

  .expand{
    max-height: 800px;
    background: #07142333;

  }


  .more{
    width: .8rem;
    filter: grayscale(100%) brightness(200%);
    margin: 20px auto;
    cursor: pointer;
    &:hover{
      color: #00a791;
      filter: invert(47%) sepia(23%) saturate(2504%) hue-rotate(132deg) brightness(95%) contrast(101%);
    }

  }
  

  .image-container {
    width: 100%;
    position: relative;
    > span {
      position: unset !important;
    }
    .image {
      object-fit: contain;
      width: 100% !important;
      position: relative !important;
      height: unset !important;
    }
  }



.box{
  width: 100%;
  height: 300px;
  background: #00a791;
  &:nth-child(2){
    background: red;
  }
  &:nth-child(3){
    background: blue;
  }
  &:nth-child(4){
    background: whitesmoke;
  }
  &:nth-child(5){
    background: skyblue;
  }
}
`

// export function About() {
//   return (
//     <>
//       <Header />
//       <Content
//         title="About"
//         content={`Baatarverse is the first randomly generated collection of primitive Mongolian-style digital collections. Each digital collection has different characteristics and attributes, each of which is randomly created by attributes with different rarity according to the intelligent contract, making it unique.

// Baatarverse是随机生成的第一个原始蒙古风格数字藏品的集合。每个数字藏品都具有不同特征和属性，每一个都是由稀有度不同的属性根据智能合约随机创造出的，使其具有唯一性。`}
//       />
//     </>
//   );
// }

// export default About;

