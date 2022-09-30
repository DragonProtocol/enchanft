import { render } from '@testing-library/react';

import WlUserReactCore from './wl-user-react-core';

describe('WlUserReactCore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WlUserReactCore />);
    expect(baseElement).toBeTruthy();
  });
});
