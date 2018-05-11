import {Task} from '../ts/task';
export class ListView{
    list:HTMLElement;
    constructor( listid:string ){
        this.list = document.getElementById( listid );
    }
    render( items:Array<Task> ){
        items.forEach((task) => {
            let id = task.id;
            let name = task.name;
            let status = task.status;
            let template = `<li id="${id}" data-status="${status}">
                            <div class="task-container">
                                <div class="task-name">${name}</div>
                            <div class="task-buttons">
                                <button type="button" data-function="highlight">&#10025</button>
                                <button type="button" data-function="status">&#10003;</button>
                                <button type="button" data-function="delete">&#10007;</button>
            </div>
            </div>
            <li>`;
            let fragment = document.createRange().createContextualFragment( template );
            this.list.appendChild(fragment);
        });
    }
    clear(){
        this.list.innerHTML ='';
    }
}
