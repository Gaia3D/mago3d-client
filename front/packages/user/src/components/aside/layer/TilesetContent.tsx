import React, {FC} from 'react';
import {getBackendOptions, MultiBackend} from "@minoru/react-dnd-treeview";
import {TreeContainer} from "@/components/aside/layer/tree/TreeContainer.tsx";
import {DndProvider} from "react-dnd";

interface TilesetContentProps {
    searchTerm: string;
}

const TilesetContent:FC<TilesetContentProps> = ({searchTerm}) => {
    return (
        <div>
            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <TreeContainer searchTerm={searchTerm} />
            </DndProvider>
        </div>
    );
};

export default TilesetContent;