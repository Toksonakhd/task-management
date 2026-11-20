
import { createReducer, on } from '@ngrx/store';
import { Task } from '../models/task.model';
import * as TaskActions from './task.actions';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string;
}

export const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: ''
};

export const taskReducer = createReducer(
  initialState,

  on(TaskActions.loadTasks, state => ({
    ...state,
    loading: true,
    error: ''
  })),

  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false
  })),

  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(TaskActions.addTask, TaskActions.updateTask, TaskActions.deleteTask, state => ({
    ...state,
    loading: true,
    error: ''
  })),

  on(TaskActions.addTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [task, ...state.tasks],
    loading: false
  })),

  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    loading: false
  })),

  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
    loading: false
  })),

  on(TaskActions.taskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
