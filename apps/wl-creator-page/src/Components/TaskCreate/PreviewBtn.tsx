import { toast } from 'react-toastify';
import styled from 'styled-components';
import { TASK_DEFAULT_IMAGE_URLS } from '../../utils/constants';
import BtnBox from './BtnBox';
import { RewardType, State } from './type';

export default function PreviewBtn({
  state,
  updateState,
  passAction,
  backAction,
}: {
  state: State;
  updateState: (arg0: State) => void;
  passAction: () => void;
  backAction: () => void;
}) {
  return (
    <PreviewBox>
      <button className="cancel" onClick={backAction}>
        Back
      </button>
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

const PreviewBox = styled(BtnBox)`
  & button {
    &.cancel {
      background: #ebeee4;
      color: #333333;
    }
    &.preview-btn {
      background-color: #3dd606;
      color: #fff;
    }
  }
`;
