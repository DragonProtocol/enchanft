import styled from 'styled-components';
import Title from './Title';
import Badge from '../contents/Badge';

export default function RecommendEvents({ data }: { data: any[] }) {
  return (
    <Box>
      <Title text="Recommended Events" viewAllAction={() => {}} />{' '}
      <div className="lists">
        {data.map((item) => {
          return (
            <Card
              key={item.uid || item.id}
              title={item.title}
              img={item.imageUrl}
              author={item.requirements[0]?.community?.title || ''}
            />
          );
        })}
      </div>
    </Box>
  );
}

const Box = styled.div`
  & .lists {
    display: flex;
    gap: 40px;
    margin-top: 20px;
  }
`;

function Card({
  title,
  img,
  author,
}: {
  title: string;
  img: string;
  author: string;
}) {
  return (
    <CardBox>
      <img src={img} alt="" />
      <div>
        <h2>{title}</h2>
        <div>
          <Badge text="Badge" />
          <span>{author}</span>
        </div>
      </div>
    </CardBox>
  );
}

const CardBox = styled.div`
  width: 260px;
  height: 371px;

  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;

  > img {
    width: 260px;
    height: 260px;
  }

  > div {
    padding: 20px;
    h2 {
      margin: 0;
      margin-bottom: 10px;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;

      color: #ffffff;
    }

    > div {
      display: flex;
      gap: 10px;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;

      color: #718096;
    }
  }
`;
