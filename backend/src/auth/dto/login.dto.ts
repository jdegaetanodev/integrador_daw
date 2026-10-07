import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Documento del usuario',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty({ message: 'El documento es requerido' })
  documento: string;

  @ApiProperty({
    description: 'Clave del usuario',
    example: '123456',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'La clave es requerida' })
  @MinLength(6, { message: 'La clave debe tener al menos 6 caracteres' })
  clave: string;
}