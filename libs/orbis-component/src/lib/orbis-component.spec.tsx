import { render } from '@testing-library/react';

import OrbisComponent from './orbis-component';

describe('OrbisComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrbisComponent />);
    expect(baseElement).toBeTruthy();
  });
});
