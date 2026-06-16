let data = [];
let currentTab = 'all';
const todoItems = document.querySelector(".todoList_item");
const jsonServerUrl = "http://localhost:3000/todos";

// 宣告非同步函式去拉 todo 資料
async function getTodos() {
    try {
        const response = await fetch(jsonServerUrl);

        if (!response.ok) {
            return { success: false, error: `HTTP ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.message);
    }
};

// 渲染畫面
async function renderData() {
    try {
        const todos = await getTodos();

        let template = '';
        todos.forEach(function(item) {
            const { id, completed, content } = item;
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
        });

        todoItems.innerHTML = template;
    } catch (error) {
        console.error(error.message);
    }
}

renderData();

// 新增 todo
const addBtn = document.querySelector(".addBtn");
const todoText = document.querySelector(".txt");

addBtn.addEventListener("click", function(e) {
    e.preventDefault();
    if (todoText.value.trim() === '') {
        alert("不能輸入空白值");
        return
    }
    addTodo(todoText.value);
    todoText.value = '';
})

async function addTodo(content) {
    try {
        const response = await fetch(jsonServerUrl,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: Date.now(),
                    content: content,
                    completed: false
                })
            }
        );

        if (!response.ok) {
            return { success: false, error: `HTTP ${response.status}` };
        }

        await response.json();
        await renderData();
    } catch (error) {
        console.error(error.message);
    }
}

// 更新 todo 狀態
todoItems.addEventListener("change", function(e) {
    const list = e.target.closest('li');
    const todoId = list.dataset.id;

    updateTodo(todoId, e.target.checked)
})

async function updateTodo(todoId, completed) {
    try {
        const response = await fetch(`${jsonServerUrl}/${todoId}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    completed: completed
                })
            }
        );

        if (!response.ok) {
            return { success: false, error: `HTTP ${response.status}` };
        }

        await response.json();
        await renderData();
    } catch (error) {
        console.error(error.message);
    }
}

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

    const filterTab = tab.dataset.tab;
    currentTab = filterTab;
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
    const todoId = list.dataset.id;
    deleteTodo(todoId)
})

async function deleteTodo(todoId) {
    try {
        const response = await fetch(`${jsonServerUrl}/${todoId}`,
            {
                method: 'DELETE',
            }
        );

        if (!response.ok) {
            return { success: false, error: `HTTP ${response.status}` };
        }

        await renderData();
    } catch (error) {
        console.error(error.message);
    }
}

// 清除已完成項目
const delAllBtn = document.querySelector(".todoList_statistics a");
delAllBtn.addEventListener("click", function(e) {
    e.preventDefault();
    data = data.filter(({ completed }) => completed === false);

    renderData(currentTab);
})