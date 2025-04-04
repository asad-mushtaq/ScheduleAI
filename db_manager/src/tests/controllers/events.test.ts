import { Request, Response } from 'express';
import * as eventController from '../../controllers/events.js';
import * as service from '../../database/crud/event.js';
import { verifyId } from '../../services/verification.js';
import { errorHandler } from '../../services/errors.js';

jest.mock('../../database/crud/event.js');
jest.mock('../../services/verification.js');
jest.mock('../../services/errors.js');

describe('Event Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      setHeader: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should call service.createEvent and return event json on success', async () => {
      const fakeEvent = { name: 'Test Event' };
      req.body = {
        userId: '123',
        name: 'Test Event',
        description: 'Test Desc',
        startDate: '2025-04-02',
        length: '60',
      };

      (verifyId as jest.Mock).mockReturnValue('123');
      (service.createEvent as jest.Mock).mockResolvedValue(fakeEvent);

      await eventController.createEvent(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.body.userId);
      expect(service.createEvent).toHaveBeenCalledWith(
        '123',
        'Test Event',
        'Test Desc',
        new Date(req.body.startDate),
        60
      );
      expect(res.json).toHaveBeenCalledWith(fakeEvent);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.body = {
        userId: '123',
        name: 'Test Event',
        description: 'Test Desc',
        startDate: '2025-04-02',
        length: '60',
      };

      (verifyId as jest.Mock).mockReturnValue('123');
      (service.createEvent as jest.Mock).mockRejectedValue(error);

      await eventController.createEvent(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('deleteEvent', () => {
    it('should call service.deleteEvent and return event json on success', async () => {
      const fakeEvent = { id: '123' };
      req.params = { id: '123' };

      (verifyId as jest.Mock).mockReturnValue('123');
      (service.deleteEvent as jest.Mock).mockResolvedValue(fakeEvent);

      await eventController.deleteEvent(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.params.id);
      expect(service.deleteEvent).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(fakeEvent);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.params = { id: '123' };

      (verifyId as jest.Mock).mockReturnValue('123');
      (service.deleteEvent as jest.Mock).mockRejectedValue(error);

      await eventController.deleteEvent(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('getEventById', () => {
    it('should call service.getEvent and return event json on success', async () => {
      const fakeEvent = { id: '123' };
      req.params = { id: '123' };

      (verifyId as jest.Mock).mockReturnValue('123');
      (service.getEvent as jest.Mock).mockResolvedValue(fakeEvent);

      await eventController.getEventById(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.params.id);
      expect(service.getEvent).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(fakeEvent);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.params = { id: '123' };

      (verifyId as jest.Mock).mockReturnValue('123');
      (service.getEvent as jest.Mock).mockRejectedValue(error);

      await eventController.getEventById(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('getAllEvents', () => {
    it('should call service.getAllEvents and return events json on success', async () => {
      const fakeEvents = [{ id: '123' }, { id: '456' }];
      (service.getAllEvents as jest.Mock).mockResolvedValue(fakeEvents);

      await eventController.getAllEvents(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(service.getAllEvents).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(fakeEvents);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      (service.getAllEvents as jest.Mock).mockRejectedValue(error);

      await eventController.getAllEvents(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('getEventTasks', () => {
    it('should call service.getEventTasks and return tasks json on success', async () => {
      const fakeTask1 = { toJSON: jest.fn().mockReturnValue({ id: '1', name: 'Task 1' }) };
      const fakeTask2 = { toJSON: jest.fn().mockReturnValue({ id: '2', name: 'Task 2' }) };
      const fakeTasks = [fakeTask1, fakeTask2];
      req.params = { id: '123' };

      (verifyId as jest.Mock).mockReturnValue('123');
      (service.getEventTasks as jest.Mock).mockResolvedValue(fakeTasks);

      await eventController.getEventTasks(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(verifyId).toHaveBeenCalledWith(req.params.id);
      expect(service.getEventTasks).toHaveBeenCalledWith('123');
      expect(fakeTask1.toJSON).toHaveBeenCalled();
      expect(fakeTask2.toJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([
        { id: '1', name: 'Task 1' },
        { id: '2', name: 'Task 2' },
      ]);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.params = { id: '123' };

      (verifyId as jest.Mock).mockReturnValue('123');
      (service.getEventTasks as jest.Mock).mockRejectedValue(error);

      await eventController.getEventTasks(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });

  describe('editEvent', () => {
    it('should call service.updateEvent and return event json on success', async () => {
      const fakeEvent = { id: '123', name: 'Updated Event' };
      req.body = {
        id: '123',
        name: 'Updated Event',
        description: 'Updated Desc',
        startDate: '2025-04-02',
        length: '90',
      };

      (service.updateEvent as jest.Mock).mockResolvedValue(fakeEvent);

      await eventController.editEvent(req as Request, res as Response);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(service.updateEvent).toHaveBeenCalledWith(
        '123',
        'Updated Event',
        'Updated Desc',
        new Date(req.body.startDate),
        90
      );
      expect(res.json).toHaveBeenCalledWith(fakeEvent);
    });

    it('should call errorHandler on error', async () => {
      const error = new Error('Failed');
      req.body = {
        id: '123',
        name: 'Updated Event',
        description: 'Updated Desc',
        startDate: '2025-04-02',
        length: '90',
      };

      (service.updateEvent as jest.Mock).mockRejectedValue(error);

      await eventController.editEvent(req as Request, res as Response);

      expect(errorHandler).toHaveBeenCalledWith(error, res);
    });
  });
});
