import {FC, useRef} from 'react';
import {UserLayerGroup} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useDrag, useDrop} from "react-dnd";
import {TreeDraggableItem} from "@/components/aside/layer/tree/TreeDraggableItem.tsx";

interface GroupProps {
    group: UserLayerGroup;
    groupIndex: number;
    moveItem: (dragGroupIndex: number, dragItemIndex: number, hoverGroupIndex: number, hoverItemIndex: number) => void;
    moveGroup: (dragIndex: number, hoverIndex: number) => void;
}

interface DragGroupItem {
    index: number;
    id: number;
    type: string;
    groupIndex: number;
}

export const TreeGroup: FC<GroupProps> = ({ group, groupIndex, moveItem, moveGroup }) => {

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
        <div ref={ref} style={{
            margin: '20px',
            padding: '10px',
            border: '1px solid black',
            backgroundColor: isDragging ? 'lightblue' : 'white',
            color: 'black',
        }}>
            <h4>{group.name}</h4>
            {group.assets.map((item, index) => (
                <TreeDraggableItem
                    key={item.assetId}
                    id={(item.assetId)}
                    text={item.name ?? ''}
                    index={index}
                    groupIndex={groupIndex}
                    moveItem={moveItem}
                    item={item}
                />
            ))}
        </div>
    );
};
