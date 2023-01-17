import styled from 'styled-components';
import BtnBox from './BtnBox';

export default function StepOne({
  cancelAction,
  nextAction,
}: {
  cancelAction: () => void;
  nextAction: () => void;
}) {
  return (
    <BtnBox>
      <button className="cancel" onClick={cancelAction}>
        Cancel
      </button>
      <button className="next-btn" onClick={nextAction}>
        Next
      </button>
    </BtnBox>
  );
}
