import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { TodoService } from './todo.service';
import {
  IPagination,
  ITodo,
  ITodoPaginationResult,
} from './interface/todo.interface';
import { CreateTodoDto } from './dto/create.todo.dto';
import { CompleteTodoDto } from './dto/complete.todo.dto';
import { PrivateTodoDto } from './dto/private.todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllTodos(
    @Query() { page, limit }: IPagination,
  ): Promise<ITodoPaginationResult> {
    return this.todoService.findAll(page, limit);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<ITodo> {
    return this.todoService.findById(id);
  }

  @Post()
  createTodo(@Body() dto: CreateTodoDto): Promise<ITodo> {
    return this.todoService.create(dto);
  }

  @Patch(':id')
  completeTodo(
    @Param('id') id: string,
    @Body() dto: CompleteTodoDto,
  ): Promise<ITodo> {
    return this.todoService.changeComplete(id, dto);
  }

  @Patch(':id')
  privateTodo(
    @Param('id') id: string,
    @Body() dto: PrivateTodoDto,
  ): Promise<ITodo> {
    return this.todoService.changePrivate(id, dto);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.deleteById(id);
  }
}
