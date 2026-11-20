
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import * as TaskActions from '../../store/task.actions';
import * as TaskSelectors from '../../store/task.selectors';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList implements OnInit {
  private store = inject(Store);

  tasks = toSignal(this.store.select(TaskSelectors.selectAllTasks), {
    initialValue: []
  });

  loading = toSignal(this.store.select(TaskSelectors.selectLoading), {
    initialValue: false
  });

  error = toSignal(this.store.select(TaskSelectors.selectError), {
    initialValue: ''
  });

  search = signal('');
  statusFilter = signal('all');
  userFilter = signal('');

  filteredTasks = computed(() => {
    return this.tasks().filter(task => {
      const matchesTitle = task.title.toLowerCase()
        .includes(this.search().toLowerCase().trim());

      const matchesStatus = this.statusFilter() === 'all'
        || task.status === this.statusFilter();

      const matchesUser = !this.userFilter().trim()
        || task.user_id.toString() === this.userFilter().trim();

      return matchesTitle && matchesStatus && matchesUser;
    });
  });

  editingId = signal<number | null>(null);
  editTitle = signal('');
  editStatus = signal('pending');

  ngOnInit() {
    this.store.dispatch(TaskActions.loadTasks());
  }

  startEdit(id: number, title: string, status: string) {
    this.editingId.set(id);
    this.editTitle.set(title);
    this.editStatus.set(status);
  }

  saveEdit(id: number, userId: number) {
    if (!this.editTitle().trim()) {
      return;
    }

    this.store.dispatch(TaskActions.updateTask({
      id,
      task: {
        user_id: userId,
        title: this.editTitle().trim(),
        status: this.editStatus()
      }
    }));

    this.editingId.set(null);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  deleteTask(id: number) {
    this.store.dispatch(TaskActions.deleteTask({ id }));
  }
}
