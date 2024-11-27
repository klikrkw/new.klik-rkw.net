const EventBus = {
    on(event: any, callback: (e: Event) => void) {
        document.addEventListener(event, (e: { detail: any }) =>
            callback(e.detail)
        );
    },
    dispatch(event: any, data: {}) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
    remove(event: any, callback: () => void) {
        document.removeEventListener(event, callback);
    },
};

export default EventBus;
