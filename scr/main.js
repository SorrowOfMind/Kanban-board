const taskHandler = {

    input: document.getElementById('user-input'),
    board: document.querySelector('.tasks-board'),
    todo: document.querySelector('.list-todo'),
    inprogress: document.querySelector('.list-inprogress'),
    done: document.querySelector('.list-done'),
    refresh: document.getElementById('refresh-icon'),
    tooltip: document.getElementById('tooltip'),

    lists: document.querySelectorAll('ul'),

    itemArr: [],
    idx: 0,
    idxArr: [],

    showTooltip() {
        this.refresh.addEventListener('mouseenter', function () {
            setTimeout(() => {
                tooltip.style.opacity = 1;
            }, 500);

        });
        this.refresh.addEventListener('mouseleave', function () {
            tooltip.style.opacity = 0;
        });
    },

    createItem(content, idx, status = 'pending') {
        if (content) {
            let item = document.createElement('li');
            item.classList.add('item');
            item.setAttribute("draggable", "true");
            item.id = idx;
            item.innerText = content;
            switch (status) {
                case "pending":
                    this.board.appendChild(item);
                    break;
                case "todo":
                    this.todo.appendChild(item);
                    break;
                case "inprogress":
                    this.inprogress.appendChild(item);
                    break;
                case "done":
                    this.done.appendChild(item);
                    break;
            }
        } else {
            return
        }
    },

    storeItem(content, idx, status = 'pending') {
        this.itemArr.push({
            content: content,
            status: status,
            idx: idx
        })
        localStorage.setItem('task', JSON.stringify(this.itemArr));
    },

    addItem(e) {
        if (e.keyCode === 13 || e.which === 13) {
            this.createItem(this.input.value, this.idx);
            this.storeItem(this.input.value, this.idx);
            this.input.value = '';
            this.idx++;
            this.idxArr.push(this.idx);
            localStorage.setItem('index', JSON.stringify(this.idxArr));
        }
    },

    dragItem() {
        let dragged = null;
        for (let list of this.lists) {

            list.addEventListener('dragstart', function (e) {
                if (e.target && e.target.classList.contains('item')) {
                    dragged = e.target;
                    setTimeout(() => {
                        dragged.style.display = 'none';
                    }, 0);
                }
            });

            list.addEventListener('dragend', function (e) {
                if (e.target && e.target.classList.contains('item')) {
                    dragged = e.target;
                    dragged.style.display = "block";
                    setTimeout(() => {
                        dragged = null;
                    }, 0);
                }
            });

            list.addEventListener('dragover', function (e) {
                e.preventDefault();
            });

            list.addEventListener('dragenter', function (e) {
                e.preventDefault();
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            });

            list.addEventListener('dragleave', function (e) {
                if (!this.classList.contains('tasks-board')) {
                    this.style.backgroundColor = '#faf8ff';
                }
            });

            list.addEventListener('drop', function () {
                this.appendChild(dragged);
                if (!this.classList.contains('tasks-board')) {
                    this.style.backgroundColor = '#faf8ff';
                }

                if (this.classList.contains('list-todo')) {
                    taskHandler.itemArr[dragged.id].status = "todo";
                    localStorage.setItem('task', JSON.stringify(taskHandler.itemArr));
                } else if (this.classList.contains('list-inprogress')) {
                    taskHandler.itemArr[dragged.id].status = "inprogress";
                    localStorage.setItem('task', JSON.stringify(taskHandler.itemArr));
                } else if (this.classList.contains('list-done')) {
                    taskHandler.itemArr[dragged.id].status = "done";
                    localStorage.setItem('task', JSON.stringify(taskHandler.itemArr));
                } else {
                    taskHandler.itemArr[dragged.id].status = "pending";
                    localStorage.setItem('task', JSON.stringify(taskHandler.itemArr));
                }
            });
        }
    },

    manageStorage() {
        let storage = localStorage.getItem('task');
        let sotredIdx = localStorage.getItem('index');
        if (storage) {
            this.itemArr = JSON.parse(storage);
            for (let task of this.itemArr) {
                taskHandler.createItem(task.content, task.idx, task.status);
            }
        }
        if (sotredIdx) {
            this.idxArr = JSON.parse(sotredIdx);
            this.idx = this.idxArr.length;
        }
    },

    clearStorage() {
        this.refresh.addEventListener('click', function () {
            this.itemArr = [];
            this.idx = 0;
            this.idxArr = [];
            localStorage.clear();
            window.location.reload();
        });
    }
};

document.addEventListener('keydown', e => {
    taskHandler.addItem(e);
});

taskHandler.dragItem();
taskHandler.clearStorage();
taskHandler.showTooltip();

window.addEventListener('load', function () {
    taskHandler.input.value = '';
    taskHandler.manageStorage();
});