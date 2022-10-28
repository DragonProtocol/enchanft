import { toast } from 'react-toastify';
import styled from 'styled-components';
import { TASK_DEFAULT_IMAGE_URLS } from '../../utils/constants';
import { RewardType, State } from './type';

export default function PreviewBtn({
  state,
  updateState,
  passAction,
}: {
  state: State;
  updateState: (arg0: State) => void;
  passAction: () => void;
}) {
  return (
    <PreviewBox>
      <button
        className="preview-btn"
        onClick={() => {
          if (!state.name) {
            toast.error('Task title is required');
            return;
          }
          if (!state.description) {
            toast.error('Task statement is required');
            return;
          }
          if (state.reward.type === RewardType.OTHERS) {
            if (!state.reward.name) {
              toast.error('Reward name is required when the type is other');
              return;
            }
          }
          if (state.actions.length === 0) {
            toast.error('Task actions must have one item at least');
            return;
          }

          if (!state.image) {
            const random = Math.floor(
              Math.random() * TASK_DEFAULT_IMAGE_URLS.length
            );
            updateState({
              ...state,
              image: TASK_DEFAULT_IMAGE_URLS[random],
            });
          }
          passAction();
        }}
      >
        View
      </button>
    </PreviewBox>
  );
}

const PreviewBox = styled.div`
  text-align: end;
  & button.preview-btn {
    cursor: pointer;
    margin-top: 20px;
    width: 200px;
    background-color: #3dd606;
    color: #fff;
    border: none;
    height: 48px;
    font-size: 20px;
    box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
  }
`;
