let data = [];
const todoItems = document.querySelector(".todoList_item");

// 渲染畫面
function renderData() {
    let str = '';
    data.forEach(function(item) {
        str += `
        <li data-id="${item.id}">
            <label class="todoList_label">
                <input class="todoList_input" type="checkbox" value="true" ${item.completed ? 'checked' : ''}>
                <span>${item.content}</span>
            </label>
            <a href="#">
                <i class="fa fa-times"></i>
            </a>
        </li>
        `
    })

    todoItems.innerHTML = str;
}

// 新增 todo
const addBtn = document.querySelector(".addBtn");
const todoText = document.querySelector(".txt");

addBtn.addEventListener("click", function(e) {
    e.preventDefault();
    if (todoText.value === '') {
        alert("不能輸入空白值");
        return
    }
    let todoData = {
        id: Date.now(), 
        content: todoText.value,
        completed: false
    };
    data.push(todoData);
    renderData()
})

// 更新 todo 狀態
todoItems.addEventListener("click", function(e) {
    const list = e.target.closest('li');
    const todoId = Number(list.dataset.id);

    const findTodo = data.find(item => item.id === todoId);
    findTodo.completed = e.target.checked;
})