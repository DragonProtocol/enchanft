import styled from 'styled-components';
import BtnBox from './BtnBox';

export default function StepOne({
  backAction,
  nextAction,
}: {
  backAction: () => void;
  nextAction: () => void;
}) {
  return (
    <BtnBox>
      <button className="cancel" onClick={backAction}>
        Back
      </button>
      <button className="next-btn" onClick={nextAction}>
        Next
      </button>
    </BtnBox>
  );
}
