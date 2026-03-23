import { IsDateString, IsOptional, IsString, IsEnum } from 'class-validator';

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  IN_PERSON = 'in-person',
}

export class ScheduleInterviewDto {
  @IsDateString()
  interviewDate: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(InterviewType)
  interviewType?: InterviewType;

  @IsOptional()
  @IsString()
  interviewer?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
