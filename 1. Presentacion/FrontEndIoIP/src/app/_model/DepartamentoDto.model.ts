import { PaisDto } from 'src/app/_model/PaisDto.model';
export class DepartamentoDto {
  departamentoId: number;
  codigoDepartamento: number;
  nombre: string;
  paisId: number;
  pais: PaisDto;
  activo: boolean;
}
