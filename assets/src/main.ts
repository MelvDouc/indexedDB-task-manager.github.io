import TaskList from "./components/TaskList.js";
import TaskForm from "./components/TaskForm.js";
import App from "./app/App.js";

customElements.define("task-form", TaskForm, { extends: "form" });
customElements.define("task-list", TaskList, { extends: "ul" });

await App.init();