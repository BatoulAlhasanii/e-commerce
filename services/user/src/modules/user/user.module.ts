import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { UserService } from '@/modules/user/user.service';
import { UserController } from '@/modules/user/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
