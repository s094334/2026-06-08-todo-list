let data = [
    {
        'content': '寫作業',
    }
];

// 渲染畫面
function renderData() {
    let str = '';
    data.forEach(function(item) {
        str += `
        <li>
            <label class="todoList_label">
                <input class="todoList_input" type="checkbox" value="true">
                <span>${item.content}</span>
            </label>
            <a href="#">
                <i class="fa fa-times"></i>
            </a>
        </li>
        `
    })

    const todoItems = document.querySelector(".todoList_item");
    todoItems.innerHTML = str;
}

// 新增筆記
const addBtn = document.querySelector(".addBtn");
const todoText = document.querySelector(".txt");

addBtn.addEventListener("click", function(e) {
    e.preventDefault();
    if (todoText.value === '') {
        alert("不能輸入空白值");
        return
    }
    let todoData = {};
    todoData.content = todoText.value;
    data.push(todoData);
    renderData()
})

