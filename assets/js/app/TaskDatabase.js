export default class TaskDatabase {
    dbName = "ToDoList";
    storeName = "to-do";
    version = 1;
    db;
    get store() {
        return this.db
            .transaction([this.storeName], "readwrite")
            .objectStore(this.storeName);
    }
    openDb() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.dbName, this.version);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (db.objectStoreNames.contains(this.storeName))
                    db.deleteObjectStore(this.storeName);
                db.createObjectStore(this.storeName, { keyPath: "timestamp" });
                this.db = db;
                resolve(true);
            };
            req.onsuccess = (e) => {
                const db = e.target.result;
                this.db = db;
                resolve(true);
            };
            req.onerror = (e) => reject(e.target.errorCode);
        });
    }
    promisifyRequest(req, getResolveValue) {
        return new Promise((resolve, reject) => {
            req.onsuccess = (e) => {
                return resolve(getResolveValue(e));
            };
            req.onerror = (e) => reject(e.target.errorCode);
        });
    }
    async getTaskById(id) {
        return this.promisifyRequest(this.store.get(id), e => e.target.result);
    }
    async getTasks() {
        return await this.promisifyRequest(this.store.getAll(IDBKeyRange.lowerBound(0)), (e) => e.target.result);
    }
    async addTask(task) {
        return await this.promisifyRequest(this.store.put(task), (e) => e.target.result);
    }
    updateTask(task) {
        return this.promisifyRequest(this.store.put(task), e => e.target.result);
    }
    deleteTaskById(id) {
        return this.promisifyRequest(this.store.delete(id), e => e.target.result);
    }
}
