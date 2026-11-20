
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as TaskActions from '../../store/task.actions';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm {
  private store = inject(Store);

  title = signal('');
  userId = signal<number | null>(null);
  status = signal('pending');

  addTask() {
    if (!this.title().trim() || !this.userId()) {
      return;
    }

    this.store.dispatch(TaskActions.addTask({
      task: {
        title: this.title(),
        user_id: this.userId()!,
        status: this.status()
      }
    }));

    this.title.set('');
    this.userId.set(null);
    this.status.set('pending');
  }
}
