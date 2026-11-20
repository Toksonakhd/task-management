
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task, TaskData } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'https://gorest.co.in/public/v2';

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('gorest_token') || ''}`
    });
  }

  getTasks() {
    return this.http.get<Task[]>(`${this.apiUrl}/todos`);
  }

  addTask(task: TaskData) {
    return this.http.post<Task>(`${this.apiUrl}/todos`, task, {
      headers: this.getHeaders()
    });
  }

  updateTask(id: number, task: TaskData) {
    return this.http.put<Task>(`${this.apiUrl}/todos/${id}`, task, {
      headers: this.getHeaders()
    });
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.apiUrl}/todos/${id}`, {
      headers: this.getHeaders()
    });
  }

  createUser() {
    const user = {
      name: 'Angular Student',
      email: `student${Date.now()}@example.com`,
      gender: 'male',
      status: 'active'
    };

    return this.http.post<{ id: number }>(
      `${this.apiUrl}/users`,
      user,
      { headers: this.getHeaders() }
    );
  }
}
