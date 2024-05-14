import ReactQuill, {ReactQuillProps} from "react-quill";
import React, {useEffect, useState} from "react";
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';

export interface TextViewerProps extends Omit<ReactQuillProps, 'onChange' | 'value' | 'children' | 'modules'> {
  bounds?: string | HTMLElement;
  children?: React.ReactElement<any>;
  className?: string;
  id?: string;
  placeholder?: string;
  preserveWhitespace?: boolean;
  scrollingContainer?: string | HTMLElement;
  style?: React.CSSProperties;
  tabIndex?: number;
  value?: string;
}

const TextViewer = (props: TextViewerProps) => {
  const {
    value,
    ...quillProps
  } = props;
  const [contentValue, setContentValue] = useState('');

  useEffect(() => {
    setContentValue(value ?? '');
  }, [value]);

  return (
    <ReactQuill readOnly
                theme="bubble"
                value={contentValue}
                modules={TextViewer.modules}
                {...quillProps}/>
  );
}

TextViewer.modules = {
  toolbar: false,
}


export default TextViewer;