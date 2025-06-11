import React from 'react';
import {FieldCell} from '@src/layer-style/components/fields/rule/FieldCell';
import {EditableContextModel} from '@src/layer-style/models/EditableContextModel';
import {ColorMapEntry} from '@mnd/shared/src/types/layerset/gql/graphql';

interface RasterEntryTableIntervalProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(
    field: K,
    value: EditableContextModel[K]
  ) => void;
}

const RasterEntryTableInterval = ({
                                    context,
                                    onChange,
                                  }: RasterEntryTableIntervalProps) => {
  const entries = context.raster.entries ?? [];
  console.log("entries", entries);
  const updateEntry = (index: number, updated: Partial<ColorMapEntry>) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], ...updated };
    onChange('raster', {
      ...context.raster,
      entries: updatedEntries,
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

  const addEntry = () => {
    const lastValue = entries[entries.length - 1]?.bandValue ?? 0;
    const newEntry: ColorMapEntry = {
      bandValue: lastValue,
      color: '#000000',
      entryOpacity: 1,
      textLabel: '',
    };
    onChange('raster', {
      ...context.raster,
      entries: [...entries, newEntry],
    });
  };

  return (
    <div className="rule-table-wrapper">
      <table className="rule-table">
        <thead>
        <tr>
          <th>최소 (포함)</th>
          <th>최대</th>
          <th>색상</th>
          <th>투명도</th>
          <th>라벨</th>
          <th>삭제</th>
        </tr>
        </thead>
        <tbody>
        {entries.map((entry, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === entries.length - 1;
          const next = entries[idx + 1];

          return (
            <tr key={idx}>
              <td>
                <FieldCell
                  id={`entry-${idx}-bandValue`}
                  type="number"
                  value={entry.bandValue}
                  onChange={(value) => updateEntry(idx, {bandValue: Number(value)})}
                  disabled={isFirst}
                />
              </td>
              <td>
                {isLast ? (
                  <input type="text" value="" disabled/>
                ) : (
                  <FieldCell
                    id={`entry-${idx}-maxBandValue`}
                    type="number"
                    value={next.bandValue}
                    onChange={(value) => updateEntry(idx + 1, {bandValue: Number(value)})}
                  />
                )}
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
                {(!isLast && !isFirst) &&
                  <button className="delete-button" type="button" onClick={() => removeEntry(idx)}>
                    삭제
                  </button>
                }

              </td>
            </tr>
          );
        })}
        </tbody>

      </table>
      <div className="rule-table-actions">
        <button type="button" className="add-row-button" onClick={addEntry}>
          행 추가
        </button>
      </div>
    </div>
  );
};

export default RasterEntryTableInterval;
