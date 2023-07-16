import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import { TodoService } from './todo.service';
import {
  IPagination,
  ITodo,
  ITodoPaginationResult,
} from './interface/todo.interface';
import { CreateTodoDto } from './dto/create.todo.dto';
import { CompleteTodoDto } from './dto/complete.todo.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllTodos(
    @Query() { page, limit }: IPagination,
    @Request() req: any,
  ): Promise<ITodoPaginationResult> {
    return this.todoService.findAll(page, limit, req.user);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<ITodo> {
    return this.todoService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createTodo(@Body() dto: CreateTodoDto, @Request() req: any): Promise<ITodo> {
    return this.todoService.create(dto, req.user);
  }

  @Patch(':id')
  completeTodo(
    @Param('id') id: string,
    @Body() dto: CompleteTodoDto,
  ): Promise<ITodo> {
    return this.todoService.changeComplete(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.deleteById(id);
  }
}
