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
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" data-function=\"highlight\">highlight</button>\n                                <button type=\"button\" data-function=\"status\">&#10003;</button>\n                                <button type=\"button\" data-function=\"delete\">&#10007;</button>\n            </div>\n            </div>\n            <li>";
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
    if (target.getAttribute('data-function') == 'highlight') {
        if (id) {
            var tag = document.getElementById(id);
            if (tag.style.backgroundColor == 'lightgreen') {
                tag.style.backgroundColor = 'white';
            }
            else {
                tag.style.backgroundColor = 'lightgreen';
            }
        }
    }
    if (target.getAttribute('data-function') == 'status') {
        if (id) {
            taskmanager.changeStatus(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBO0lBRUk7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDL0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBRyxXQUFXLEVBQUM7WUFDWCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEI7YUFDRztZQUNBLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQjtJQUNMLENBQUM7SUFDRywwQkFBSSxHQUFKLFVBQUssUUFBUTtRQUNULElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFDTCxrQkFBQztBQUFELENBcEJKLEFBb0JLLElBQUE7QUFwQlEsa0NBQVc7Ozs7O0FDQXhCO0lBRUksa0JBQWEsTUFBYTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7SUFDbEQsQ0FBQztJQUNELHlCQUFNLEdBQU4sVUFBUSxLQUFpQjtRQUF6QixpQkFrQkM7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Qy9DLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxJQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUcsSUFBSSxFQUFDO2dCQUM5QyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ1g7WUFDRCxJQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBQztnQkFDOUIsT0FBTyxDQUFDLENBQUM7YUFDVjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FuREYsQUFtREcsSUFBQTtBQW5EVSxrQ0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydHtUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XG5leHBvcnQgY2xhc3MgRGF0YVN0b3JhZ2V7XG4gICAgc3RvcmFnZTtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIH1cbiAgICBzdG9yZSggYXJyYXk6QXJyYXkgPFRhc2s+LCBjYWxsYmFjayApe1xuICAgICAgICBsZXQgZGF0YSA9IEpTT04uc3RyaW5naWZ5KCBhcnJheSk7XG4gICAgICAgIGxldCBzdG9yZXN0YXR1cyA9IHRoaXMuc3RvcmFnZS5zZXRJdGVtKCd0YXNrZGF0YScsIGRhdGEpO1xuICAgICAgICBpZihzdG9yZXN0YXR1cyl7XG4gICAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgICAgICByZWFkKGNhbGxiYWNrKXtcbiAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oJ3Rhc2tkYXRhJyk7XG4gICAgICAgICAgICBsZXQgYXJyYXkgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgY2FsbGJhY2soYXJyYXkpO1xuICAgICAgICB9XG4gICAgfVxuIiwiaW1wb3J0IHtUYXNrfSBmcm9tICcuLi90cy90YXNrJztcbmV4cG9ydCBjbGFzcyBMaXN0Vmlld3tcbiAgICBsaXN0OkhUTUxFbGVtZW50O1xuICAgIGNvbnN0cnVjdG9yKCBsaXN0aWQ6c3RyaW5nICl7XG4gICAgICAgIHRoaXMubGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBsaXN0aWQgKTtcbiAgICB9XG4gICAgcmVuZGVyKCBpdGVtczpBcnJheTxUYXNrPiApe1xuICAgICAgICBpdGVtcy5mb3JFYWNoKCh0YXNrKSA9PiB7XG4gICAgICAgICAgICBsZXQgaWQgPSB0YXNrLmlkO1xuICAgICAgICAgICAgbGV0IG5hbWUgPSB0YXNrLm5hbWU7XG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gdGFzay5zdGF0dXM7XG4gICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBgPGxpIGlkPVwiJHtpZH1cIiBkYXRhLXN0YXR1cz1cIiR7c3RhdHVzfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1uYW1lXCI+JHtuYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImhpZ2hsaWdodFwiPmhpZ2hsaWdodDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uPVwic3RhdHVzXCI+JiMxMDAwMzs8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImRlbGV0ZVwiPiYjMTAwMDc7PC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGxpPmA7XG4gICAgICAgICAgICBsZXQgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCggdGVtcGxhdGUgKTtcbiAgICAgICAgICAgIHRoaXMubGlzdC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjbGVhcigpe1xuICAgICAgICB0aGlzLmxpc3QuaW5uZXJIVE1MID0nJztcbiAgICB9XG59XG4iLCJpbXBvcnR7VGFza30gZnJvbScuLi90cy90YXNrJztcbmltcG9ydHtUYXNrTWFuYWdlcn0gZnJvbScuLi90cy90YXNrbWFuYWdlcic7XG5pbXBvcnR7TGlzdFZpZXd9IGZyb20nLi4vdHMvbGlzdHZpZXcnO1xuaW1wb3J0e0RhdGFTdG9yYWdlfSBmcm9tJy4uL3RzL2RhdGFzdG9yYWdlJztcblxuLy9pbml0aWFsaXNlXG52YXIgdGFza2FycmF5OkFycmF5PFRhc2s+ID0gW107XG52YXIgdGFza3N0b3JhZ2UgPSBuZXcgRGF0YVN0b3JhZ2UoKTtcbnZhciB0YXNrbWFuYWdlciA9IG5ldyBUYXNrTWFuYWdlcih0YXNrYXJyYXkpO1xudmFyIGxpc3R2aWV3ID0gbmV3IExpc3RWaWV3KCd0YXNrLWxpc3QnKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICBsZXQgdGFza2RhdGEgPSB0YXNrc3RvcmFnZS5yZWFkKChkYXRhKSA9PiB7XG4gICAgaWYoZGF0YS5sZW5ndGggPiAwKXtcbiAgICAgICAgZGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgIHRhc2thcnJheS5wdXNoKGl0ZW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XG4gICAgfVxuICAgfSk7XG4gICAgLy90YXNrZGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7dGFza2FycmF5LnB1c2goaXRlbSk7fSk7XG4gICAgLy9saXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbn0pO1xuXG5cbi8vcmVmZXJlbmNlIHRvIGZvcm1cbmNvbnN0IHRhc2tmb3JtOkhUTUxGb3JtRWxlbWVudCA9ICg8SFRNTEZvcm1FbGVtZW50PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1mb3JtJykpO1xudGFza2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywoIGV2ZW50OiBFdmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBsZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1pbnB1dCcpO1xuICBsZXQgdGFza25hbWU6c3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS52YWx1ZTtcbiAvLyBjb25zb2xlLmxvZyh0YXNrbmFtZSk7XG4gaWYodGFza25hbWUubGVuZ3RoPiAwKXtcbiBsZXQgdGFzayA9IG5ldyBUYXNrKCB0YXNrbmFtZSApO1xuIHRhc2ttYW5hZ2VyLmFkZCggdGFzayApO1xuIGxpc3R2aWV3LmNsZWFyKCk7XG4gdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCAocmVzdWx0KSA9PiB7XG4gICAgICAgIGlmKHJlc3VsdCl7XG4gICAgICAgIHRhc2tmb3JtLnJlc2V0KCk7XG4gICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICAvL2Vycm9yIHRvIGRvIHdpdGggc3RvcmFnZVxuICAgICAgICB9XG4gICAgfSApO1xuICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xuICB9XG59KTtcblxuZnVuY3Rpb24gZ2V0UGFyZW50SWQoZWxtOk5vZGUpe1xuICAgIHdoaWxlKGVsbS5wYXJlbnROb2RlKXtcbiAgICAgICAgZWxtID0gZWxtLnBhcmVudE5vZGU7XG4gICAgICAgIGxldCBpZDpzdHJpbmcgPSAoPEhUTUxFbGVtZW50PiBlbG0pLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgaWYoaWQpe1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5jb25zdCBsaXN0ZWxlbWVudDpIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWxpc3QnKTtcbmxpc3RlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZXZlbnQ6RXZlbnQpID0+IHtcbiAgICBsZXQgdGFyZ2V0OkhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBldmVudC50YXJnZXQ7XG4gICAgbGV0IGlkID0gZ2V0UGFyZW50SWQoIDxOb2RlPiBldmVudC50YXJnZXQpO1xuICAgICAgY29uc29sZS5sb2coaWQpO1xuXG4gIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKT09ICdoaWdobGlnaHQnKXtcbiAgICAgIGlmKGlkKXtcbiAgICAgICAgbGV0IHRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgaWYoICg8SFRNTElucHV0RWxlbWVudD50YWcpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9PSAnbGlnaHRncmVlbicpe1xuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50YWcpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7fVxuICAgICAgICBlbHNle1xuICAgICAgICAgICg8SFRNTElucHV0RWxlbWVudD50YWcpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdsaWdodGdyZWVuJztcbiAgICAgICAgfVxuXG4gICAgICB9XG4gIH1cblxuICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKT09ICdzdGF0dXMnKXtcbiAgICAgICAgaWYoaWQpe1xuICAgICAgICAgICAgdGFza21hbmFnZXIuY2hhbmdlU3RhdHVzKGlkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCgpPT57XG4gICAgICAgICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZnVuY3Rpb24nKT09ICdkZWxldGUnKXtcbiAgICAgICAgaWYoaWQpe1xuICAgICAgICAgICAgdGFza21hbmFnZXIuZGVsZXRlKGlkLCgpID0+IHtcbiAgICAgICAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCgpPT57XG4gICAgICAgICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsImV4cG9ydCBjbGFzcyBUYXNre1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIHN0YXR1czogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IodGFza25hbWU6IHN0cmluZyl7XG4gICAgdGhpcy5pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLnRvU3RyaW5nKCk7IC8vY3JlYXRlIG5ldyBkYXRlIG9iamVjdFxuICAgIHRoaXMubmFtZSA9IHRhc2tuYW1lO1xuICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydHtUYXNrfSBmcm9tICcuLi90cy90YXNrJztcblxuZXhwb3J0IGNsYXNzIFRhc2tNYW5hZ2Vye1xudGFza3MgOiBBcnJheTxUYXNrPjtcbmNvbnN0cnVjdG9yKCBhcnJheTogQXJyYXk8VGFzaz4pe1xudGhpcy50YXNrcyA9IGFycmF5O1xufVxuYWRkKCB0YXNrOiBUYXNrICl7XG50aGlzLnRhc2tzLnB1c2godGFzayk7XG50aGlzLnNvcnQodGhpcy50YXNrcyk7XG59XG5kZWxldGUoIGlkOnN0cmluZywgY2FsbGJhY2spe1xuICAgIGxldCBpbmRleF90b19yZW1vdmU6bnVtYmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGFza3MuZm9yRWFjaCgoaXRlbTpUYXNrLCBpbmRleDpudW1iZXIpPT57XG4gICAgICAgaWYoaXRlbS5pZCA9PSBpZCl7XG4gICAgICAgICAgIGluZGV4X3RvX3JlbW92ZSA9IGluZGV4O1xuICAgICAgIH1cbiAgICB9KTtcbiAgICAvL2RlbGV0ZSB0aGUgaXRlbSB3aXRoIHNwZWNpZmllbGQgaW5kZXhcbiAgICBpZihpbmRleF90b19yZW1vdmUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHRoaXMudGFza3Muc3BsaWNlKGluZGV4X3RvX3JlbW92ZSwgMSk7XG4gICAgfVxuICAgIGNhbGxiYWNrKCk7XG59XG4gICAgY2hhbmdlU3RhdHVzKCBpZDpTdHJpbmcsIGNhbGxiYWNrICk6dm9pZHtcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goKHRhc2s6VGFzaykgPT4ge1xuICAgICAgICBpZih0YXNrLmlkID09PSBpZCl7XG4gICAgICAgICAgICBpZih0YXNrLnN0YXR1cyA9PSBmYWxzZSApe1xuICAgICAgICAgICAgICAgIHRhc2suc3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHRhc2suc3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnNvcnQodGhpcy50YXNrcyk7XG4gICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICBzb3J0KHRhc2tzOkFycmF5PFRhc2s+KXtcbiAgICAgIHRhc2tzLnNvcnQoKHRhc2sxLCB0YXNrMikgPT4ge1xuICAgICAgICBpZih0YXNrMS5zdGF0dXMgPT0gdHJ1ZSAmJiB0YXNrMi5zdGF0dXMgPT0gZmFsc2Upe1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRhc2sxLnN0YXR1cyA9PSBmYWxzZSAmJiB0YXNrMi5zdGF0dXMgPT10cnVlKXtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGFzazEuc3RhdHVzID09IHRhc2syLnN0YXR1cyl7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuIl19
