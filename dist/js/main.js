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
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" data-function=\"highlight\">&#10025</button>\n                                <button type=\"button\" data-function=\"status\">&#10003;</button>\n                                <button type=\"button\" data-function=\"delete\">&#10007;</button>\n            </div>\n            </div>\n            <li>";
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
            if (tag.style.backgroundColor == 'white') {
                tag.style.backgroundColor = '#ffda63';
            }
            else {
                tag.style.backgroundColor = 'white';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBO0lBRUk7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDL0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBRyxXQUFXLEVBQUM7WUFDWCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEI7YUFDRztZQUNBLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQjtJQUNMLENBQUM7SUFDRywwQkFBSSxHQUFKLFVBQUssUUFBUTtRQUNULElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFDTCxrQkFBQztBQUFELENBcEJKLEFBb0JLLElBQUE7QUFwQlEsa0NBQVc7Ozs7O0FDQXhCO0lBRUksa0JBQWEsTUFBYTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7SUFDbEQsQ0FBQztJQUNELHlCQUFNLEdBQU4sVUFBUSxLQUFpQjtRQUF6QixpQkFrQkM7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Qy9DLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxJQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUcsSUFBSSxFQUFDO2dCQUM5QyxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ1g7WUFDRCxJQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBQztnQkFDOUIsT0FBTyxDQUFDLENBQUM7YUFDVjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FuREYsQUFtREcsSUFBQTtBQW5EVSxrQ0FBVyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydHtUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XG5leHBvcnQgY2xhc3MgRGF0YVN0b3JhZ2V7XG4gICAgc3RvcmFnZTtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIH1cbiAgICBzdG9yZSggYXJyYXk6QXJyYXkgPFRhc2s+LCBjYWxsYmFjayApe1xuICAgICAgICBsZXQgZGF0YSA9IEpTT04uc3RyaW5naWZ5KCBhcnJheSk7XG4gICAgICAgIGxldCBzdG9yZXN0YXR1cyA9IHRoaXMuc3RvcmFnZS5zZXRJdGVtKCd0YXNrZGF0YScsIGRhdGEpO1xuICAgICAgICBpZihzdG9yZXN0YXR1cyl7XG4gICAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgICAgICByZWFkKGNhbGxiYWNrKXtcbiAgICAgICAgICAgIGxldCBkYXRhID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0oJ3Rhc2tkYXRhJyk7XG4gICAgICAgICAgICBsZXQgYXJyYXkgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgY2FsbGJhY2soYXJyYXkpO1xuICAgICAgICB9XG4gICAgfVxuIiwiaW1wb3J0IHtUYXNrfSBmcm9tICcuLi90cy90YXNrJztcbmV4cG9ydCBjbGFzcyBMaXN0Vmlld3tcbiAgICBsaXN0OkhUTUxFbGVtZW50O1xuICAgIGNvbnN0cnVjdG9yKCBsaXN0aWQ6c3RyaW5nICl7XG4gICAgICAgIHRoaXMubGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBsaXN0aWQgKTtcbiAgICB9XG4gICAgcmVuZGVyKCBpdGVtczpBcnJheTxUYXNrPiApe1xuICAgICAgICBpdGVtcy5mb3JFYWNoKCh0YXNrKSA9PiB7XG4gICAgICAgICAgICBsZXQgaWQgPSB0YXNrLmlkO1xuICAgICAgICAgICAgbGV0IG5hbWUgPSB0YXNrLm5hbWU7XG4gICAgICAgICAgICBsZXQgc3RhdHVzID0gdGFzay5zdGF0dXM7XG4gICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSBgPGxpIGlkPVwiJHtpZH1cIiBkYXRhLXN0YXR1cz1cIiR7c3RhdHVzfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1uYW1lXCI+JHtuYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cImhpZ2hsaWdodFwiPiYjMTAwMjU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbj1cInN0YXR1c1wiPiYjMTAwMDM7PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJkZWxldGVcIj4mIzEwMDA3OzwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxsaT5gO1xuICAgICAgICAgICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoIHRlbXBsYXRlICk7XG4gICAgICAgICAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2xlYXIoKXtcbiAgICAgICAgdGhpcy5saXN0LmlubmVySFRNTCA9Jyc7XG4gICAgfVxufVxuIiwiaW1wb3J0e1Rhc2t9IGZyb20nLi4vdHMvdGFzayc7XG5pbXBvcnR7VGFza01hbmFnZXJ9IGZyb20nLi4vdHMvdGFza21hbmFnZXInO1xuaW1wb3J0e0xpc3RWaWV3fSBmcm9tJy4uL3RzL2xpc3R2aWV3JztcbmltcG9ydHtEYXRhU3RvcmFnZX0gZnJvbScuLi90cy9kYXRhc3RvcmFnZSc7XG5cbi8vaW5pdGlhbGlzZVxudmFyIHRhc2thcnJheTpBcnJheTxUYXNrPiA9IFtdO1xudmFyIHRhc2tzdG9yYWdlID0gbmV3IERhdGFTdG9yYWdlKCk7XG52YXIgdGFza21hbmFnZXIgPSBuZXcgVGFza01hbmFnZXIodGFza2FycmF5KTtcbnZhciBsaXN0dmlldyA9IG5ldyBMaXN0VmlldygndGFzay1saXN0Jyk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgbGV0IHRhc2tkYXRhID0gdGFza3N0b3JhZ2UucmVhZCgoZGF0YSkgPT4ge1xuICAgIGlmKGRhdGEubGVuZ3RoID4gMCl7XG4gICAgICAgIGRhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICB0YXNrYXJyYXkucHVzaChpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxpc3R2aWV3LmNsZWFyKCk7XG4gICAgICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xuICAgIH1cbiAgIH0pO1xuICAgIC8vdGFza2RhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge3Rhc2thcnJheS5wdXNoKGl0ZW0pO30pO1xuICAgIC8vbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XG59KTtcblxuXG4vL3JlZmVyZW5jZSB0byBmb3JtXG5jb25zdCB0YXNrZm9ybTpIVE1MRm9ybUVsZW1lbnQgPSAoPEhUTUxGb3JtRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2stZm9ybScpKTtcbnRhc2tmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsKCBldmVudDogRXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgbGV0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rhc2staW5wdXQnKTtcbiAgbGV0IHRhc2tuYW1lOnN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XG4gLy8gY29uc29sZS5sb2codGFza25hbWUpO1xuIGlmKHRhc2tuYW1lLmxlbmd0aD4gMCl7XG4gbGV0IHRhc2sgPSBuZXcgVGFzayggdGFza25hbWUgKTtcbiB0YXNrbWFuYWdlci5hZGQoIHRhc2sgKTtcbiBsaXN0dmlldy5jbGVhcigpO1xuIHRhc2tzdG9yYWdlLnN0b3JlKHRhc2thcnJheSwgKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZihyZXN1bHQpe1xuICAgICAgICB0YXNrZm9ybS5yZXNldCgpO1xuICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgLy9lcnJvciB0byBkbyB3aXRoIHN0b3JhZ2VcbiAgICAgICAgfVxuICAgIH0gKTtcbiAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGdldFBhcmVudElkKGVsbTpOb2RlKXtcbiAgICB3aGlsZShlbG0ucGFyZW50Tm9kZSl7XG4gICAgICAgIGVsbSA9IGVsbS5wYXJlbnROb2RlO1xuICAgICAgICBsZXQgaWQ6c3RyaW5nID0gKDxIVE1MRWxlbWVudD4gZWxtKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgIGlmKGlkKXtcbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuY29uc3QgbGlzdGVsZW1lbnQ6SFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1saXN0Jyk7XG5saXN0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGV2ZW50OkV2ZW50KSA9PiB7XG4gICAgbGV0IHRhcmdldDpIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD4gZXZlbnQudGFyZ2V0O1xuICAgIGxldCBpZCA9IGdldFBhcmVudElkKCA8Tm9kZT4gZXZlbnQudGFyZ2V0KTtcbiAgICAgIGNvbnNvbGUubG9nKGlkKTtcblxuICBpZih0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJyk9PSAnaGlnaGxpZ2h0Jyl7XG4gICAgICBpZihpZCl7XG4gICAgICAgIGxldCB0YWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGlmKCAoPEhUTUxJbnB1dEVsZW1lbnQ+dGFnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPT0gJ3doaXRlJyl7XG4gICAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRhZykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmZmRhNjMnO31cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGFnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgICB9XG5cbiAgICAgIH1cbiAgfVxuXG4gICAgaWYodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpPT0gJ3N0YXR1cycpe1xuICAgICAgICBpZihpZCl7XG4gICAgICAgICAgICB0YXNrbWFuYWdlci5jaGFuZ2VTdGF0dXMoaWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksKCk9PntcbiAgICAgICAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICAgICAgICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpPT0gJ2RlbGV0ZScpe1xuICAgICAgICBpZihpZCl7XG4gICAgICAgICAgICB0YXNrbWFuYWdlci5kZWxldGUoaWQsKCkgPT4ge1xuICAgICAgICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSh0YXNrYXJyYXksKCk9PntcbiAgICAgICAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgICAgICAgICAgICAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiZXhwb3J0IGNsYXNzIFRhc2t7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgc3RhdHVzOiBib29sZWFuO1xuICBjb25zdHJ1Y3Rvcih0YXNrbmFtZTogc3RyaW5nKXtcbiAgICB0aGlzLmlkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkudG9TdHJpbmcoKTsgLy9jcmVhdGUgbmV3IGRhdGUgb2JqZWN0XG4gICAgdGhpcy5uYW1lID0gdGFza25hbWU7XG4gICAgdGhpcy5zdGF0dXMgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0e1Rhc2t9IGZyb20gJy4uL3RzL3Rhc2snO1xuXG5leHBvcnQgY2xhc3MgVGFza01hbmFnZXJ7XG50YXNrcyA6IEFycmF5PFRhc2s+O1xuY29uc3RydWN0b3IoIGFycmF5OiBBcnJheTxUYXNrPil7XG50aGlzLnRhc2tzID0gYXJyYXk7XG59XG5hZGQoIHRhc2s6IFRhc2sgKXtcbnRoaXMudGFza3MucHVzaCh0YXNrKTtcbnRoaXMuc29ydCh0aGlzLnRhc2tzKTtcbn1cbmRlbGV0ZSggaWQ6c3RyaW5nLCBjYWxsYmFjayl7XG4gICAgbGV0IGluZGV4X3RvX3JlbW92ZTpudW1iZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50YXNrcy5mb3JFYWNoKChpdGVtOlRhc2ssIGluZGV4Om51bWJlcik9PntcbiAgICAgICBpZihpdGVtLmlkID09IGlkKXtcbiAgICAgICAgICAgaW5kZXhfdG9fcmVtb3ZlID0gaW5kZXg7XG4gICAgICAgfVxuICAgIH0pO1xuICAgIC8vZGVsZXRlIHRoZSBpdGVtIHdpdGggc3BlY2lmaWVsZCBpbmRleFxuICAgIGlmKGluZGV4X3RvX3JlbW92ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhpcy50YXNrcy5zcGxpY2UoaW5kZXhfdG9fcmVtb3ZlLCAxKTtcbiAgICB9XG4gICAgY2FsbGJhY2soKTtcbn1cbiAgICBjaGFuZ2VTdGF0dXMoIGlkOlN0cmluZywgY2FsbGJhY2sgKTp2b2lke1xuICAgIHRoaXMudGFza3MuZm9yRWFjaCgodGFzazpUYXNrKSA9PiB7XG4gICAgICAgIGlmKHRhc2suaWQgPT09IGlkKXtcbiAgICAgICAgICAgIGlmKHRhc2suc3RhdHVzID09IGZhbHNlICl7XG4gICAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuc29ydCh0aGlzLnRhc2tzKTtcbiAgICBjYWxsYmFjaygpO1xuICAgIH1cblxuICAgIHNvcnQodGFza3M6QXJyYXk8VGFzaz4pe1xuICAgICAgdGFza3Muc29ydCgodGFzazEsIHRhc2syKSA9PiB7XG4gICAgICAgIGlmKHRhc2sxLnN0YXR1cyA9PSB0cnVlICYmIHRhc2syLnN0YXR1cyA9PSBmYWxzZSl7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGFzazEuc3RhdHVzID09IGZhbHNlICYmIHRhc2syLnN0YXR1cyA9PXRydWUpe1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZih0YXNrMS5zdGF0dXMgPT0gdGFzazIuc3RhdHVzKXtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4iXX0=
