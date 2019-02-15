// Container prototypes ================================================================================================

Object.defineProperty(StructureContainer.prototype, 'energy', {
    get(): number {
        return this.store[RESOURCE_ENERGY];
    },
    configurable: true,
});

Object.defineProperty(StructureContainer.prototype, 'isFull', { // if this container-like object is full
    get(): boolean {
        return _.sum(this.store) >= this.storeCapacity;
    },
    configurable: true,
});
Object.defineProperty(StructureContainer.prototype, 'isEmpty', { // if this container-like object is empty
    get(): boolean {
        return _.sum(this.store) === 0;
    },
    configurable: true,
});
