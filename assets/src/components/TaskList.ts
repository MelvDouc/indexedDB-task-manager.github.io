import App from "../app/App.js";
import { span, div, li, p } from "../app/element-maker.js";
import { TaskInterface } from "../app/TaskDatabase.js";

export default class TaskList extends HTMLUListElement {
  constructor() {
    super();
  }

  public connectedCallback(): void {
    App.listen(App.EventList.INITIAL_TASKS_DISPATCH, (e: CustomEvent<TaskInterface[]>) => {
      e.detail.forEach(todo => this.addItem(todo));
    });
    App.listen(App.EventList.TASK_CREATION, (e: CustomEvent<TaskInterface>) => {
      this.addItem(e.detail);
    });
  }

  private addItem({ timestamp, done, text, dueDate }: TaskInterface): void {
    this.append(
      li({
        "data-timestamp": timestamp,
        innerHTML: [
          div({
            class: "task-info",
            "data-done": done ? "true" : "",
            ondblclick: e => {
              this.toggleDone(<HTMLElement>e.target, timestamp);
            },
            innerHTML: [
              div(text),
              p(dueDate),
            ]
          }),
          span({
            class: "delete-btn grid center",
            innerHTML: "×",
            onclick: e => this.handleDelete(<HTMLElement>e.target, timestamp)
          })
        ]
      })
    );
  }

  private toggleDone(target: HTMLElement, id: number): void {
    const parent = target.closest(`.task-info`) as HTMLElement;
    const done = parent.dataset.done === "true";
    parent.dataset.done = (done) ? "" : "true";
    App.dispatch(
      App.EventList.TASK_UPDATE, {
      id,
      done: !done
    });
  }

  private handleDelete(target: HTMLElement, timestamp: number): void {
    const parentElement = target.closest("li");
    App.dispatch(
      App.EventList.TASK_DELETION,
      timestamp
    );
    parentElement.remove();
  }
}