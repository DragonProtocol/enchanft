import styled from 'styled-components';
import ReactQuill from 'react-quill';
import { useRef } from 'react';

export default function RichText({
  text,
  setText,
}: {
  text: string;
  setText: (arg0: string) => void;
}) {
  const quillRef = useRef<ReactQuill>(null);
  return (
    <RichTextBox data-text-editor="name">
      <ReactQuill
        value={text}
        onChange={(v) => {
          setText(v);
        }}
        ref={quillRef}
        bounds={`[data-text-editor="name"]`}
        modules={{
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              [{ align: [] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link'],
              // ['clean'],
              // [{ color: [] }],
            ],
          },
        }}
      />
    </RichTextBox>
  );
}

const RichTextBox = styled.div`
  background: #ebeee4;
  border-radius: 10px;

  & .ql-snow {
    border: none;
  }

  .ql-tooltip {
    border-radius: 10px;
    border: none;
    background: #f7f9f1;
  }

  & .ql-toolbar {
    border-bottom: 1px solid rgba(51, 51, 51, 0.1);
    font-family: inherit;
  }

  & .ql-picker-options {
    background-color: #f7f9f1 !important;
    border: none;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  & .ql-container {
    height: 335px;
    font-family: inherit;
    position: relative;
  }

  & .ql-editor {
    font-size: 18px;
    line-height: 27px;
    font-family: inherit;
    & * {
      font-family: inherit;
    }
  }
`;
