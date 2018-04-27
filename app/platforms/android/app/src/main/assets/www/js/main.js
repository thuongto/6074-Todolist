(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var DataStorage = /** @class */ (function () {
    function DataStorage() {
        this.storage = window.localStorage;
    }
    DataStorage.prototype.store = function (array, callback) {
        var data = JSON.stringify(array);
        var storestatus = this.storage.setItem('taskdata', data);
        if (storestatus) {
            callback(true);
        }
        else {
            callback(false);
        }
    };
    DataStorage.prototype.read = function (callback) {
        var data = this.storage.getItem('taskdata');
        var array = JSON.parse(data);
        callback(array);
    };
    return DataStorage;
}());
exports.DataStorage = DataStorage;

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var ListView = /** @class */ (function () {
    function ListView(listid) {
        this.list = document.getElementById(listid);
    }
    ListView.prototype.render = function (items) {
        var _this = this;
        items.forEach(function (task) {
            var id = task.id;
            var name = task.name;
            var status = task.status;
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function=\"delete\">&times;</button>\n            </div>\n            </div>\n            <li>";
            var fragment = document.createRange().createContextualFragment(template);
            _this.list.appendChild(fragment);
        });
    };
    ListView.prototype.clear = function () {
        this.list.innerHTML = '';
    };
    return ListView;
}());
exports.ListView = ListView;

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var task_1 = require("../ts/task");
var taskmanager_1 = require("../ts/taskmanager");
var listview_1 = require("../ts/listview");
var datastorage_1 = require("../ts/datastorage");
//initialise
var taskarray = [];
var taskstorage = new datastorage_1.DataStorage();
var taskmanager = new taskmanager_1.TaskManager(taskarray);
var listview = new listview_1.ListView('task-list');
window.addEventListener('load', function () {
    var taskdata = taskstorage.read(function (data) {
        if (data.length > 0) {
            data.forEach(function (item) {
                taskarray.push(item);
            });
            listview.clear();
            listview.render(taskarray);
        }
    });
    //taskdata.forEach((item) => {taskarray.push(item);});
    //listview.render(taskarray);
});
//reference to form
var taskform = document.getElementById('task-form');
taskform.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = document.getElementById('task-input');
    var taskname = input.value;
    // console.log(taskname);
    if (taskname.length > 0) {
        var task = new task_1.Task(taskname);
        taskmanager.add(task);
        listview.clear();
        taskstorage.store(taskarray, function (result) {
            if (result) {
                taskform.reset();
                listview.clear();
                listview.render(taskarray);
            }
            else {
                //error to do with storage
            }
        });
        listview.render(taskarray);
    }
});
function getParentId(elm) {
    while (elm.parentNode) {
        elm = elm.parentNode;
        var id = elm.getAttribute('id');
        if (id) {
            return id;
        }
    }
    return null;
}
var listelement = document.getElementById('task-list');
listelement.addEventListener('click', function (event) {
    var target = event.target;
    var id = getParentId(event.target);
    console.log(id);
    if (target.getAttribute('data-function') == 'status') {
        if (id) {
            taskmanager.changeStatus(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
                //listview.clear();
                // listview.render(taskarray);
            });
        }
    }
    if (target.getAttribute('data-function') == 'delete') {
        if (id) {
            taskmanager["delete"](id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
            });
        }
    }
});

},{"../ts/datastorage":1,"../ts/listview":2,"../ts/task":4,"../ts/taskmanager":5}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Task = /** @class */ (function () {
    function Task(taskname) {
        this.id = new Date().getTime().toString(); //create new date object
        this.name = taskname;
        this.status = false;
    }
    return Task;
}());
exports.Task = Task;

},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var TaskManager = /** @class */ (function () {
    function TaskManager(array) {
        this.tasks = array;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        this.sort(this.tasks);
    };
    TaskManager.prototype["delete"] = function (id, callback) {
        var index_to_remove = undefined;
        this.tasks.forEach(function (item, index) {
            if (item.id == id) {
                index_to_remove = index;
            }
        });
        //delete the item with specifield index
        if (index_to_remove !== undefined) {
            this.tasks.splice(index_to_remove, 1);
        }
        callback();
    };
    TaskManager.prototype.changeStatus = function (id, callback) {
        this.tasks.forEach(function (task) {
            if (task.id === id) {
                if (task.status == false) {
                    task.status = true;
                    return;
                }
                else {
                    task.status = false;
                }
            }
        });
        this.sort(this.tasks);
        callback();
    };
    TaskManager.prototype.sort = function (tasks) {
        tasks.sort(function (task1, task2) {
            if (task1.status == true && task2.status == false) {
                return 1;
            }
            if (task1.status == false && task2.status == true) {
                return -1;
            }
            if (task1.status == task2.status) {
                return 0;
            }
        });
    };
    return TaskManager;
}());
exports.TaskManager = TaskManager;

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBO0lBRUk7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDL0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBRyxXQUFXLEVBQUM7WUFDWCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEI7YUFDRztZQUNBLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQjtJQUNMLENBQUM7SUFDRywwQkFBSSxHQUFKLFVBQUssUUFBUTtRQUNULElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFDTCxrQkFBQztBQUFELENBcEJKLEFBb0JLLElBQUE7QUFwQlEsa0NBQVc7Ozs7O0FDQXhCO0lBRUksa0JBQWEsTUFBYTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7SUFDbEQsQ0FBQztJQUNELHlCQUFNLEdBQU4sVUFBUSxLQUFpQjtRQUF6QixpQkFpQkM7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IiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0e1Rhc2sgfSBmcm9tICcuLi90cy90YXNrJztcbmV4cG9ydCBjbGFzcyBEYXRhU3RvcmFnZXtcbiAgICBzdG9yYWdlO1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gICAgfVxuICAgIHN0b3JlKCBhcnJheTpBcnJheSA8VGFzaz4sIGNhbGxiYWNrICl7XG4gICAgICAgIGxldCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoIGFycmF5KTtcbiAgICAgICAgbGV0IHN0b3Jlc3RhdHVzID0gdGhpcy5zdG9yYWdlLnNldEl0ZW0oJ3Rhc2tkYXRhJywgZGF0YSk7XG4gICAgICAgIGlmKHN0b3Jlc3RhdHVzKXtcbiAgICAgICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgICAgIHJlYWQoY2FsbGJhY2spe1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB0aGlzLnN0b3JhZ2UuZ2V0SXRlbSgndGFza2RhdGEnKTtcbiAgICAgICAgICAgIGxldCBhcnJheSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgICAgICBjYWxsYmFjayhhcnJheSk7XG4gICAgICAgIH1cbiAgICB9XG4iLCJpbXBvcnQge1Rhc2t9IGZyb20gJy4uL3RzL3Rhc2snO1xuZXhwb3J0IGNsYXNzIExpc3RWaWV3e1xuICAgIGxpc3Q6SFRNTEVsZW1lbnQ7XG4gICAgY29uc3RydWN0b3IoIGxpc3RpZDpzdHJpbmcgKXtcbiAgICAgICAgdGhpcy5saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxpc3RpZCApO1xuICAgIH1cbiAgICByZW5kZXIoIGl0ZW1zOkFycmF5PFRhc2s+ICl7XG4gICAgICAgIGl0ZW1zLmZvckVhY2goKHRhc2spID0+IHtcbiAgICAgICAgICAgIGxldCBpZCA9IHRhc2suaWQ7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IHRhc2submFtZTtcbiAgICAgICAgICAgIGxldCBzdGF0dXMgPSB0YXNrLnN0YXR1cztcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGA8bGkgaWQ9XCIke2lkfVwiIGRhdGEtc3RhdHVzPVwiJHtzdGF0dXN9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLW5hbWVcIj4ke25hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uPVwic3RhdHVzXCI+JiN4MjcxNDs8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImRlbGV0ZVwiPiZ0aW1lczs8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8bGk+YDtcbiAgICAgICAgICAgIGxldCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCB0ZW1wbGF0ZSApO1xuICAgICAgICAgICAgdGhpcy5saXN0LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNsZWFyKCl7XG4gICAgICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPScnO1xuICAgIH1cbn1cbiIsImltcG9ydHtUYXNrfSBmcm9tJy4uL3RzL3Rhc2snO1xuaW1wb3J0e1Rhc2tNYW5hZ2VyfSBmcm9tJy4uL3RzL3Rhc2ttYW5hZ2VyJztcbmltcG9ydHtMaXN0Vmlld30gZnJvbScuLi90cy9saXN0dmlldyc7XG5pbXBvcnR7RGF0YVN0b3JhZ2V9IGZyb20nLi4vdHMvZGF0YXN0b3JhZ2UnO1xuXG4vL2luaXRpYWxpc2VcbnZhciB0YXNrYXJyYXk6QXJyYXk8VGFzaz4gPSBbXTtcbnZhciB0YXNrc3RvcmFnZSA9IG5ldyBEYXRhU3RvcmFnZSgpO1xudmFyIHRhc2ttYW5hZ2VyID0gbmV3IFRhc2tNYW5hZ2VyKHRhc2thcnJheSk7XG52YXIgbGlzdHZpZXcgPSBuZXcgTGlzdFZpZXcoJ3Rhc2stbGlzdCcpO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgIGxldCB0YXNrZGF0YSA9IHRhc2tzdG9yYWdlLnJlYWQoKGRhdGEpID0+IHtcbiAgICBpZihkYXRhLmxlbmd0aCA+IDApe1xuICAgICAgICBkYXRhLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgdGFza2FycmF5LnB1c2goaXRlbSk7XG4gICAgICAgIH0pO1xuICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgICB9XG4gICB9KTtcbiAgICAvL3Rhc2tkYXRhLmZvckVhY2goKGl0ZW0pID0+IHt0YXNrYXJyYXkucHVzaChpdGVtKTt9KTtcbiAgICAvL2xpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xufSk7XG5cblxuLy9yZWZlcmVuY2UgdG8gZm9ybVxuY29uc3QgdGFza2Zvcm06SFRNTEZvcm1FbGVtZW50ID0gKDxIVE1MRm9ybUVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWZvcm0nKSk7XG50YXNrZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCggZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5sZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xuICBsZXQgdGFza25hbWU6c3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS52YWx1ZTtcbiAvLyBjb25zb2xlLmxvZyh0YXNrbmFtZSk7XG4gaWYodGFza25hbWUubGVuZ3RoPiAwKXtcbiBsZXQgdGFzayA9IG5ldyBUYXNrKCB0YXNrbmFtZSApO1xuIHRhc2ttYW5hZ2VyLmFkZCggdGFzayApO1xuIGxpc3R2aWV3LmNsZWFyKCk7XG4gdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCAocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7XG4gICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICAvL2Vycm9yIHRvIGRvIHdpdGggc3RvcmFnZVxuICAgICAgICB9XG4gICAgfSApO1xuICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xuICB9XG59KTtcblxuZnVuY3Rpb24gZ2V0UGFyZW50SWQoZWxtOk5vZGUpe1xuICAgIHdoaWxlKGVsbS5wYXJlbnROb2RlKXtcbiAgICAgICAgZWxtID0gZWxtLnBhcmVudE5vZGU7XG4gICAgICAgIGxldCBpZDpzdHJpbmcgPSAoPEhUTUxFbGVtZW50PiBlbG0pLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgaWYoaWQpe1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5jb25zdCBsaXN0ZWxlbWVudDpIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWxpc3QnKTtcbmxpc3RlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZXZlbnQ6RXZlbnQpID0+IHtcbiAgICBsZXQgdGFyZ2V0OkhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBldmVudC50YXJnZXQ7XG4gICAgbGV0IGlkID0gZ2V0UGFyZW50SWQoIDxOb2RlPiBldmVudC50YXJnZXQpO1xuICAgICAgY29uc29sZS5sb2coaWQpO1xuICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKT09ICdzdGF0dXMnKXtcbiAgICAgICAgaWYoaWQpe1xuICAgICAgICAgICAgdGFza21hbmFnZXIuY2hhbmdlU3RhdHVzKGlkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCgpPT57XG4gICAgICAgICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvL2xpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgICAgICAgICAvLyBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKT09ICdkZWxldGUnKXtcbiAgICAgICAgaWYoaWQpe1xuICAgICAgICAgICAgdGFza21hbmFnZXIuZGVsZXRlKGlkLCgpID0+IHtcbiAgICAgICAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCgpPT57XG4gICAgICAgICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsImV4cG9ydCBjbGFzcyBUYXNre1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIHN0YXR1czogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IodGFza25hbWU6IHN0cmluZyl7XG4gICAgdGhpcy5pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7IC8vY3JlYXRlIG5ldyBkYXRlIG9iamVjdFxuICAgIHRoaXMubmFtZSA9IHRhc2tuYW1lO1xuICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydHtUYXNrfSBmcm9tICcuLi90cy90YXNrJztcblxuZXhwb3J0IGNsYXNzIFRhc2tNYW5hZ2Vye1xudGFza3MgOiBBcnJheTxUYXNrPjtcbmNvbnN0cnVjdG9yKCBhcnJheTogQXJyYXk8VGFzaz4pe1xudGhpcy50YXNrcyA9IGFycmF5O1xufVxuYWRkKCB0YXNrOiBUYXNrICl7XG50aGlzLnRhc2tzLnB1c2godGFzayk7XG50aGlzLnNvcnQodGhpcy50YXNrcyk7XG59XG5kZWxldGUoIGlkOnN0cmluZywgY2FsbGJhY2spe1xuICAgIGxldCBpbmRleF90b19yZW1vdmU6bnVtYmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGFza3MuZm9yRWFjaCgoaXRlbTpUYXNrLCBpbmRleDpudW1iZXIpPT57XG4gICAgICAgaWYoaXRlbS5pZCA9PSBpZCl7XG4gICAgICAgICAgIGluZGV4X3RvX3JlbW92ZSA9IGluZGV4O1xuICAgICAgIH1cbiAgICB9KTtcbiAgICAvL2RlbGV0ZSB0aGUgaXRlbSB3aXRoIHNwZWNpZmllbGQgaW5kZXhcbiAgICBpZihpbmRleF90b19yZW1vdmUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHRoaXMudGFza3Muc3BsaWNlKGluZGV4X3RvX3JlbW92ZSwgMSk7XG4gICAgfVxuICAgIGNhbGxiYWNrKCk7XG59XG4gICAgY2hhbmdlU3RhdHVzKCBpZDpTdHJpbmcsIGNhbGxiYWNrICk6dm9pZHtcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goKHRhc2s6VGFzaykgPT4ge1xuICAgICAgICBpZih0YXNrLmlkID09PSBpZCl7XG4gICAgICAgICAgICBpZih0YXNrLnN0YXR1cyA9PSBmYWxzZSApe1xuICAgICAgICAgICAgICAgIHRhc2suc3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHRhc2suc3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnNvcnQodGhpcy50YXNrcyk7XG4gICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICBzb3J0KHRhc2tzOkFycmF5PFRhc2s+KXtcbiAgICAgIHRhc2tzLnNvcnQoKHRhc2sxLCB0YXNrMikgPT4ge1xuICAgICAgICBpZih0YXNrMS5zdGF0dXMgPT0gdHJ1ZSAmJiB0YXNrMi5zdGF0dXMgPT0gZmFsc2Upe1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRhc2sxLnN0YXR1cyA9PSBmYWxzZSAmJiB0YXNrMi5zdGF0dXMgPT10cnVlKXtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGFzazEuc3RhdHVzID09IHRhc2syLnN0YXR1cyl7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuIl19
