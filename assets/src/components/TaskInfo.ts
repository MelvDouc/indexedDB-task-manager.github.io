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
    this.addEventListener("dblclick", (e) => {
      this.toggleDone(<HTMLElement>e.target, task.timestamp);
    });
  }

  private toggleDone(target: HTMLElement, id: number): void {
    const parent = target.closest(`.task-info`) as HTMLElement;
    const done = parent.dataset.done === "true";
    parent.dataset.done = (done) ? "" : "true";
    App.dispatch(App.EventList.TASK_UPDATE, { id, done: !done });
  }
}