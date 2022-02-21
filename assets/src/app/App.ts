import TaskDatabase, { TaskInterface } from "./TaskDatabase.js";

const App = (() => {
  const App = document.getElementById("App");
  const taskDb = new TaskDatabase();
  enum EventList {
    INITIAL_TASKS_DISPATCH = "initial-tasks-dispatch",
    TASK_CREATION = "new-task",
    TASK_UPDATE = "task-update",
    TASK_DELETION = "delete-task"
  }

  const dispatch = (eventType: EventList, detail: any) => {
    App.dispatchEvent(
      new CustomEvent(eventType, { detail })
    );
  };

  const listen = (eventType: EventList, listener: (e?: CustomEvent<any>) => any) => {
    App.addEventListener(eventType, listener as EventListenerOrEventListenerObject);
  };

  const init = async () => {
    await taskDb.openDb();
    const tasks = await taskDb.getTasks();
    dispatch(EventList.INITIAL_TASKS_DISPATCH, tasks);
    listen(EventList.TASK_CREATION, async (e: CustomEvent<TaskInterface>) => {
      await taskDb.addTask(e.detail);
    });
    listen(EventList.TASK_UPDATE, async ({ detail }) => {
      const task = await taskDb.getTaskById(detail.id) as any;
      if (!task)
        return;
      await taskDb.updateTask({ ...task, done: detail.done });
    });
    listen(EventList.TASK_DELETION, async (e: CustomEvent<number>) => {
      await taskDb.deleteTaskById(e.detail);
    });
  };

  return {
    EventList,
    dispatch,
    listen,
    init
  };
})();

export default App;