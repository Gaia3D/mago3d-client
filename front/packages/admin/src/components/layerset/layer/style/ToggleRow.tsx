interface ToggleRowProps {
  title: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

export const ToggleRow = ({ title, enabled, onToggle }: ToggleRowProps) => {
  return (
    <div className="input-row" style={{ opacity: enabled ? 1 : 0.4 }}>
      <div className="title">{title}</div>
      <div className="value">
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onToggle(e.target.checked)}
          style={{ marginLeft: 8 }}
        />
      </div>
    </div>
  );
};
