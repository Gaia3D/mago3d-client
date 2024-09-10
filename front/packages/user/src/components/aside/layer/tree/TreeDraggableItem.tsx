import {FC, useEffect, useRef, useState} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useFlyToLayer} from "@/hooks/useFlyToLayer.ts";
import useLayerVisibilityToggle from "@/hooks/useLayerVisibilityToggle.ts";
import {useDeleteLayer} from "@/hooks/useDeleteLayer.ts";
import {useRecoilValueLoadable} from "recoil";
import {currentUserProfileSelector} from "@/recoils/Auth.ts";

interface DraggableItemProps {
    id: string;
    text: string;
    index: number;
    groupIndex: number;
    moveItem: (dragGroupIndex: number, dragItemIndex: number, hoverGroupIndex: number, hoverItemIndex: number) => void;
    item: UserLayerAsset;
    userId: string;
}

interface DragItem {
    index: number;
    id: number;
    type: string;
    groupIndex: number;
}

export const TreeDraggableItem: FC<DraggableItemProps> = ({ id, text, index, groupIndex, moveItem, item, userId }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { flyToLayer } = useFlyToLayer();
    const { layerVisibilityToggle } = useLayerVisibilityToggle();
    const { deleteLayer } = useDeleteLayer();

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

    return (
        <div ref={ref} className="layer-node-container" >
            <span className="type type-3d"></span>
            <span className="layer-name">{text}</span>
            <div className="layer-button">
                <button
                    type="button"
                    onClick={() => {layerVisibilityToggle(item)}}
                    className={`layer-funtion-button ${item.visible ? 'visible' : 'not-visible'}`}
                ></button>
                <button
                    type="button"
                    onClick={() => {flyToLayer(item)}}
                    className="layer-funtion-button map-view"
                ></button>
                { item.createdBy === userId && (
                    <button
                        type="button"
                        onClick={() => {deleteLayer(item)}}
                        className="layer-funtion-button delete"
                    ></button>
                )}
            </div>
        </div>
    );
};
