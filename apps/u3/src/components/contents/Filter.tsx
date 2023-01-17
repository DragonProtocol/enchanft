import { useState } from 'react';
import styled from 'styled-components';
import useConfigsTopics from '../../hooks/useConfigsTopics';
import { ContentLangRev } from '../../services/types/contents';
import CardBase from '../common/card/CardBase';
import CheckboxMultiChoice from '../common/checkbox/CheckboxMultiChoice';

export default function Filter({
  filterAction,
}: {
  filterAction: (data: { types: string[]; lang: string[] }) => void;
}) {
  const { topics } = useConfigsTopics();
  const { contentTypes, langs } = topics;
  const [types, setTypes] = useState([]);
  const [lang, setLang] = useState([]);
  return (
    <FilterWrapper>
      <CheckboxMultiChoice
        label="Content Type"
        options={contentTypes.map((item) => {
          return {
            value: item.value,
            label: item.name,
          };
        })}
        onChange={(value) => {
          setTypes(value);
          filterAction({ types: value, lang });
        }}
        value={types}
      />
      <CheckboxMultiChoice
        label="Language"
        options={langs
          .map((item) => {
            if (item.value === 'EN') {
              return {
                value: item.value,
                label: ContentLangRev.EN,
              };
            }
            if (item.value === 'CN') {
              return {
                value: item.value,
                label: ContentLangRev.CN,
              };
            }
            return null;
          })
          .filter((item) => !!item)}
        onChange={(value) => {
          setLang(value);
          filterAction({ lang: value, types });
        }}
        value={lang}
      />
    </FilterWrapper>
  );
}

const FilterWrapper = styled(CardBase)`
  border: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
