import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'El documento es requerido' })
  documento: string;

  @IsString()
  @IsNotEmpty({ message: 'La clave es requerida' })
  @MinLength(6, { message: 'La clave debe tener al menos 6 caracteres' })
  clave: string;
}