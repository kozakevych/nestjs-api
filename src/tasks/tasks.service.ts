import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto';

let currentId = 1;

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [{ id: 1, title: 'Sample Task', completed: false }];

  findAll() {
    return this.tasks;
  }

  create(dto: CreateTaskDto) {
    const task = {
      id: currentId++,
      title: dto.title,
      completed: dto.completed ?? false,
    };
    this.tasks.push(task);
    return task;
  }

  update(id: number, dto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException('Task not found');
    Object.assign(task, dto);
    return task;
  }

  remove(id: number) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Task not found');
    this.tasks.splice(index, 1);
  }

  findOne(id: number) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }
}
