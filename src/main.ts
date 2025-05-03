import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ChatBOT_FURIA API')
    .setDescription('API para o ChatBOT_FURIA')
    .setContact('Eduardo', '', 'eduardoferreirabmatos@gmail.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
