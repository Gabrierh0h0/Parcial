import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dictator } from 'src/dictators/entities/dictator.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AutenticadorGuard implements CanActivate {
  // Para poder buscar si el nombre del dictador existe
  constructor(
    @InjectRepository(Dictator)
    private dictatorRepository: Repository<Dictator>,

  ) {console.log('Construyendo: AutenticadorGuard')}

  async canActivate(context: ExecutionContext,): Promise<boolean>  {
    
    const req=context.switchToHttp().getRequest();
    const user=req.user;
    console.log(user);   

    // Verifica si hay un usuario y un username en el token
    if (!user || !user.name) {
      throw new UnauthorizedException('No estás autenticado o falta el nombre de usuario');
    }

    // Busca el dictator por name en la base de datos
    const dictator = await this.dictatorRepository.findOne({ where: { name: user.name }, });

    // Si no se encuentra el dictator, deniega acceso
    if (!dictator) {
      throw new UnauthorizedException('No eres un dictator registrado');
    }

    // Si se encuentra, permite el acceso
    return true;

  }
}
