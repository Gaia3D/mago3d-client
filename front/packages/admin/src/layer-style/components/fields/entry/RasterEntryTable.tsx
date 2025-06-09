import React from 'react';
import {FieldCell} from '@src/layer-style/components/fields/rule/FieldCell';
import {EditableContextModel} from '@src/layer-style/models/EditableContextModel';
import {ColorMapEntry} from '@mnd/shared/src/types/layerset/gql/graphql';

interface RasterEntryTableProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
}

const RasterEntryTable = ({ context, onChange }: RasterEntryTableProps) => {
  const entries = context.raster.entries ?? [];

  const updateEntry = (index: number, updated: Partial<ColorMapEntry>) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], ...updated };
    onChange('raster', {
      ...context.raster,
      entries: updatedEntries,
    });
  };

  const addEntry = () => {
    const baseValue = entries.length >= 2
      ? entries[0]?.bandValue ?? 0
      : 0;

    const newEntry: ColorMapEntry = {
      bandValue: baseValue,
      color: '#000000',
      entryOpacity: 1,
      textLabel: '',
    };

    const insertIndex = entries.length - 1;
    const newEntries = [
      ...entries.slice(0, insertIndex),
      newEntry,
      ...entries.slice(insertIndex),
    ];

    onChange('raster', {
      ...context.raster,
      entries: newEntries,
    });
  };

  const removeEntry = (index: number) => {
    const updatedEntries = [...entries];
    updatedEntries.splice(index, 1);
    onChange('raster', {
      ...context.raster,
      entries: updatedEntries,
    });
  };

  return (
    <div className="rule-table-wrapper">
      <table className="rule-table">
        <thead>
        <tr>
          <th>값</th>
          <th>색상</th>
          <th>투명도</th>
          <th>라벨</th>
          <th>삭제</th>
        </tr>
        </thead>
        <tbody>
        {entries.map((entry, idx) => (
          <tr key={idx}>
            <td>
              <FieldCell
                id={`entry-${idx}-value`}
                type="number"
                value={entry.bandValue}
                disabled={idx === 0 || idx === entries.length - 1}
                onChange={(value) => updateEntry(idx, {bandValue: Number(value)})}
              />
            </td>
            <td>
              <FieldCell
                id={`entry-${idx}-color`}
                type="color"
                value={entry.color}
                onChange={(value) => updateEntry(idx, {color: value})}
              />
            </td>
            <td>
              <FieldCell
                id={`entry-${idx}-opacity`}
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={entry.entryOpacity}
                onChange={(value) => updateEntry(idx, {entryOpacity: Number(value)})}
              />
            </td>
            <td>
              <FieldCell
                id={`entry-${idx}-label`}
                type="text"
                value={entry.textLabel}
                onChange={(value) => updateEntry(idx, {textLabel: value})}
              />
            </td>
            <td>
              <button className="delete-button" type="button" onClick={() => removeEntry(idx)}>삭제</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className="rule-table-actions">
        <button type="button" className="add-row-button" onClick={addEntry}>행 추가</button>
      </div>
    </div>
  );
};

export default RasterEntryTable;
