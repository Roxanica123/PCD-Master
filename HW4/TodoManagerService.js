const TO_DO_TABLE = "todos";

class TodoManagerService {

    constructor(enclaveDB) {
        this.enclave = enclaveDB;
    }

    createToDo(todo, callback) {
        todo.value  = todo.input.value
        this.enclave.insertRecord(TO_DO_TABLE, todo.input.name, todo, callback);
    }

    removeToDo(todo, callback) {
        this.enclave.deleteRecord(TO_DO_TABLE, todo.input.name, callback);
    }

    editToDo(todo, callback) {
        this.enclave.updateRecord(TO_DO_TABLE, todo.input.name, todo, callback);
    }

    listToDos(callback) {
        this.enclave.getAllRecords(TO_DO_TABLE, callback);
    }

    filterToDos( query,sort,callback) {
        if( !sort || sort != "dsc") {
            sort = "asc";
        }

        this.enclave.filter(TO_DO_TABLE, query, sort, callback);
    }
}

let todoManagerService;
let getTodoManagerServiceInstance = function (controllerInstance, callback) {
    if (!todoManagerService) {
        controllerInstance.getMainEnclaveDB((err, enclave) => {
            if (err) {
                console.log('Could not get main enclave ', err);
                return callback(err);
            }
            todoManagerService = new TodoManagerService(enclave);
            return callback(todoManagerService)
        })

    } else {
        return callback(todoManagerService);
    }
}

export {
    getTodoManagerServiceInstance
};
