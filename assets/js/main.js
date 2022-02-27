import TaskList from "./components/TaskList.js";
import TaskForm from "./components/TaskForm.js";
import App from "./app/App.js";
import TaskInfo from "./components/TaskInfo.js";
customElements.define("task-info", TaskInfo);
customElements.define("task-form", TaskForm, { extends: "form" });
customElements.define("task-list", TaskList, { extends: "ul" });
await App.init();
