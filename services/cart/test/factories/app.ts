import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { ValidationException } from '@/exception/validation.exception';
import { MESSAGE_BROKER } from '@/modules/message-broker/interfaces/message-broker.interface';
import { MockKafkaWrapper } from '@/modules/message-broker/mocks/mock-kafka-wrapper';
import { AppModule } from '@/app.module';

export class AppFactory {
  private constructor(
    private appInstance: INestApplication,
  ) {}

  get instance(): INestApplication {
    return this.appInstance;
  }

  static async new(): Promise<AppFactory> {
    const moduleBuilder: TestingModuleBuilder = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MESSAGE_BROKER)
      .useClass(MockKafkaWrapper);

    const module: TestingModule = await moduleBuilder.compile();

    const app: INestApplication = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        whitelist: true,
        transform: true,
        exceptionFactory: (errors) => new ValidationException(errors),
      }),
    );

    await app.init();

    return new AppFactory(app);
  }

  async close(): Promise<void> {
    if (this.appInstance) await this.appInstance.close();
  }
}
