export interface TaskInterface {
  timestamp: number;
  text: string;
  dueDate: string;
  done: boolean;
}

export default class TaskDatabase {
  private readonly dbName: string = "ToDoList";
  private readonly storeName: string = "to-do";
  private version: number = 1;
  private db: IDBDatabase;

  private get store() {
    return this.db
      .transaction([this.storeName], "readwrite")
      .objectStore(this.storeName);
  }

  public openDb(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.version);

      req.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (db.objectStoreNames.contains(this.storeName))
          db.deleteObjectStore(this.storeName);
        db.createObjectStore(this.storeName, { keyPath: "timestamp" });
        this.db = db;
        resolve(true);
      };

      req.onsuccess = (e: any) => {
        const db = e.target.result;
        this.db = db;
        resolve(true);
      };

      req.onerror = (e: any) => reject(e.target.errorCode);
    });
  }

  private promisifyRequest(req: IDBRequest, getResolveValue: (e: any) => any) {
    return new Promise((resolve, reject) => {
      req.onsuccess = (e: any) => {
        return resolve(getResolveValue(e));
      };
      req.onerror = (e: any) => reject(e.target.errorCode);
    });
  }

  public async getTaskById(id: number) {
    return this.promisifyRequest(
      this.store.get(id),
      e => e.target.result as TaskInterface
    );
  }

  public async getTasks() {
    return await this.promisifyRequest(
      this.store.getAll(IDBKeyRange.lowerBound(0)),
      (e) => e.target.result as TaskInterface[]
    );
  }

  public async addTask(task: TaskInterface) {
    return await this.promisifyRequest(
      this.store.put(task),
      (e) => e.target.result
    );
  }

  public updateTask(task: TaskInterface) {
    return this.promisifyRequest(
      this.store.put(task),
      e => e.target.result
    );
  }

  public deleteTaskById(id: number) {
    return this.promisifyRequest(
      this.store.delete(id),
      e => e.target.result
    );
  }
}