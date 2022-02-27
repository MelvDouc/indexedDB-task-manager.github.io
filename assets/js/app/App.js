import TaskDatabase from "./TaskDatabase.js";
const App = (() => {
    const App = document.getElementById("App");
    const taskDb = new TaskDatabase();
    let EventList;
    (function (EventList) {
        EventList["INITIAL_TASKS_DISPATCH"] = "initial-tasks-dispatch";
        EventList["TASK_CREATION"] = "new-task";
        EventList["TASK_UPDATE"] = "task-update";
        EventList["TASK_DELETION"] = "delete-task";
    })(EventList || (EventList = {}));
    const dispatch = (eventType, detail) => {
        App.dispatchEvent(new CustomEvent(eventType, { detail }));
    };
    const listen = (eventType, listener) => {
        App.addEventListener(eventType, listener);
    };
    const init = async () => {
        await taskDb.openDb();
        const tasks = await taskDb.getTasks();
        dispatch(EventList.INITIAL_TASKS_DISPATCH, tasks);
        listen(EventList.TASK_CREATION, async (e) => {
            await taskDb.addTask(e.detail);
        });
        listen(EventList.TASK_UPDATE, async ({ detail }) => {
            const task = await taskDb.getTaskById(detail.id);
            if (!task)
                return;
            await taskDb.updateTask({ ...task, done: detail.done });
        });
        listen(EventList.TASK_DELETION, async (e) => {
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
