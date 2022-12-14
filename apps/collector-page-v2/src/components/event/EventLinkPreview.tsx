import styled, { StyledComponentPropsWithRef } from 'styled-components';
import CannotOpenPlatFormLink from './CannotOpenPlatFormLink';

export type CannotOpenPlatFormLinkProps = {
  data: {
    platform: {
      logo: string;
    };
    link: string;
    supportIframe: boolean;
  };
};
export default function EventLinkPreview({
  data,
}: CannotOpenPlatFormLinkProps) {
  const u3ExtensionInstalled =
    localStorage.getItem('u3ExtensionInstalled') === 'true';
  const { platform, link, supportIframe } = data;
  const displayCannotOpen = !supportIframe && !u3ExtensionInstalled;
  return displayCannotOpen ? (
    <CannotOpenPlatFormLink iconUrl={platform.logo} linkUrl={link} />
  ) : (
    <EventIframe src={link} />
  );
}

const EventIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
