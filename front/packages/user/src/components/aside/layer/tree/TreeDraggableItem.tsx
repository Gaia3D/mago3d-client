import {FC, useEffect, useRef, useState} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {Maybe, UserLayerAsset, UserLayerGroup} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useFlyToLayer} from "@/hooks/useFlyToLayer.ts";
import {useRecoilState, useSetRecoilState} from "recoil";
import {UserLayerGroupState, visibleToggledLayerIdState} from "@/recoils/Layer.ts";

interface DraggableItemProps {
    id: string;
    text: string;
    index: number;
    groupIndex: number;
    moveItem: (dragGroupIndex: number, dragItemIndex: number, hoverGroupIndex: number, hoverItemIndex: number) => void;
    item: UserLayerAsset;
}

interface DragItem {
    index: number;
    id: number;
    type: string;
    groupIndex: number;
}

export const TreeDraggableItem: FC<DraggableItemProps> = ({ id, text, index, groupIndex, moveItem, item }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { flyToLayer } = useFlyToLayer();
    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
    const setVisibleToggledLayerId = useSetRecoilState<string | null>(visibleToggledLayerIdState);

    const [, drop] = useDrop<DragItem>({
        accept: 'ITEM',
        hover(item, monitor) {
            if (!ref.current) return;

            const dragIndex = item.index;
            const hoverIndex = index;

            const dragGroupIndex = item.groupIndex;
            const hoverGroupIndex = groupIndex;

            if (dragIndex === hoverIndex && dragGroupIndex === hoverGroupIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveItem(dragGroupIndex, dragIndex, hoverGroupIndex, hoverIndex);
            item.index = hoverIndex;
            item.groupIndex = hoverGroupIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'ITEM',
        item: { id, index, groupIndex, type: 'ITEM' },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    const toggleVisibleEventHandle = (asset: UserLayerAsset) => {
        console.log(asset);
    };

    const deleteLayer = (asset: UserLayerAsset) => {
        console.log(asset);
    }

    return (
        <div
            ref={ref}
            style={{
                padding: '8px',
                margin: '4px',
                backgroundColor: isDragging ? 'lightgreen' : 'white',
                border: '1px solid gray',
                cursor: 'move',
                opacity: isDragging ? 0.5 : 1,
                color: 'black',
            }}
        >
            {text}
            <button onClick={() => {toggleVisibleEventHandle(item)}} type="button">a</button>
            <button onClick={() => {flyToLayer(item)}} type="button">s</button>
            <button onClick={() => {deleteLayer(item)}} type="button">d</button>
        </div>
    );
};
