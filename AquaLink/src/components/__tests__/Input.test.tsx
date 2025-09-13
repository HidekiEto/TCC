// @ts-nocheck
import React from 'react';
import { render } from '@testing-library/react-native';
import Input from '../Input';

describe('Input component', () => {
  it('renders label and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Email" placeholder="Digite seu E-mail" />
    );

    expect(getByText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu E-mail')).toBeTruthy();
  });
});
