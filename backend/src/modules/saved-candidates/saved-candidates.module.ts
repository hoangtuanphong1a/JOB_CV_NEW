import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedCandidatesController } from './saved-candidates.controller';
import { SavedCandidatesService } from './saved-candidates.service';
import { SavedCandidate } from '../common/entities/saved-candidate.entity';
import { User } from '../common/entities/user.entity';
import { Company } from '../common/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavedCandidate, User, Company])],
  controllers: [SavedCandidatesController],
  providers: [SavedCandidatesService],
  exports: [SavedCandidatesService],
})
export class SavedCandidatesModule {}