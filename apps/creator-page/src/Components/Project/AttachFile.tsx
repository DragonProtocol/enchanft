import styled from 'styled-components';
import PngIconAdd from '../Icons/PngIconAdd';

export default function AttachFile({
  img,
  uploadImageHandler,
}: {
  img: string;
  uploadImageHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Box>
      <h4>Project Example</h4>
      <input
        title="attach-file"
        id="attach-file"
        type="file"
        accept="image/png, image/gif, image/jpeg"
        onChange={uploadImageHandler}
      />
      <div
        className="attach-file"
        onClick={() => {
          document.getElementById('attach-file')?.click();
        }}
      >
        {(img && <img src={img} alt="" />) || (
          <div>
            <PngIconAdd />
            <p>Attach File</p>
          </div>
        )}
      </div>
    </Box>
  );
}

const Box = styled.div`
  & h4 {
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    margin-top: 0px;
    margin-bottom: 10px;
    color: #333333;
  }
  & > input#attach-file {
    display: none;
  }

  & > div.attach-file {
    background: #ebeee4;
    width: 260px;
    height: 260px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    & img {
      width: 100%;
      height: 100%;
    }
    > div {
      padding-top: 20px;
      text-align: center;
      & img {
        width: 50px;
        height: 50px;
      }
      > p {
        margin-top: 10px;
        font-weight: 400;
        font-size: 18px;
        line-height: 27px;
        color: #333333;
      }
    }
  }
`;
