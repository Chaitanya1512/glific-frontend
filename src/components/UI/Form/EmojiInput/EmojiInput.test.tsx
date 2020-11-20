import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { EmojiInput } from './EmojiInput';
import { Editor, EditorState } from 'draft-js';

const setFieldValueMock = jest.fn();

const wrapper = (
  <EmojiInput
    form={{
      touched: false,
      errors: {},
      values: { input: EditorState.createEmpty() },
      setFieldValue: setFieldValueMock,
    }}
    field={{ name: 'input', value: '', onChange: jest.fn() }}
    placeholder="Title"
  />
);
it('renders <EmojiInput /> component', () => {
  const { getByTestId } = render(wrapper);
  expect(getByTestId('input')).toBeInTheDocument();
});

it('should have a emoji picker', () => {
  const { getByTestId } = render(wrapper);
  expect(getByTestId('emoji-picker')).toBeInTheDocument();
});

test('clicking on emoji picker should open a container to select emojis', () => {
  const { getByTestId, container } = render(wrapper);
  fireEvent.click(getByTestId('emoji-picker'));
  expect(container.querySelector('.emoji-mart')).toBeInTheDocument();
});

test('clicking on an emoji should call onChange function', () => {
  const { getByTestId, container } = render(wrapper);
  fireEvent.click(getByTestId('emoji-picker'));
  fireEvent.click(container.querySelector('.emoji-mart-emoji'));
  expect(setFieldValueMock).toBeCalled();
});
