import { getToDos } from "./getToDos.js";

const tbody = document.querySelector("table#todos")

const addRow = (newItem) => {
    const titleColumn = document.createElement("td");
    const completedColumn = document.createElement("td");
    const rowElement = document.createElement("tr")
    const completedCheckbox = document.createElement("input")

    titleColumn.textContent = newItem.title;
    completedCheckbox.type = "checkbox";
    completedCheckbox.checked = newItem.completed;

    completedColumn.append(completedCheckbox) = newItem.completed;
    rowElement.append(titleColumn, completedColumn);
    tbody.append(rowElement);
}

const populateTable = async () => {
    const toDos = await getToDos();

    toDos.forEach(toDoItem => addRow(toDoItem)
    );
};

export { populateTable };