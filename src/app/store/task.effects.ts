
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { TaskService } from '../services/task';
import * as TaskActions from './task.actions';

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() =>
        this.taskService.getTasks().pipe(
          map(tasks => TaskActions.loadTasksSuccess({ tasks })),
          catchError(() =>
            of(TaskActions.loadTasksFailure({
              error: 'Failed to load tasks'
            }))
          )
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap(({ task }) =>
        this.taskService.addTask(task).pipe(
          map(result => TaskActions.addTaskSuccess({ task: result })),
          catchError(() =>
            of(TaskActions.taskFailure({
              error: 'Failed to add task'
            }))
          )
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(({ id, task }) =>
        this.taskService.updateTask(id, task).pipe(
          map(result => TaskActions.updateTaskSuccess({ task: result })),
          catchError(() =>
            of(TaskActions.taskFailure({
              error: 'Failed to update task'
            }))
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) =>
        this.taskService.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError(() =>
            of(TaskActions.taskFailure({
              error: 'Failed to delete task'
            }))
          )
        )
      )
    )
  );
}
