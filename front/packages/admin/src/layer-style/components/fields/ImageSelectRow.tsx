import React, { useRef, useState } from 'react';
import { LayerType } from '@src/layer-style/models/EditableContextModel';
import { LineStyle, ShapeType } from '@mnd/shared/src/types/layerset/gql/graphql';

import horizontalImage from '@src/assets/images/horizontal.png';
import verticalImage from '@src/assets/images/vertical.png';
import slashImage from '@src/assets/images/slash.png';
import backslashImage from '@src/assets/images/backslash.png';
import boldXImage from '@src/assets/images/bold_x.png';
import normalXImage from '@src/assets/images/normal_x.png';
import crossImage from '@src/assets/images/cross.png';
import solidImage from '@src/assets/images/solid.png';
import dottedImage from '@src/assets/images/dotted.png';
import dashedImage from '@src/assets/images/dashed.png';
import dashSingleImage from '@src/assets/images/dash_single.png';
import dashDoubleImage from '@src/assets/images/dash_double.png';

interface ImageSelectRowProps<T> {
  id: string;
  label: string;
  value: T;
  type: LayerType;
  onChange: (value: T) => void;
}

const SHAPE_OPTIONS = [
  { value: ShapeType.Horizontal, label: '가로선', image: horizontalImage },
  { value: ShapeType.Vertical, label: '세로선', image: verticalImage },
  { value: ShapeType.Slash, label: '대각선', image: slashImage },
  { value: ShapeType.Backslash, label: '역대각선', image: backslashImage },
  { value: ShapeType.BoldX, label: '엑스', image: boldXImage },
  { value: ShapeType.NormalX, label: '격자', image: normalXImage },
  { value: ShapeType.Cross, label: '십자', image: crossImage },
];

const LINE_OPTIONS = [
  { value: LineStyle.Solid, label: '실선', image: solidImage },
  { value: LineStyle.Dotted, label: '점선', image: dottedImage },
  { value: LineStyle.Dashed, label: '파선', image: dashedImage },
  { value: LineStyle.DashSingle, label: '1점쇄선', image: dashSingleImage },
  { value: LineStyle.DashDouble, label: '2점쇄선', image: dashDoubleImage },
];

const ImageSelectRow = <T,>({ id, label, value, type, onChange }: ImageSelectRowProps<T>) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const options =
    type === LayerType.LINE ? LINE_OPTIONS :
      type === LayerType.POINT || type === LayerType.POLYGON ? SHAPE_OPTIONS :
        [];

  const selected = options.find(opt => opt.value === value);

  const handleOptionClick = (val: T) => {
    onChange(val);
    setOpen(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div className="form-row" style={{ position: 'relative' }} ref={wrapperRef}>
      <label htmlFor={id}>
        {label}
        <span title="해당 속성은 미리보기 지원이 되지 않습니다."> ℹ️ </span>
      </label>

      <div className="image-select-container" tabIndex={0} onBlur={handleBlur}>
        <div className="image-select-trigger" onClick={() => setOpen(prev => !prev)}>
          <div className="image-select-option space-between">
            {selected ? (
              <>
                <img className={type === LayerType.LINE ? 'line-img' : ''} src={selected.image} alt={selected.label} />
                <span>{selected.label}</span>
              </>
            ) : (
              <span>선택</span>
            )}
          </div>
        </div>

        {open && (
          <div className="image-select-dropdown">
            {options.map(option => (
              <div
                key={String(option.value)}
                className="image-select-option space-between"
                onClick={() => handleOptionClick(option.value as T)}
              >
                <img
                  className={type === LayerType.LINE ? 'line-img' : ''}
                  src={option.image}
                  alt={option.label}
                />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSelectRow;
