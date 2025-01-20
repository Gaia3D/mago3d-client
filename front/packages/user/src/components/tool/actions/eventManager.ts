import * as Cesium from "cesium";

export const eventManager = {
    screenSpaceEventHandler: undefined as Cesium.ScreenSpaceEventHandler | undefined,
    handlers: new Map<Cesium.ScreenSpaceEventType, (event: any) => void>(),
    globalHandlers: new Map<string, EventListener>(),

    init(viewer: Cesium.Viewer) {
        if (!this.screenSpaceEventHandler) {
            this.screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        }
    },

    addHandler(eventType: Cesium.ScreenSpaceEventType, handler: (event: any) => void) {
        if (!this.screenSpaceEventHandler) throw new Error("EventManager not initialized");
        if (this.handlers.has(eventType)) {
            this.removeHandler(eventType);
        }
        this.handlers.set(eventType, handler);
        this.screenSpaceEventHandler.setInputAction(handler, eventType);
    },

    removeHandler(eventType: Cesium.ScreenSpaceEventType) {
        if (!this.screenSpaceEventHandler) return;
        this.screenSpaceEventHandler.removeInputAction(eventType);
        this.handlers.delete(eventType);
    },

    addGlobalHandler(eventType: string, handler: EventListener) {
        if (this.globalHandlers.has(eventType)) {
            this.removeGlobalHandler(eventType);
        }
        document.addEventListener(eventType, handler);
        this.globalHandlers.set(eventType, handler);
    },

    removeGlobalHandler(eventType: string) {
        const handler = this.globalHandlers.get(eventType);
        if (handler) {
            document.removeEventListener(eventType, handler);
            this.globalHandlers.delete(eventType);
        }
    },

    destroy() {
        if (this.screenSpaceEventHandler) {
            this.handlers.forEach((_, eventType) => this.removeHandler(eventType));
            this.screenSpaceEventHandler = undefined;
        }
        this.globalHandlers.forEach((_, eventType) => this.removeGlobalHandler(eventType));
    },
};
