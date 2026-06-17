let data = [];
let currentTab = 'all';
const todoItems = document.querySelector(".todoList_item");
const jsonServerUrl = "http://localhost:3000/todos";

// 宣告非同步函式去拉 todo 資料
function getTodos(currentTab) {
    let url = '';
    switch (currentTab) {
        case 'pending':
            url = `${jsonServerUrl}?completed=false`;
            break;
        case 'completed':
            url = `${jsonServerUrl}?completed=true`;
            break;
        default:
            url = jsonServerUrl;
    }
    return fetch(url)
        .then(function(response) {
            if (!response.ok) {
                return { success: false, error: `HTTP ${response.status}` };
            }
            return response.json();
        })
        .catch(function(error) {
            console.error(error.message);
        });
};

// 渲染畫面
function renderData() {
    return getTodos(currentTab)
        .then(function(todos) {
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
            completedCount();
        })
        .catch(function(error) {
            console.error(error.message);
        });
}

renderData()

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

    renderData(currentTab);
})

function addTodo(content) {
    return fetch(jsonServerUrl,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: Date.now(),
                content: content,
                completed: false
            })
        })
        .then(function(response) {
            if (!response.ok) {
                return { success: false, error: `HTTP ${response.status}` };
            }
            return response.json();
        })
        .catch(function(error) {
            console.error(error.message);
        });
}

// 更新 todo 狀態
todoItems.addEventListener("change", function(e) {
    const list = e.target.closest('li');
    const todoId = list.dataset.id;

    updateTodo(todoId, e.target.checked);
    renderData(currentTab);
})

function updateTodo(todoId, completed) {
    return fetch(`${jsonServerUrl}/${todoId}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    completed: completed
                })
            }
        )
        .then(function(response) {
            if (!response.ok) {
                return { success: false, error: `HTTP ${response.status}` };
            }
            return response.json();
        })
        .catch(function(error) {
            console.error(error.message);
        });
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

    currentTab = tab.dataset.tab;
    renderData(currentTab);
})

// 計算已完成的項目
function completedCount() {
    return fetch(`${jsonServerUrl}?completed=true`)
        .then(function(response) {
            if (!response.ok) {
                return { success: false, error: `HTTP ${response.status}` };
            }
            return response.json();
        })
        .then(function(data) {
            const el = document.querySelector(".todoList_statistics p");
            el.textContent = `${data.length} 個已完成項目`;
        })
        .catch(function(error) {
            console.error(error.message);
        });
}

// 刪除 todo
todoItems.addEventListener("click", function(e) {
    if (!e.target.closest('a')) return;
    e.preventDefault();

    const list = e.target.closest('li');
    const todoId = list.dataset.id;
    deleteTodo(todoId);
    renderData(currentTab);
})

function deleteTodo(todoId) {
    return fetch(`${jsonServerUrl}/${todoId}`,
            {
                method: 'DELETE',
            }
        )
        .then(function(response) {
            if (!response.ok) {
                return { success: false, error: `HTTP ${response.status}` };
            }
            return response.json();
        })
        .catch(function(error) {
            console.error(error.message);
        });
}