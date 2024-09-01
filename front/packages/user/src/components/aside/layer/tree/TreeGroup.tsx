import {FC, useRef} from 'react';
import {UserLayerGroup} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useDrag, useDrop} from "react-dnd";
import {TreeDraggableItem} from "@/components/aside/layer/tree/TreeDraggableItem.tsx";

interface GroupProps {
    group: UserLayerGroup;
    groupIndex: number;
    moveItem: (dragGroupIndex: number, dragItemIndex: number, hoverGroupIndex: number, hoverItemIndex: number) => void;
    moveGroup: (dragIndex: number, hoverIndex: number) => void;
    toggleGroup: (groupId: string) => void
}

interface DragGroupItem {
    index: number;
    id: number;
    type: string;
    groupIndex: number;
}

export const TreeGroup: FC<GroupProps> = ({ group, groupIndex, moveItem, moveGroup, toggleGroup }) => {

    const ref = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop<DragGroupItem>({
        accept: ['GROUP', 'ITEM'],
        hover(item, monitor) {
            if (!ref.current) return;
            if (item.type === 'GROUP') {
                const dragIndex = item.index;
                const hoverIndex = groupIndex;

                if (dragIndex === hoverIndex) return;

                moveGroup(dragIndex, hoverIndex);
                item.index = hoverIndex;
            } else if (item.type === 'ITEM' && item.groupIndex !== groupIndex) {
                const dragItemIndex = item.index;
                const hoverItemIndex = group.assets.length; // 항상 그룹의 끝으로 이동
                moveItem(item.groupIndex, dragItemIndex, groupIndex, hoverItemIndex);
                item.groupIndex = groupIndex;
                item.index = hoverItemIndex;
            }
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'GROUP',
        item: { id: group.groupId, index: groupIndex, type: 'GROUP' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div ref={ref}  className="group-node-container">
            <div className="group-node" onClick={()=>toggleGroup(group.groupId)}>
                <div className="group-icon">G</div>
                <div className="group-name">{group.name}</div>
            </div>
            <ul className="layer-list">
            {group.assets.map((item, index) => (
                <li key={item.assetId} className="listitem">
                    <TreeDraggableItem
                        id={(item.assetId)}
                        text={item.name ?? ''}
                        index={index}
                        groupIndex={groupIndex}
                        moveItem={moveItem}
                        item={item}
                    />
                </li>
            ))}
            </ul>
        </div>
    );
};
