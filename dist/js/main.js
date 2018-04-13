(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Task = /** @class */ (function () {
    function Task(taskname) {
        this.id = new Date().getTime();
        this.name = taskname;
        this.status = false;
    }
    return Task;
}());
var TaskManager = /** @class */ (function () {
    function TaskManager(array) {
        this.tasks = array;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        console.log(this.tasks);
    };
    return TaskManager;
}());
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
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function-\"delete\">&times;</button>\n            </div>\n            </div>\n            <li>";
            var fragment = document.createRange().createContextualFragment(template);
            _this.list.appendChild(fragment);
        });
    };
    ListView.prototype.clear = function () {
        this.list.innerHTML = '';
    };
    return ListView;
}());
var DataStorage = /** @class */ (function () {
    function DataStorage() {
        this.storage = window.localStorage;
    }
    DataStorage.prototype.store = function (array) {
        var data = JSON.stringify(array);
        this.storage.setItem('taskdata', data);
    };
    DataStorage.prototype.read = function () {
        var data = this.storage.getItem('taskdata');
        var array = JSON.parse(data);
        return array;
    };
    return DataStorage;
}());
//initialise
var taskarray = [];
var taskstorage = new DataStorage();
var taskmanager = new TaskManager(taskarray);
var listview = new ListView('task-list');
window.addEventListener('load', function () {
    var taskdata = taskstorage.read();
    taskdata.forEach(function (item) { taskarray.push(item); });
    listview.render(taskarray);
});
//reference to form
var taskform = document.getElementById('task-form');
taskform.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = document.getElementById('task-input');
    var taskname = input.value;
    taskform.reset();
    // console.log(taskname);
    var task = new Task(taskname);
    taskmanager.add(task);
    listview.clear();
    taskstorage.store(taskarray);
    listview.render(taskarray);
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9tYWluLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0lBSUUsY0FBWSxRQUFnQjtRQUMxQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUNILFdBQUM7QUFBRCxDQVRBLEFBU0MsSUFBQTtBQUVEO0lBRUEscUJBQWEsS0FBa0I7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDbkIsQ0FBQztJQUNELHlCQUFHLEdBQUgsVUFBSyxJQUFVO1FBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFFLENBQUM7SUFDMUIsQ0FBQztJQUNELGtCQUFDO0FBQUQsQ0FUQSxBQVNDLElBQUE7QUFFRDtJQUVJLGtCQUFhLE1BQWE7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2xELENBQUM7SUFDRCx5QkFBTSxHQUFOLFVBQVEsS0FBaUI7UUFBekIsaUJBaUJDO1FBaEJHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxRQUFRLEdBQUcsY0FBVyxFQUFFLHlCQUFrQixNQUFNLGtJQUVQLElBQUksc1VBTTVDLENBQUM7WUFDTixJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUUsUUFBUSxDQUFFLENBQUM7WUFDM0UsS0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0Qsd0JBQUssR0FBTDtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFFLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBQ0wsZUFBQztBQUFELENBMUJBLEFBMEJDLElBQUE7QUFFRDtJQUVJO1FBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3ZDLENBQUM7SUFDRCwyQkFBSyxHQUFMLFVBQU8sS0FBa0I7UUFDckIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNHLDBCQUFJLEdBQUo7UUFDSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTCxrQkFBQztBQUFELENBZEosQUFjSyxJQUFBO0FBRUwsWUFBWTtBQUNaLElBQUksU0FBUyxHQUFjLEVBQUUsQ0FBQztBQUM5QixJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBQ3BDLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXpDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7SUFDN0IsSUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRWpDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLElBQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO0lBQ3BELFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDLENBQUM7QUFHSCxtQkFBbUI7QUFDbkIsSUFBTSxRQUFRLEdBQXNCLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFFLENBQUM7QUFDMUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBQyxVQUFFLEtBQVk7SUFDL0MsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3pCLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbEQsSUFBSSxRQUFRLEdBQXNCLEtBQU0sQ0FBQyxLQUFLLENBQUM7SUFDN0MsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3BCLHlCQUF5QjtJQUN0QixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBRSxRQUFRLENBQUUsQ0FBQztJQUNoQyxXQUFXLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBRSxDQUFDO0lBQ3hCLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQixXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdCLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjbGFzcyBUYXNre1xuICBpZDogbnVtYmVyO1xuICBuYW1lOiBzdHJpbmc7XG4gIHN0YXR1czogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IodGFza25hbWU6IHN0cmluZyl7XG4gICAgdGhpcy5pZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMubmFtZSA9IHRhc2tuYW1lO1xuICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG4gIH1cbn1cblxuY2xhc3MgVGFza01hbmFnZXJ7XG50YXNrcyA6IEFycmF5PFRhc2s+O1xuY29uc3RydWN0b3IoIGFycmF5OiBBcnJheTxUYXNrPil7XG50aGlzLnRhc2tzID0gYXJyYXk7XG59XG5hZGQoIHRhc2s6IFRhc2sgKXtcbnRoaXMudGFza3MucHVzaCh0YXNrKTtcbmNvbnNvbGUubG9nKCB0aGlzLnRhc2tzICk7XG59XG59XG5cbmNsYXNzIExpc3RWaWV3e1xuICAgIGxpc3Q6SFRNTEVsZW1lbnQ7XG4gICAgY29uc3RydWN0b3IoIGxpc3RpZDpzdHJpbmcgKXtcbiAgICAgICAgdGhpcy5saXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGxpc3RpZCApO1xuICAgIH1cbiAgICByZW5kZXIoIGl0ZW1zOkFycmF5PFRhc2s+ICl7XG4gICAgICAgIGl0ZW1zLmZvckVhY2goKHRhc2spID0+IHtcbiAgICAgICAgICAgIGxldCBpZCA9IHRhc2suaWQ7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IHRhc2submFtZTtcbiAgICAgICAgICAgIGxldCBzdGF0dXMgPSB0YXNrLnN0YXR1cztcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGA8bGkgaWQ9XCIke2lkfVwiIGRhdGEtc3RhdHVzPVwiJHtzdGF0dXN9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YXNrLW5hbWVcIj4ke25hbWV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWZ1bmN0aW9uPVwic3RhdHVzXCI+JiN4MjcxNDs8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1mdW5jdGlvbi1cImRlbGV0ZVwiPiZ0aW1lczs8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8bGk+YDtcbiAgICAgICAgICAgIGxldCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCB0ZW1wbGF0ZSApO1xuICAgICAgICAgICAgdGhpcy5saXN0LmFwcGVuZENoaWxkKGZyYWdtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNsZWFyKCl7XG4gICAgICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPScnO1xuICAgIH1cbn1cblxuY2xhc3MgRGF0YVN0b3JhZ2V7XG4gICAgc3RvcmFnZTtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIH1cbiAgICBzdG9yZSggYXJyYXk6QXJyYXkgPFRhc2s+ICl7XG4gICAgICAgIGxldCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoIGFycmF5KTtcbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldEl0ZW0oJ3Rhc2tkYXRhJywgZGF0YSk7XG4gICAgfVxuICAgICAgICByZWFkKCl7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKCd0YXNrZGF0YScpO1xuICAgICAgICAgICAgbGV0IGFycmF5ID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgICAgfVxuICAgIH1cblxuLy9pbml0aWFsaXNlXG52YXIgdGFza2FycmF5OkFycmF5PGFueT4gPSBbXTtcbnZhciB0YXNrc3RvcmFnZSA9IG5ldyBEYXRhU3RvcmFnZSgpO1xudmFyIHRhc2ttYW5hZ2VyID0gbmV3IFRhc2tNYW5hZ2VyKHRhc2thcnJheSk7XG52YXIgbGlzdHZpZXcgPSBuZXcgTGlzdFZpZXcoJ3Rhc2stbGlzdCcpO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgIGxldCB0YXNrZGF0YSA9IHRhc2tzdG9yYWdlLnJlYWQoKTtcblxuICAgIHRhc2tkYXRhLmZvckVhY2goKGl0ZW0pID0+IHt0YXNrYXJyYXkucHVzaChpdGVtKTt9KTtcbiAgICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcbn0pO1xuXG5cbi8vcmVmZXJlbmNlIHRvIGZvcm1cbmNvbnN0IHRhc2tmb3JtID0gKDxIVE1MRm9ybUVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWZvcm0nKSk7XG50YXNrZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCggZXZlbnQ6IEV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5jb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWlucHV0Jyk7XG4gIGxldCB0YXNrbmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5pbnB1dCkudmFsdWU7XG4gICAgdGFza2Zvcm0ucmVzZXQoKTtcbiAvLyBjb25zb2xlLmxvZyh0YXNrbmFtZSk7XG4gICAgbGV0IHRhc2sgPSBuZXcgVGFzayggdGFza25hbWUgKTtcbiAgICB0YXNrbWFuYWdlci5hZGQoIHRhc2sgKTtcbiAgICBsaXN0dmlldy5jbGVhcigpO1xuICAgIHRhc2tzdG9yYWdlLnN0b3JlKHRhc2thcnJheSk7XG4gICAgbGlzdHZpZXcucmVuZGVyKHRhc2thcnJheSk7XG59KTtcbiJdfQ==
