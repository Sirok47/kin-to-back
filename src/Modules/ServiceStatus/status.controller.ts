import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';
import { ServiceStatusDTO, ServiceStatusViewModel } from './status.dto';
import { AdminAuthGuard } from '../../Middlewares/Guards/admin.guard';

@ApiTags('Service availability')
@UseGuards(AdminAuthGuard)
@Controller('/status')
export class ServiceStatusController {
  constructor(private readonly service: StatusService) {}

  @ApiResponse({
    status: 200,
    description: 'Возвращает объект общих установок сервиса.',
    type: ServiceStatusViewModel,
  })
  @Get()
  async getStatus(): Promise<ServiceStatusViewModel> {
    return this.service.getStatus();
  }

  @ApiBody({ type: ServiceStatusDTO })
  @ApiResponse({
    status: 204,
    description: 'Acknowledged',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiBearerAuth()
  @UseGuards(AdminAuthGuard)
  @Put()
  async setStatus(@Body() upd: ServiceStatusDTO) {
    await this.service.updateStatus(upd);
  }
}
