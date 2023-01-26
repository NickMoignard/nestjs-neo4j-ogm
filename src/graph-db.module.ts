import { Module } from '@nestjs/common';
import { GraphDbService as GraphDbService } from './graph-db.service';

@Module({
  providers: [GraphDbService],
  exports: [GraphDbService],
})
export class GraphDbModule {}
