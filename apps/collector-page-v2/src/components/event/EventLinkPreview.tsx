/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-15 12:13:11
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import CannotOpenPlatFormLink from './CannotOpenPlatFormLink';

export type CannotOpenPlatFormLinkProps = {
  data: {
    name: string;
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
  const { platform, link, supportIframe, name } = data;
  const displayCannotOpen = !supportIframe && !u3ExtensionInstalled;
  return displayCannotOpen ? (
    <CannotOpenPlatFormLink
      iconUrl={platform.logo}
      linkUrl={link}
      title={name}
    />
  ) : (
    <EventIframe src={link} />
  );
}

const EventIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
