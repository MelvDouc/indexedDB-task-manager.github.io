import App from "../app/App.js";
import { li } from "../app/element-maker.js";
import TaskInfo from "./TaskInfo.js";
export default class TaskList extends HTMLUListElement {
    constructor() {
        super();
    }
    connectedCallback() {
        App.listen(App.EventList.INITIAL_TASKS_DISPATCH, (e) => {
            e.detail.forEach(task => this.addItem(task));
        });
        App.listen(App.EventList.TASK_CREATION, (e) => {
            this.addItem(e.detail);
        });
    }
    addItem(task) {
        this.append(li([
            new TaskInfo(task, this.handleDelete.bind(this)),
        ]));
    }
    handleDelete(target, id) {
        const parentElement = target.closest("li");
        App.dispatch(App.EventList.TASK_DELETION, id);
        parentElement.remove();
    }
}
