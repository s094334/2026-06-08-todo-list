let data = [];
let currentTab = 'all';
const todoItems = document.querySelector(".todoList_item");

// 渲染畫面
function renderData(currentTab) {
    const filteredData = filterTab(currentTab);
    let template = '';
    filteredData.forEach(function(item) {
        const { id, completed, content } = item
        template += `
        <li data-id="${id}">
            <label class="todoList_label">
                <input class="todoList_input" type="checkbox" value="true" ${completed ? 'checked' : ''}>
                <span>${content}</span>
            </label>
            <a href="#">
                <i class="fa fa-times"></i>
            </a>
        </li>
        `
    })

    todoItems.innerHTML = template;
    completedCount(data);
}

// 新增 todo
const addBtn = document.querySelector(".addBtn");
const todoText = document.querySelector(".txt");

addBtn.addEventListener("click", function(e) {
    e.preventDefault();
    if (todoText.value.trim() === '') {
        alert("不能輸入空白值");
        return
    }
    let todoData = {
        id: Date.now(), 
        content: todoText.value,
        completed: false
    };
    data.push(todoData);
    todoText.value = '';
    renderData(currentTab);
})

// 更新 todo 狀態
todoItems.addEventListener("click", function(e) {
    const list = e.target.closest('li');
    const todoId = Number(list.dataset.id);

    const findTodo = data.find(({ id }) => id === todoId);
    findTodo.completed = e.target.checked;

    completedCount(data);
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
    switch (filter) {
        case 'pending':
            return data.filter(({ completed }) => !completed);
        case 'completed':
            return data.filter(({ completed }) => completed);
        default: 
            return data;
    }
}

// 計算已完成的項目
function completedCount(data) {
    const completedCount = data
        .filter(({ completed }) => completed)
        .length;
    const el = document.querySelector(".todoList_statistics p");
    el.textContent = `${completedCount} 個已完成項目`;
}

// 刪除 todo
todoItems.addEventListener("click", function(e) {
    if (!e.target.closest('a')) return;
    e.preventDefault();

    const list = e.target.closest('li');
    const todoId = Number(list.dataset.id);
    
    const index = data.findIndex(({ id }) => id === todoId);
    data.splice(index, 1);
    
    renderData(currentTab);
})

// 清除已完成項目
const delAllBtn = document.querySelector(".todoList_statistics a");
delAllBtn.addEventListener("click", function(e) {
    e.preventDefault();
    data = data.filter(({ completed }) => completed === false);

    renderData(currentTab);
})