import { Entity } from 'typeorm/decorator/entity/Entity';
import { Column } from 'typeorm/decorator/columns/Column';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { BaseEntity } from './base.entity';
import { Application } from './application.entity';
import { User } from './user.entity';

export enum ApplicationEventType {
  APPLIED = 'applied',
  VIEWED_BY_EMPLOYER = 'viewed_by_employer',
  STATUS_CHANGED = 'status_changed',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEW_COMPLETED = 'interview_completed',
  OFFER_MADE = 'offer_made',
  OFFER_ACCEPTED = 'offer_accepted',
  OFFER_REJECTED = 'offer_rejected',
  APPLICATION_WITHDRAWN = 'application_withdrawn',
  NOTE_ADDED = 'note_added',
  CV_DOWNLOADED = 'cv_downloaded',
  FEEDBACK_GIVEN = 'feedback_given',
}

@Entity('application_events')
export class ApplicationEvent extends BaseEntity {
  @Column({ name: 'application_id' })
  applicationId: string;

  @Column({
    type: 'varchar',
    default: ApplicationEventType.APPLIED,
  })
  eventType: ApplicationEventType;

  @Column({ type: 'text', nullable: true })
  eventData?: string; // JSON data chứa thông tin chi tiết về event

  @Column({ type: 'text', nullable: true })
  description?: string; // Mô tả event cho người dùng

  @Column({ nullable: true })
  oldStatus?: string; // Status cũ (cho status_changed events)

  @Column({ nullable: true })
  newStatus?: string; // Status mới (cho status_changed events)

  @Column({ name: 'triggered_by_id', nullable: true })
  triggeredById?: string; // User ID của người trigger event

  @Column({ type: 'varchar', nullable: true })
  ipAddress?: string; // IP address của người trigger event

  @Column({ type: 'varchar', nullable: true })
  userAgent?: string; // User agent của browser

  @Column({ type: 'tinyint', width: 1, default: 0 })
  isVisibleToJobSeeker: boolean; // Event có hiển thị cho job seeker không

  // Relationships
  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'triggered_by_id' })
  triggeredBy?: User;

  // Helper methods
  get eventDataParsed(): Record<string, any> {
    if (!this.eventData) return {};
    try {
      return JSON.parse(this.eventData);
    } catch {
      return {};
    }
  }

  setEventData(data: any): void {
    this.eventData = JSON.stringify(data);
  }

  get triggeredByName(): string {
    return this.triggeredBy?.fullName || 'System';
  }

  get isStatusChangeEvent(): boolean {
    return this.eventType === ApplicationEventType.STATUS_CHANGED;
  }

  get isInterviewEvent(): boolean {
    return [
      ApplicationEventType.INTERVIEW_SCHEDULED,
      ApplicationEventType.INTERVIEW_COMPLETED,
    ].includes(this.eventType);
  }

  get isOfferEvent(): boolean {
    return [
      ApplicationEventType.OFFER_MADE,
      ApplicationEventType.OFFER_ACCEPTED,
      ApplicationEventType.OFFER_REJECTED,
    ].includes(this.eventType);
  }

  // Create status change event
  static createStatusChange(
    application: Application,
    oldStatus: string,
    newStatus: string,
    triggeredBy?: User,
  ): ApplicationEvent {
    const event = new ApplicationEvent();
    event.application = application;
    event.applicationId = application.id;
    event.eventType = ApplicationEventType.STATUS_CHANGED;
    event.oldStatus = oldStatus;
    event.newStatus = newStatus;
    event.triggeredBy = triggeredBy;
    event.triggeredById = triggeredBy?.id;
    event.description = `Application status changed from ${oldStatus} to ${newStatus}`;
    event.isVisibleToJobSeeker = true;
    return event;
  }

  // Create interview scheduled event
  static createInterviewScheduled(
    application: Application,
    interviewDate: Date,
    triggeredBy?: User,
  ): ApplicationEvent {
    const event = new ApplicationEvent();
    event.application = application;
    event.applicationId = application.id;
    event.eventType = ApplicationEventType.INTERVIEW_SCHEDULED;
    event.setEventData({ interviewDate: interviewDate.toISOString() });
    event.triggeredBy = triggeredBy;
    event.triggeredById = triggeredBy?.id;
    event.description = `Interview scheduled for ${interviewDate.toLocaleDateString()}`;
    event.isVisibleToJobSeeker = true;
    return event;
  }
}
