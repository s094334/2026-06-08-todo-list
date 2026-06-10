let data = [];
let currentTab = 'all';
const todoItems = document.querySelector(".todoList_item");

// 渲染畫面
function renderData(currentTab) {
    const filterData = filterTab(currentTab);
    let str = '';
    filterData.forEach(function(item) {
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
    renderData(currentTab)
})

// 更新 todo 狀態
todoItems.addEventListener("click", function(e) {
    const list = e.target.closest('li');
    const todoId = Number(list.dataset.id);

    const findTodo = data.find(item => item.id === todoId);
    findTodo.completed = e.target.checked;
})

// 顯示全部、待完成還是已完成
const todoListTab = document.querySelector('.todoList_tab');

todoListTab.addEventListener("click", function(e) {
    e.preventDefault();

    const allTabs = todoListTab.querySelectorAll('a');
    allTabs.forEach(function(tab) {
        tab.classList.remove("active");
    })

    const tab = e.target.closest('a');
    tab.classList.add("active");

    const filter = tab.dataset.tab;
    currentTab = filter;
    renderData(currentTab)
})

// 篩選不同的 todo
function filterTab(filter) {
    if (filter === 'pending') {
        return data.filter(item => item.completed === false)
    } else if (filter === 'completed') {
        return data.filter(item => item.completed === true)
    }
    return data
}