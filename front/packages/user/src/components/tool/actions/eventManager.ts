import * as Cesium from "cesium";

export const eventManager = {
    screenSpaceEventHandler: undefined as Cesium.ScreenSpaceEventHandler | undefined,
    eventGroups: new Map<string, { type: Cesium.ScreenSpaceEventType; handler: (event: any) => void }[]>(),
    globalEventGroups: new Map<string, { type: string; handler: EventListener }[]>(),

    init(viewer: Cesium.Viewer) {
        if (!this.screenSpaceEventHandler) {
            this.screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        }
    },

    addHandler(groupId: string, eventType: Cesium.ScreenSpaceEventType, handler: (event: any) => void) {
        if (!this.screenSpaceEventHandler) throw new Error("EventManager not initialized");

        if (!this.eventGroups.has(groupId)) {
            this.eventGroups.set(groupId, []);
        }

        this.eventGroups.get(groupId)?.push({ type: eventType, handler });
        this.screenSpaceEventHandler.setInputAction(handler, eventType);
    },

    removeHandler(groupId: string) {
        const group = this.eventGroups.get(groupId);
        if (group && this.screenSpaceEventHandler) {
            group.forEach(({ type }) => {
                this.screenSpaceEventHandler?.removeInputAction(type);
            });
            this.eventGroups.delete(groupId);
        }
    },

    addGlobalHandler(groupId: string, eventType: string, handler: EventListener) {
        if (!this.globalEventGroups.has(groupId)) {
            this.globalEventGroups.set(groupId, []);
        }

        this.globalEventGroups.get(groupId)?.push({ type: eventType, handler });
        document.addEventListener(eventType, handler);
    },

    removeGlobalHandler(groupId: string) {
        const group = this.globalEventGroups.get(groupId);
        if (group) {
            group.forEach(({ type, handler }) => {
                document.removeEventListener(type, handler);
            });
            this.globalEventGroups.delete(groupId);
        }
    },

    removeSpecificHandler(groupId: string, eventType: Cesium.ScreenSpaceEventType) {
        const group = this.eventGroups.get(groupId);
        if (group && this.screenSpaceEventHandler) {
            const index = group.findIndex(({ type }) => type === eventType);
            if (index !== -1) {
                this.screenSpaceEventHandler.removeInputAction(eventType);
                group.splice(index, 1);
            }
            if (group.length === 0) {
                this.eventGroups.delete(groupId);
            }
        }
    },

    destroyGroup(groupId: string) {
        this.removeHandler(groupId);
        this.removeGlobalHandler(groupId);
    },

    destroyAll() {
        if (this.screenSpaceEventHandler) {
            Array.from(this.eventGroups.keys()).forEach((groupId) => this.removeHandler(groupId));
            this.screenSpaceEventHandler = undefined;
        }
        Array.from(this.globalEventGroups.keys()).forEach((groupId) => this.removeGlobalHandler(groupId));
    },
};
