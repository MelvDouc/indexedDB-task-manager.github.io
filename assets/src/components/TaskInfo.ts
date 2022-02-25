import App from "../app/App.js";
import { div, p, span } from "../app/element-maker.js";
import { TaskInterface } from "../app/TaskDatabase.js";

export default class TaskInfo extends HTMLElement {
  constructor(task: TaskInterface, deleteFunc: Function) {
    super();
    this.dataset.done = task.done ? "true" : "";
    this.append(
      div({
        ondblclick: () => this.toggleDone(task.timestamp),
        innerHTML: [
          span(task.text),
          p(task.dueDate),
        ]
      }),
      div({
        class: "grid center",
        innerHTML: span({
          class: "delete-btn",
          innerHTML: "×",
          onclick: e => deleteFunc(<HTMLElement>e.target, task.timestamp)
        })
      })
    );
  }

  private toggleDone(id: number): void {
    const done = this.dataset.done === "true";
    this.dataset.done = (done) ? "" : "true";
    App.dispatch(App.EventList.TASK_UPDATE, { id, done: !done });
  }
}