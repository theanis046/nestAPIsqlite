import { Injectable, HttpService } from '@nestjs/common';
import { EmployeeDto } from './entities/employee.dto';
import { urls } from 'src/common/consts';
import { FormatString } from 'src/common/stringUtil';

@Injectable()
export class EmployeeService {

  constructor(
    private readonly httpService: HttpService,
  ) { }

  /**
   * returns full list of Employees from https://employees-api.vercel.app/api/
   */
  async getAllEmployeeAsync(): Promise<EmployeeDto[]> {
    const response = await this.httpService.get(urls.allEmployees).toPromise();

    const responseDetail = await this.httpService.get(FormatString(urls.employeeById, response.data.data[0].id.toString())).toPromise();
    console.log(responseDetail.data.data);

    return response.data.data as EmployeeDto[];
  }

  /**
   * Gets Employee from https://employees-api.vercel.app/api/
   * @param id Employee Id from https://employees-api.vercel.app/api/
   * @returns null in error case so that caller dont have to catch exception again.
   */
  async getEmployeeById(id: string): Promise<EmployeeDto | null> {

    try {
      const responseDetail = await this.httpService.get(FormatString(urls.employeeById, id)).toPromise();
      return responseDetail.data as EmployeeDto;
    } catch (error) {
      console.log(`Exception occured while Calling ${FormatString(urls.employeeById, id)}`);
    }

    return null;
  }
}
