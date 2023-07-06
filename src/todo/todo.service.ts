import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Todo } from './schema/todo.schema';
import { CreateTodoDto } from './dto/create.todo.dto';
import { ITodo, ITodoPaginationResult } from './interface/todo.interface';
import { CompleteTodoDto } from './dto/complete.todo.dto';
import { PrivateTodoDto } from './dto/private.todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: mongoose.Model<Todo>,
  ) {}

  async findAll(page = 1, limit = 20): Promise<ITodoPaginationResult> {
    const skip = (page - 1) * limit;
    const count = await this.todoModel.count();
    const page_total = Math.ceil(count / limit);
    const todos = await this.todoModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate('owner', '_id email');

    return { todos: todos, page_total: page_total };
  }

  async create(dto: CreateTodoDto): Promise<ITodo> {
    const todo = await this.todoModel.create(dto);
    return todo.save();
  }

  async deleteById(id: string) {
    const todo = await this.todoModel.findByIdAndRemove(id);

    if (!todo) {
      throw new NotFoundException('Todo not found!');
    }

    return todo;
  }

  async findById(id: string): Promise<ITodo> {
    const todo = await this.todoModel.findById(id);

    if (!todo) {
      throw new NotFoundException('Todo not found!');
    }
    return todo;
  }

  async changeComplete(id: string, dto: CompleteTodoDto): Promise<ITodo> {
    const todo = await this.todoModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      throw new NotFoundException('Todo not found!');
    }

    return todo;
  }

  async changePrivate(id: string, dto: PrivateTodoDto): Promise<ITodo> {
    const todo = await this.todoModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      throw new NotFoundException('Todo not found!');
    }

    return todo;
  }
}
