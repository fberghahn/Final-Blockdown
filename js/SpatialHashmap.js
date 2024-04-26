export class SpatialHashmap {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.hashmap = new Map();
    }

    getGridCell(x, y) {
        return `x${Math.floor(x / this.gridSize)}y${Math.floor(y / this.gridSize)}`;
    }

    addObject(object) {
        const cell = this.getGridCell(object.x, object.y);
        if (!this.hashmap.has(cell)) {
            this.hashmap.set(cell, []);
        }
        this.hashmap.get(cell).push(object);
    }

    removeObject(object) {
        const cell = this.getGridCell(object.x, object.y);
        if (this.hashmap.has(cell)) {
            const objectsInCell = this.hashmap.get(cell);
            const index = objectsInCell.indexOf(object);
            if (index > -1) {
                objectsInCell.splice(index, 1);
            }
            // Check if the cell is now empty, and if so, remove it from the hashmap
            if (objectsInCell.length === 0) {
                this.hashmap.delete(cell);
            }
        }
    }
    updateObjectPosition(object, oldX, oldY) {
        const oldCell = this.getGridCell(oldX, oldY);
        const newCell = this.getGridCell(object.x, object.y);
        if (oldCell !== newCell) {
            const objectsInOldCell = this.hashmap.get(oldCell);
            const index = objectsInOldCell.indexOf(object);
            if (index > -1) {
                objectsInOldCell.splice(index, 1);
            }
            this.addObject(object);
        }
    }

    getPotentialCollisions(object) {
        const cell = this.getGridCell(object.x, object.y);
        const candidates = this.hashmap.get(cell) || [];
        return candidates.filter(candidate => candidate !== object);
    }
}