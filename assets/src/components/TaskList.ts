import App from "../app/App.js";
import { span, li } from "../app/element-maker.js";
import { TaskInterface } from "../app/TaskDatabase.js";
import TaskInfo from "./TaskInfo.js";

export default class TaskList extends HTMLUListElement {
  constructor() {
    super();
  }

  public connectedCallback(): void {
    App.listen(App.EventList.INITIAL_TASKS_DISPATCH, (e: CustomEvent<TaskInterface[]>) => {
      e.detail.forEach(task => this.addItem(task));
    });
    App.listen(App.EventList.TASK_CREATION, (e: CustomEvent<TaskInterface>) => {
      this.addItem(e.detail);
    });
  }

  private addItem(task: TaskInterface): void {
    this.append(
      li({
        "data-timestamp": task.timestamp,
        innerHTML: [
          new TaskInfo(task),
          span({
            class: "delete-btn grid center",
            innerHTML: "×",
            onclick: e => this.handleDelete(<HTMLElement>e.target, task.timestamp)
          })
        ]
      })
    );
  }

  private handleDelete(target: HTMLElement, id: number): void {
    const parentElement = target.closest("li");
    App.dispatch(App.EventList.TASK_DELETION, id);
    parentElement.remove();
  }
}