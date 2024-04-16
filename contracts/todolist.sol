// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
        bool deleted; // Flag to mark task as deleted
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    event TaskCompleted(
        uint id,
        bool completed
    );

    event TaskUpdated(
        uint id,
        string content
    );

    event TaskDeleted(
        uint id
    );

    constructor() {
        createTask("Task Example");
    }

    function createTask(string memory _content) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        Task storage _task = tasks[_id];
        require(!_task.deleted, "Task has been deleted");
        _task.completed = !_task.completed;
        emit TaskCompleted(_id, _task.completed);
    }

    function updateTask(uint _id, string memory _content) public {
        require(bytes(_content).length > 0, "Content cannot be empty");
        Task storage _task = tasks[_id];
        require(!_task.deleted, "Task has been deleted");
        _task.content = _content;
        emit TaskUpdated(_id, _content);
    }

    function deleteTask(uint _id) public {
        Task storage _task = tasks[_id];
        require(!_task.deleted, "Task has already been deleted");
        _task.deleted = true;
        emit TaskDeleted(_id);
    }
}
