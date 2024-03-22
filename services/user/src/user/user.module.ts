import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@/database/typeorm/typeorm.module';
import { UserRepository } from '@/user/repositories/user.repository';
import { UserService } from '@/user/user.service';
import { UserController } from '@/user/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
