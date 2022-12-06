import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';

export function DropDown({
  items,
  title,
  defaultSelect,
  selectAction,
}: {
  items: string[];
  title?: string;
  defaultSelect?: string;
  selectAction?: (item: string) => void;
}) {
  const [showList, setShowList] = useState(false);
  const [select, setSelect] = useState(title || defaultSelect);

  const updateSelect = useCallback(
    (item: string) => {
      setSelect(item);
      setShowList(false);
      if (item !== select && selectAction) selectAction(item);
    },
    [select]
  );

  useEffect(() => {
    const windowClick = () => {
      setShowList(false);
    };
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    };
  }, []);

  return (
    <DropDownBox>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowList(!showList);
        }}
      >
        {select}
      </div>
      {showList && (
        <div className="lists">
          {defaultSelect && (
            <div
              onClick={() => {
                updateSelect(defaultSelect);
              }}
            >
              {defaultSelect}
            </div>
          )}
          {items.map((item) => {
            return (
              <div
                key={item}
                onClick={() => {
                  updateSelect(item);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
    </DropDownBox>
  );
}

const DropDownBox = styled.div`
  display: inline-block;
  position: relative;
  .lists {
    position: absolute;
    background-color: #ebeee4;
    z-index: 100;
    width: 100%;
  }
`;
