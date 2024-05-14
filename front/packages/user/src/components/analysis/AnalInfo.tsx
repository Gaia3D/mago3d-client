import AnalHelpJson from '@/assets/help.json';

type AnalHelpJsonType = Record<string, Record<string, string>>;
const AnalHelp = ({analName, propName}:{analName:string, propName:string}) => {
  const help = (AnalHelpJson as AnalHelpJsonType)[analName][propName];

  if (!help) return null;

  return (
    <button type="button" className="bullet-info">
      <div className="popup--view active">
      {help}
      </div> 
    </button>
  )
}

export default AnalHelp;