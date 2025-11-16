import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiServiceService } from './api-service.service';
import { Todo } from './item';
import {FormControl, ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  apiService = inject(ApiServiceService);
  fb = inject(FormBuilder);

  todoForm = this.fb.group({
  title: ['', Validators.required]
  });

  taskList:Todo[] = [];
  filter: 'all' | 'completed' | 'pending' = 'all';
  priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
  editingTodoId: number | null = null;
  nextId = 1;
  ngOnInit(): void {
    const saved = localStorage.getItem('taskList');
    const savedId = localStorage.getItem('nextId');
    if (saved) this.taskList = JSON.parse(saved);
    if (savedId) this.nextId = Number(savedId);
  }
  saveTasks() {
    localStorage.setItem('taskList', JSON.stringify(this.taskList));
    localStorage.setItem('nextId', String(this.nextId));
  }
  toggleCompleted(task: any) {
    task.completed = !task.completed;
    this.saveTasks();
    this.sortByPriority(); 
  }

  get filteredTasks() {
    if (this.filter === 'completed') return this.taskList.filter(t => t.completed);
    if (this.filter === 'pending') return this.taskList.filter(t => !t.completed);
    return this.taskList;
  }

 addTodo() {
    const title = this.todoForm.value.title?.trim();
    if (!title) return;

    if (this.editingTodoId != null) {
      const todo = this.taskList.find(t => t.id === this.editingTodoId);
      if (todo) todo.title = title;
      this.editingTodoId = null;
    } else {
        const newTodo: Todo = {
        id: this.nextId++,
        userId: 1,
        completed: false,
        title: title,
        priority: 'low'
      };
      this.taskList.push(newTodo);
    }
    this.saveTasks();
    this.todoForm.reset();
  }

editTodo(todo: Todo) {
  this.editingTodoId = todo.id;
  this.todoForm.setValue({ title: todo.title });
}

setPriority(todo: Todo, level: 'low' | 'medium' | 'high') {
  todo.priority = level;
}
sortByPriority() {
  this.taskList.sort((a, b) => this.priorityOrder[b.priority] - this.priorityOrder[a.priority]);
}
deleteTodo(id: number) {
  this.apiService.deleteTodo(id).subscribe(() => {
  this.taskList = this.taskList.filter(t => t.id !== id);
  });
}
}



