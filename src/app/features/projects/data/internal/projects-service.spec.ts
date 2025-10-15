import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ProjectsService } from './projects-service';
import { Project } from '../project.model';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let httpMock: HttpTestingController;

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Project 1',
      description: 'Description 1',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Project 2',
      description: 'Description 2',
      createdAt: '2025-01-02T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ProjectsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProjectsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProjects', () => {
    it('should fetch all projects successfully', async () => {
      const promise = service.getAllProjects();

      const req = httpMock.expectOne('/projects');
      expect(req.request.method).toBe('GET');
      req.flush(mockProjects);

      const result = await promise;
      expect(result).toEqual(mockProjects);
      expect(result.length).toBe(2);
    });

    it('should handle error when fetching all projects', async () => {
      const errorMessage = 'Failed to fetch projects';
      const promise = service.getAllProjects();

      const req = httpMock.expectOne('/projects');
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });

      await expectAsync(promise).toBeRejectedWithError(errorMessage);
    });
  });

  describe('getProject', () => {
    it('should fetch a single project by id', async () => {
      const projectId = '1';
      const promise = service.getProject(projectId);

      const req = httpMock.expectOne(`/projects/${projectId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProjects[0]);

      const result = await promise;
      expect(result).toEqual(mockProjects[0]);
      expect(result.id).toBe(projectId);
    });

    it('should handle error when fetching a project', async () => {
      const projectId = '999';
      const errorMessage = 'Project not found';
      const promise = service.getProject(projectId);

      const req = httpMock.expectOne(`/projects/${projectId}`);
      req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });

      await expectAsync(promise).toBeRejectedWithError(errorMessage);
    });
  });

  describe('addProject', () => {
    it('should create a new project successfully', async () => {
      const newProject: Partial<Project> = {
        name: 'New Project',
        description: 'New Description'
      };
      const createdProject: Project = {
        ...newProject,
        id: '3',
        name: 'New Project',
        description: 'New Description'
      };

      const promise = service.addProject(newProject);

      const req = httpMock.expectOne('/projects');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProject);
      req.flush(createdProject);

      const result = await promise;
      expect(result).toEqual(createdProject);
      expect(result.id).toBe('3');
    });

    it('should handle error when creating a project', async () => {
      const newProject: Partial<Project> = {
        name: 'New Project',
        description: 'New Description'
      };
      const errorMessage = 'Validation failed';
      const promise = service.addProject(newProject);

      const req = httpMock.expectOne('/projects');
      req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });

      await expectAsync(promise).toBeRejectedWithError(errorMessage);
    });
  });

  describe('updateProject', () => {
    it('should update an existing project successfully', async () => {
      const projectId = '1';
      const updates: Partial<Project> = {
        name: 'Updated Project',
        description: 'Updated Description'
      };
      const updatedProject: Project = {
        ...mockProjects[0],
        ...updates
      };

      const promise = service.updateProject(projectId, updates);

      const req = httpMock.expectOne(`/projects/${projectId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      req.flush(updatedProject);

      const result = await promise;
      expect(result).toEqual(updatedProject);
      expect(result.name).toBe('Updated Project');
    });

    it('should handle error when updating a project', async () => {
      const projectId = '999';
      const updates: Partial<Project> = {
        name: 'Updated Project'
      };
      const errorMessage = 'Project not found';
      const promise = service.updateProject(projectId, updates);

      const req = httpMock.expectOne(`/projects/${projectId}`);
      req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });

      await expectAsync(promise).toBeRejectedWithError(errorMessage);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project successfully', async () => {
      const projectId = '1';
      const promise = service.deleteProject(projectId);

      const req = httpMock.expectOne(`/projects/${projectId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      await expectAsync(promise).toBeResolved();
    });

    it('should handle error when deleting a project', async () => {
      const projectId = '999';
      const errorMessage = 'Project not found';
      const promise = service.deleteProject(projectId);

      const req = httpMock.expectOne(`/projects/${projectId}`);
      req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });

      await expectAsync(promise).toBeRejectedWithError(errorMessage);
    });
  });
});
