import App from "../app/App.js";
import { div, p, span } from "../app/element-maker.js";
export default class TaskInfo extends HTMLElement {
    constructor(task, deleteFunc) {
        super();
        this.dataset.done = task.done ? "true" : "";
        this.append(div({
            ondblclick: () => this.toggleDone(task.timestamp),
            innerHTML: [
                span(task.text),
                p(task.dueDate),
            ]
        }), div({
            class: "grid center",
            innerHTML: span({
                class: "delete-btn",
                innerHTML: "×",
                onclick: e => deleteFunc(e.target, task.timestamp)
            })
        }));
    }
    toggleDone(id) {
        const done = this.dataset.done === "true";
        this.dataset.done = (done) ? "" : "true";
        App.dispatch(App.EventList.TASK_UPDATE, { id, done: !done });
    }
}
