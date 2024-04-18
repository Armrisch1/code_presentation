import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseInterface {
  @ApiProperty({
    description: 'Access token',
    type: String,
  })
  accessToken: string;

  // @ApiProperty({
  //   description: 'Refresh token',
  //   type: String,
  // })
  // refreshToken: string;
}
