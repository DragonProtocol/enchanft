import styled from 'styled-components';

export default function SwitchBtn({
  open,
  onChange,
  width = 100,
  height = 50,
  dotWidth = 40,
  dotHeight = 40,
}: {
  open: boolean;
  onChange: (arg0: boolean) => void;
  width?: number;
  height?: number;
  dotWidth?: number;
  dotHeight?: number;
}) {
  return (
    <ContentBox
      width={width}
      height={height}
      dotHeight={dotHeight}
      dotWidth={dotWidth}
      className={open ? 'raffle-switch active' : 'raffle-switch'}
    >
      <span
        onClick={() => {
          onChange(!open);
        }}
      ></span>
    </ContentBox>
  );
}

const ContentBox = styled.div<any>`
  display: inline-block;
  position: relative;
  width: ${(props: any) => props.width + 'px'};
  min-width: ${(props: any) => props.width + 'px'};
  height: ${(props: any) => props.height + 'px'};
  padding: ${(props: any) => (props.height - props.dotHeight) / 2 + 'px'};
  border-radius: ${(props: any) => props.height / 2 + 'px'};
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),
    #ebeee4;
  transition: all 0.1s ease-out;
  box-sizing: border-box;
  & > span {
    cursor: pointer;
    display: inline-block;
    position: absolute;
    left: ${(props: any) => (props.height - props.dotHeight) / 2 + 'px'};
    width: ${(props: any) => props.dotWidth + 'px'};
    height: ${(props: any) => props.dotHeight + 'px'};
    border-radius: ${(props: any) => props.dotHeight / 2 + 'px'};
    background-color: #fff;
    transition: all 0.1s ease-out;
  }
  &.active {
    background-color: #3dd606;
    & > span {
      left: ${(props: any) =>
        props.width / 2 + (props.height - props.dotHeight) / 2 + 'px'};
    }
  }
`;
