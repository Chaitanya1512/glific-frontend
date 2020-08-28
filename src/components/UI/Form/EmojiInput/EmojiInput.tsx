import React, { useState, useEffect, forwardRef } from 'react';
import { Editor, RichUtils, Modifier } from 'draft-js';
import { InputAdornment, IconButton } from '@material-ui/core';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { Input } from '../Input/Input';
import { EditorState, ContentState } from 'draft-js';
import Styles from './EmojiInput.module.css';

export interface EmojiInputProps {
  field: any;
  form: any;
  label: string;
  placeholder: string;
  rows: number;
}

export const EmojiInput: React.FC<EmojiInputProps> = ({
  field: { onChange, ...rest },
  ...props
}: EmojiInputProps) => {
  const ref = React.useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleKeyCommand = (command: any, editorState: any) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      props.form.setFieldValue(rest.name, newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const updateValue = (emoji: any) => {
    const editorContentState = props.form.values[rest.name].getCurrentContent();
    let editorSelectionState: any = props.form.values[rest.name].getSelection();
    const ModifiedContent = Modifier.insertText(
      editorContentState,
      editorSelectionState,
      emoji.native
    );
    let updatedEditorState = EditorState.createWithContent(ModifiedContent);
    updatedEditorState = EditorState.moveFocusToEnd(updatedEditorState);
    props.form.setFieldValue(rest.name, updatedEditorState);
  };

  const InputWrapper = (props: any) => {
    const { component: Component, inputRef, ...other } = props;

    React.useImperativeHandle(inputRef, () => ({
      focus: () => {
        const current: any = ref.current;
        if (current) current.focus();
      },
    }));

    return <Component ref={ref} {...other} />;
  };

  const inputComponent = InputWrapper;
  const inputProps = {
    component: Editor,
    editorState: props.form.values[rest.name],
    handleKeyCommand: handleKeyCommand,
    onBlur: props.form.handleBlur,
  };

  const editor = { inputComponent: inputComponent, inputProps: inputProps };

  const emojiPicker = showEmojiPicker ? (
    <Picker
      data-testid="emoji-container"
      title="Pick your emoji…"
      emoji="point_up"
      style={{ position: 'absolute', top: '10px', right: '0px', zIndex: 2 }}
      onSelect={updateValue}
    />
  ) : null;

  const draftJsChange = (editorState: any) => {
    props.form.setFieldValue(rest.name, editorState);
  };

  const picker = (
    <InputAdornment position="end" className={Styles.EmojiPosition}>
      <IconButton
        color="primary"
        aria-label="pick emoji"
        component="span"
        className={Styles.Emoji}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        <span role="img" aria-label="pick emoji" data-testid="emoji-picker">
          😀
        </span>
      </IconButton>

      {emojiPicker}
    </InputAdornment>
  );

  const input = (
    <Input
      field={{ onChange: draftJsChange, ...rest }}
      {...props}
      editor={editor}
      emojiPicker={picker}
    />
  );

  return input;
};
