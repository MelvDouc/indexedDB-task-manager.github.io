import App from "../app/App.js";
import { button, div, input } from "../app/element-maker.js";
export default class NewTaskForm extends HTMLFormElement {
    textInput;
    dateInput;
    constructor() {
        super();
        this.textInput = input({
            class: "text",
            type: "text",
            placeholder: "What to do?",
            required: ""
        });
        this.dateInput = input({
            class: "due-date",
            type: "text",
            placeholder: "When?"
        });
        this.append(div({
            class: "left flex nowrap",
            innerHTML: [
                this.textInput,
                this.dateInput
            ]
        }), div({
            class: "right grid center",
            innerHTML: button({ type: "submit", innerHTML: "Add" })
        }));
    }
    get formData() {
        return {
            text: this.textInput.value,
            dueDate: this.dateInput.value,
            timestamp: Date.now(),
            done: false
        };
    }
    connectedCallback() {
        this.addEventListener("submit", (e) => {
            e.preventDefault();
            App.dispatch(App.EventList.TASK_CREATION, this.formData);
            this.reset();
            this.textInput.focus();
        });
    }
}
