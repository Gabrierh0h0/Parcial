import { PartialType } from '@nestjs/mapped-types';
import { CreateSlaveDto } from './create-slave.dto';

export class UpdateSlaveDto extends PartialType(CreateSlaveDto) {}
