import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Subscription } from './subscription.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  STRIPE = 'stripe',
}

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({ name: 'subscription_id' })
  subscriptionId: string;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: 'varchar',
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  paymentMethod?: PaymentMethod;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: true })
  paymentGateway?: string; // stripe, paypal, etc.

  @Column({ type: 'json', nullable: true })
  gatewayResponse?: Record<string, any>;

  @Column({ type: 'datetime', nullable: true })
  paidAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  refundedAt?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmount: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  get isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  get isRefunded(): boolean {
    return this.status === PaymentStatus.REFUNDED;
  }

  get canRefund(): boolean {
    return (
      this.isCompleted && this.refundAmount < this.amount && !this.refundedAt
    );
  }

  markAsCompleted(transactionId?: string): void {
    this.status = PaymentStatus.COMPLETED;
    this.paidAt = new Date();
    if (transactionId) {
      this.transactionId = transactionId;
    }
  }

  markAsFailed(): void {
    this.status = PaymentStatus.FAILED;
  }

  refund(amount?: number): void {
    const refundAmount = amount || this.amount;
    this.refundAmount = refundAmount;
    this.refundedAt = new Date();
    this.status = PaymentStatus.REFUNDED;
  }
}
