import { CHROME_EXTENSION_URL } from 'apps/collector-page-v2/src/constants';
import styled from 'styled-components';
import { ButtonPrimary, ButtonProps } from '../../common/button/ButtonBase';
import ChromeSvg from '../../common/icons/svgs/chrome.svg';

export default function InstallU3ExtensionButton(props: ButtonProps) {
  return (
    <ButtonPrimary
      {...props}
      onClick={() => {
        if (CHROME_EXTENSION_URL) window.open(CHROME_EXTENSION_URL, '_blank');
        else alert('TODO');
      }}
    >
      <InstallExtensionIcon src={ChromeSvg} />
      <span>Install U3 on Chrome</span>
    </ButtonPrimary>
  );
}
const InstallExtensionIcon = styled.img`
  width: 24px;
  height: 24px;
`;
