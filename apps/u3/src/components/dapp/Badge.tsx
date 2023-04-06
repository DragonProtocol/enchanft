import styled, { StyledComponentPropsWithRef } from 'styled-components';

const colors = [
  '#718096',
  '#6C8FC1',
  '#56B59E',
  '#5564EA',
  '#C16C6C',
  '#A86ECB',
  '#B57856',
  '#97B556',
];
const colorToBgColor = (color: string) => `${color}26`;
const cacheColorMap = new Map<string, string>();
type Props = StyledComponentPropsWithRef<'span'> & {
  text: string;
};
export default function Badge({ text, ...otherProps }: Props) {
  if (!cacheColorMap.has(text)) {
    cacheColorMap.set(text, colors[Math.floor(Math.random() * colors.length)]);
  }
  const color = cacheColorMap.get(text);
  return (
    <Box color={color} {...otherProps}>
      {text}
    </Box>
  );
}

const Box = styled.span<{ color: string }>`
  display: inline-block;
  height: 18px;
  padding: 2px 4px;
  box-sizing: border-box;
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  color: ${({ color }) => color};
  background-color: ${({ color }) => colorToBgColor(color)};
  display: flex;
  justify-content: center;
  align-items: center;
`;
