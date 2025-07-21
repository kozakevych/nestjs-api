import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: uuidv4(), title: 'Sample Task', completed: false },
  ];

  findAll() {
    return this.tasks;
  }

  create(dto: CreateTaskDto) {
    const task = {
      id: uuidv4(),
      title: dto.title,
      completed: dto.completed ?? false,
    };
    this.tasks.push(task);
    return task;
  }

  update(id: string, dto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException('Task not found');
    Object.assign(task, dto);
    return task;
  }

  remove(id: string) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Task not found');
    this.tasks.splice(index, 1);
  }

  findOne(id: string) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
}
