import ReactQuill, {Quill, ReactQuillProps, UnprivilegedEditor} from "react-quill";
import {DeltaStatic, Sources} from 'quill';
import {useCallback, useEffect, useRef, useState} from "react";
import ImageCompress from "quill-image-compress";
import {ImageResize} from 'quill-image-resize-module-ts';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';
import './TextEditor.css';

const Font = Quill.import('formats/font');
const Size = Quill.import('formats/size');
Font.whitelist = ["dotum", "gullim", "batang", "NanumGothic"];
Size.whitelist = ["8", "9", "10", "11", "12", "14", "18", "24", "36"];
Quill.register(Font, true);
Quill.register(Size, true);


const formats = [
  'header',
  'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'blockquote', 'code-block',
  'indent', 'list',
  'direction', 'align',
  'link', 'image', 'video', 'formula',
]

Quill.register(Font, true);
Quill.register('modules/imageCompress', ImageCompress, true);
Quill.register('modules/imageResize', ImageResize, true);

const Bold = Quill.import('formats/bold');
Bold.tagName = 'B';   // Quill uses <strong> by default
Quill.register(Bold, true);

export interface TextEditorImageCompressOptions {
  validation?: boolean;
  debug?: boolean;
  suppressErrorLogging?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  imageType?: string;
  keepImageTypes?: string[];
  ignoreImageTypes?: string[];
  quality?: number;
}

export interface TextEditorProps extends Omit<ReactQuillProps, 'onChange' | 'value' | 'children' | 'modules' | 'defaultValue' | 'readOnly'> {
  value?: string;
  compress?: TextEditorImageCompressOptions;
  onChange?(value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor): void;
}

const TextEditor = (props: TextEditorProps) => {
  const {
    value,
    compress,
    onChange,
    ...quillProps
  } = props;

  const quillRef = useRef<ReactQuill | null>(null);
  const [contentValue, setContentValue] = useState<string>('');

  useEffect(() => {
    setContentValue(value || '');
  }, [value, setContentValue]);

  const handleOnChange = useCallback((value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
    setContentValue(value);
    onChange?.(value, delta, source, editor);
    return (content: string) => {
      // 반환타입이 함수네..?
    }
  }, [props.onChange, setContentValue]);

  return (
    <ReactQuill ref={quillRef}
                modules={TextEditor.modules}
                onChange={handleOnChange}
                value={contentValue}
                {...quillProps}/>
  );
}

TextEditor.modules = {
  imageCompress: {
    quality: 0.7,
    maxWidth: 1024,
    maxHeight: 1024,
    imageType: 'image/jpeg',
    debug: false,
  },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize', 'Toolbar'],
  },
  toolbar: {
    container: [
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      // [{font: Font.whitelist}],
      // [{size: Size.whitelist}],
      ["bold", "italic", "underline", "strike", "blockquote"],

      // [{script: "sub"}, {script: "super"}],
      [{direction: "rtl"}],

      // [{size: ["small", false, "large", "huge"]}],
      [{color: []}, {background: []}],
      [
        {list: 'ordered'},
        {list: 'bullet'},
        {indent: '-1'},
        {indent: '+1'},
      ],
      [{align: []}],
      // ["clean"],
      ['link', "image"],
    ],
  },
};

export default TextEditor;