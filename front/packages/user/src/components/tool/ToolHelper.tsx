interface ToolHelperProps {
    helper?: string;
}

const ToolHelper = ({helper}: ToolHelperProps) => {
    return (
        <div className="tool-helper">
            {helper}
        </div>
    );
};

export default ToolHelper;