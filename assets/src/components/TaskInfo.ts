import App from "../app/App.js";
import { div, p } from "../app/element-maker.js";
import { TaskInterface } from "../app/TaskDatabase.js";

export default class TaskInfo extends HTMLElement {
  constructor(task: TaskInterface) {
    super();
    this.dataset.done = task.done ? "true" : "";
    this.append(
      div(task.text),
      p(task.dueDate)
    );
    this.addEventListener("dblclick", () => {
      this.toggleDone(task.timestamp);
    });
  }

  private toggleDone(id: number): void {
    const done = this.dataset.done === "true";
    this.dataset.done = (done) ? "" : "true";
    App.dispatch(App.EventList.TASK_UPDATE, { id, done: !done });
  }
}