import styled, { StyledComponentPropsWithRef } from 'styled-components';
import CardBase from '../card/CardBase';
import UploadImage from './UploadImage';
import { ReactComponent as PlusSvg } from '../icons/svgs/plus.svg';

type Props = StyledComponentPropsWithRef<'div'> & {
  urls: string[];
  onSuccess: (urls: string[]) => void;
};
export default function UploadImages({
  urls,
  onSuccess,
  ...otherProps
}: Props) {
  return (
    <Wrapper {...otherProps}>
      {urls.map((url, index) => (
        <UploadImage
          showDelete
          url={url}
          onSuccess={(u) => {
            urls[index] = u;
            onSuccess(urls);
          }}
          onDelete={() => {
            urls.splice(index, 1);
            onSuccess(urls);
          }}
        />
      ))}
      <AddBtn
        onClick={() => {
          urls.push('');
          onSuccess(urls);
        }}
      >
        <PlusSvg />
      </AddBtn>
    </Wrapper>
  );
}

const Wrapper = styled(CardBase)`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const AddBtn = styled(CardBase)`
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    width: 50px;
    height: 50px;
    path {
      stroke: #4e5a6e;
    }
  }
  &:hover {
    border-color: #e5e5e5;
    svg {
      path {
        stroke: #e5e5e5;
      }
    }
  }
`;
