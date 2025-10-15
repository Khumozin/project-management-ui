import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Project } from '../project.model';
import { catchError, lastValueFrom, throwError } from 'rxjs';

/**
 * Service for managing project data operations.
 * Handles all HTTP requests related to projects including CRUD operations.
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  readonly #http = inject(HttpClient);

  /**
   * Retrieves all projects from the API.
   *
   * @returns A promise that resolves to an array of projects
   * @throws Error with the server error message if the request fails
   */
  getAllProjects(): Promise<Project[]> {
    return lastValueFrom(
      this.#http.get<Project[]>('/projects').pipe(
        catchError((e: HttpErrorResponse) => {
          return throwError(() => new Error(e.error.message));
        }),
      ),
    );
  }

  /**
   * Retrieves a single project by its ID.
   *
   * @param id - The unique identifier of the project to retrieve
   * @returns A promise that resolves to the project
   * @throws Error with the server error message if the request fails
   */
  getProject(id: string): Promise<Project> {
    return lastValueFrom(
      this.#http.get<Project>(`/projects/${id}`).pipe(
        catchError((e: HttpErrorResponse) => {
          return throwError(() => new Error(e.error.message));
        }),
      ),
    );
  }

  /**
   * Creates a new project.
   *
   * @param project - The partial project data to create
   * @returns A promise that resolves to the created project
   * @throws Error with the server error message if the request fails
   */
  addProject(project: Partial<Project>): Promise<Project> {
    return lastValueFrom(
      this.#http.post<Project>(`/projects`, project).pipe(
        catchError((e: HttpErrorResponse) => {
          return throwError(() => new Error(e.error.message));
        }),
      ),
    );
  }

  /**
   * Updates an existing project.
   *
   * @param id - The unique identifier of the project to update
   * @param project - The partial project data to update
   * @returns A promise that resolves to the updated project
   * @throws Error with the server error message if the request fails
   */
  updateProject(id: string, project: Partial<Project>): Promise<Project> {
    return lastValueFrom(
      this.#http.put<Project>(`/projects/${id}`, project).pipe(
        catchError((e: HttpErrorResponse) => {
          return throwError(() => new Error(e.error.message));
        }),
      ),
    );
  }

  /**
   * Deletes a project by its ID.
   *
   * @param id - The unique identifier of the project to delete
   * @returns A promise that resolves when the project is deleted
   * @throws Error with the server error message if the request fails
   */
  deleteProject(id: string): Promise<void> {
    return lastValueFrom(
      this.#http.delete<void>(`/projects/${id}`).pipe(
        catchError((e: HttpErrorResponse) => {
          return throwError(() => new Error(e.error.message));
        }),
      ),
    );
  }
}
