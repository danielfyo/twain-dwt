import { DepartamentoDto } from './DepartamentoDto.model';

export class CiudadDto {
  ciudadId: number;
  divipo: string;
  departamento: DepartamentoDto;
  departamentoId: number;
  nombre: string;
  activo: boolean;
}
