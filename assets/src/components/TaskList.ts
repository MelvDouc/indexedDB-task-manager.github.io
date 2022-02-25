import App from "../app/App.js";
import { li } from "../app/element-maker.js";
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
      li([
        new TaskInfo(task, this.handleDelete.bind(this)),
      ])
    );
  }

  private handleDelete(target: HTMLElement, id: number): void {
    const parentElement = target.closest("li");
    App.dispatch(App.EventList.TASK_DELETION, id);
    parentElement.remove();
  }
}