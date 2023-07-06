export class CreateTodoDto {
  readonly title: string;
  readonly description: string;
  readonly isPrivate: boolean;
  readonly isComplete: boolean;
}
