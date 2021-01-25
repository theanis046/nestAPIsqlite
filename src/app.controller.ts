import { Controller, Get} from '@nestjs/common';

@Controller()
export class AppController {

  @Get('health')
  getProjects() {
    return {
      status: 'Healthy',
    };
  }
}
