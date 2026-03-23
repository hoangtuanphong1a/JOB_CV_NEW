import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum MessageType {
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app',
}

export class SendMessageDto {
  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType = MessageType.EMAIL;

  @IsOptional()
  @IsString()
  template?: string;
}
