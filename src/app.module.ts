import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service'; 
import { SlavesModule } from './slaves/slaves.module';
import { BattlesModule } from './battles/battles.module';
import { DictatorsModule } from './dictators/dictators.module';
import { SponsorsModule } from './sponsors/sponsors.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({

  imports: [SlavesModule, BattlesModule, DictatorsModule, SponsorsModule, TransactionsModule, ConfigModule.forRoot(),//Me permite usar variables de entorno
    TypeOrmModule.forRoot({//Configuración de la base de datos
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // Recuerda cambiar a false en producción
    })],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
