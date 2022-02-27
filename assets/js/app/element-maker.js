const isDictionary = (arg) => {
    return !!arg && Object.getPrototypeOf(arg) === Object.prototype;
};
const makeElement = (tagName) => {
    return (arg) => {
        const element = document.createElement(tagName);
        switch (true) {
            case arg == null:
                break;
            case typeof arg === "string":
            case arg instanceof HTMLElement:
                element.append(arg);
                break;
            case Array.isArray(arg):
                element.append(...arg);
                break;
            case isDictionary(arg):
                for (const key in arg) {
                    const value = arg[key];
                    if (key.startsWith("on")) {
                        element.addEventListener(key.slice(2), value);
                        continue;
                    }
                    if (key === "innerHTML") {
                        Array.isArray(value)
                            ? element.append(...value)
                            : element.append(value);
                        continue;
                    }
                    element.setAttribute(key, value);
                }
                break;
            default:
                throw new SyntaxError("Invalid argument.");
        }
        return element;
    };
};
export const button = makeElement("button");
export const input = makeElement("input");
export const div = makeElement("div");
export const li = makeElement("li");
export const p = makeElement("p");
export const span = makeElement("span");
