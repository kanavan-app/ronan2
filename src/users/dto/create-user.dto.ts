import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'ck', description: 'Username for login' })
  username: string;

  @ApiProperty({ example: '123456', description: 'Password for login' })
  password: string;
}
