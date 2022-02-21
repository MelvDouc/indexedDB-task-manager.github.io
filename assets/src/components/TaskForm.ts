import App from "../app/App.js";
import { button, div, input } from "../app/element-maker.js";
import { TaskInterface } from "../app/TaskDatabase.js";

export default class NewTaskForm extends HTMLFormElement {
  private textInput: HTMLInputElement;
  private dateInput: HTMLInputElement;

  constructor() {
    super();
    this.textInput = input({
      class: "text",
      type: "text",
      placeholder: "What to do?",
      required: ""
    }) as HTMLInputElement;
    this.dateInput = input({
      class: "due-date",
      type: "text",
      placeholder: "When?"
    }) as HTMLInputElement;
    this.append(
      div({
        class: "left flex nowrap",
        innerHTML: [
          this.textInput,
          this.dateInput
        ]
      }),
      div({
        class: "right grid center",
        innerHTML: button({ type: "submit", innerHTML: "Add" })
      })
    );
  }

  private get formData() {
    return {
      text: this.textInput.value,
      dueDate: this.dateInput.value,
      timestamp: Date.now(),
      done: false
    } as TaskInterface;
  }

  public connectedCallback(): void {
    this.addEventListener("submit", (e) => {
      e.preventDefault();
      App.dispatch(App.EventList.TASK_CREATION, this.formData);
      this.reset();
      this.textInput.focus();
    });
  }
}