import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import App from '../App/App';

describe('App', () => {
  it('should render', () => {
    const appProps = { shutdown: (): void => console.info('testfunction'), title: 'title', version: '1.0' };
    expect(render(<App {...appProps} />)).toBeTruthy();
  });
});
