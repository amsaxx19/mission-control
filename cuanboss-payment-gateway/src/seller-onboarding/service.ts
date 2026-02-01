import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Types
export interface SellerProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  bannerUrl?: string;
  socialLinks: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
    website?: string;
  };
  niche: string[];
  verificationStatus: 'unverified' | 'pending' | 'verified';
}

export interface BankAccount {
  id: string;
  sellerId: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  isPrimary: boolean;
  isVerified: boolean;
}

export interface PayoutSchedule {
  sellerId: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  minimumAmount: number;
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isRequired: boolean;
  order: number;
}

export interface OnboardingStatus {
  sellerId: string;
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
}

/**
 * Seller Onboarding Service
 * 
 * Handles the complete seller onboarding flow:
 * 1. Profile creation
 * 2. Identity verification
 * 3. Bank account setup
 * 4. Payout preferences
 * 5. First product creation
 */
export class SellerOnboardingService {
  
  /**
   * Initialize onboarding for a new seller
   */
  async initializeOnboarding(userId: string): Promise<OnboardingStatus> {
    // Check if already has seller profile
    const { data: existing } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      return this.getOnboardingStatus(existing.id);
    }

    // Create seller profile
    const { data: seller, error } = await supabase
      .from('sellers')
      .insert({
        user_id: userId,
        display_name: '',
        bio: '',
        verification_status: 'unverified',
        onboarding_status: 'in_progress',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Initialize onboarding steps
    const steps: OnboardingStep[] = [
      {
        id: 'profile',
        title: 'Lengkapi Profil',
        description: 'Tambahkan foto, bio, dan informasi dasar tentang kamu',
        isCompleted: false,
        isRequired: true,
        order: 1,
      },
      {
        id: 'verification',
        title: 'Verifikasi Identitas',
        description: 'Upload KTP untuk verifikasi (wajib untuk payout)',
        isCompleted: false,
        isRequired: true,
        order: 2,
      },
      {
        id: 'bank',
        title: 'Tambahkan Rekening Bank',
        description: 'Masukkan rekening bank untuk menerima pembayaran',
        isCompleted: false,
        isRequired: true,
        order: 3,
      },
      {
        id: 'payout',
        title: 'Atur Jadwal Payout',
        description: 'Pilih kapan dan berapa minimal payout kamu',
        isCompleted: false,
        isRequired: false,
        order: 4,
      },
      {
        id: 'product',
        title: 'Buat Produk Pertama',
        description: 'Upload produk digital pertamamu',
        isCompleted: false,
        isRequired: false,
        order: 5,
      },
    ];

    await supabase.from('onboarding_steps').insert(
      steps.map(step => ({
        seller_id: seller.id,
        step_id: step.id,
        title: step.title,
        description: step.description,
        is_completed: step.isCompleted,
        is_required: step.isRequired,
        order: step.order,
      }))
    );

    return {
      sellerId: seller.id,
      currentStep: 1,
      totalSteps: steps.length,
      steps,
      isCompleted: false,
      startedAt: new Date().toISOString(),
    };
  }

  /**
   * Get current onboarding status
   */
  async getOnboardingStatus(sellerId: string): Promise<OnboardingStatus> {
    const { data: steps, error } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('seller_id', sellerId)
      .order('order', { ascending: true });

    if (error) throw error;

    const completedSteps = steps?.filter(s => s.is_completed).length || 0;
    const currentStep = steps?.find(s => !s.is_completed)?.order || steps?.length || 0;
    const requiredSteps = steps?.filter(s => s.is_required) || [];
    const requiredCompleted = requiredSteps.every(s => s.is_completed);

    return {
      sellerId,
      currentStep,
      totalSteps: steps?.length || 0,
      steps: steps?.map(s => ({
        id: s.step_id,
        title: s.title,
        description: s.description,
        isCompleted: s.is_completed,
        isRequired: s.is_required,
        order: s.order,
      })) || [],
      isCompleted: requiredCompleted && completedSteps === steps?.length,
      startedAt: steps?.[0]?.created_at,
      completedAt: requiredCompleted && completedSteps === steps?.length 
        ? new Date().toISOString() 
        : undefined,
    };
  }

  /**
   * Complete a profile step
   */
  async completeProfileStep(
    sellerId: string,
    profile: Partial<SellerProfile>
  ): Promise<void> {
    const { error } = await supabase
      .from('sellers')
      .update({
        display_name: profile.displayName,
        bio: profile.bio,
        avatar_url: profile.avatarUrl,
        banner_url: profile.bannerUrl,
        social_links: profile.socialLinks,
        niche: profile.niche,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sellerId);

    if (error) throw error;

    await this.completeStep(sellerId, 'profile');
  }

  /**
   * Submit identity verification
   */
  async submitVerification(
    sellerId: string,
    data: {
      fullName: string;
      idNumber: string; // KTP/NIK
      idPhotoFront: string; // URL
      idPhotoBack: string; // URL
      selfiePhoto: string; // URL
    }
  ): Promise<void> {
    // Store verification documents
    const { error } = await supabase
      .from('seller_verifications')
      .insert({
        seller_id: sellerId,
        full_name: data.fullName,
        id_number: data.idNumber,
        id_photo_front: data.idPhotoFront,
        id_photo_back: data.idPhotoBack,
        selfie_photo: data.selfiePhoto,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      });

    if (error) throw error;

    // Update seller status
    await supabase
      .from('sellers')
      .update({
        verification_status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sellerId);

    await this.completeStep(sellerId, 'verification');
  }

  /**
   * Add bank account
   */
  async addBankAccount(
    sellerId: string,
    account: Omit<BankAccount, 'id' | 'sellerId' | 'isVerified'>
  ): Promise<BankAccount> {
    // Verify account with Xendit (optional, can be done async)
    // For now, just store it

    const { data, error } = await supabase
      .from('seller_bank_accounts')
      .insert({
        seller_id: sellerId,
        bank_code: account.bankCode,
        bank_name: account.bankName,
        account_number: account.accountNumber,
        account_holder_name: account.accountHolderName,
        is_primary: account.isPrimary,
        is_verified: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // If this is the first account, mark as primary
    if (account.isPrimary) {
      await supabase
        .from('seller_bank_accounts')
        .update({ is_primary: false })
        .eq('seller_id', sellerId)
        .neq('id', data.id);
    }

    await this.completeStep(sellerId, 'bank');

    return {
      id: data.id,
      sellerId: data.seller_id,
      bankCode: data.bank_code,
      bankName: data.bank_name,
      accountNumber: data.account_number,
      accountHolderName: data.account_holder_name,
      isPrimary: data.is_primary,
      isVerified: data.is_verified,
    };
  }

  /**
   * Set payout schedule
   */
  async setPayoutSchedule(
    sellerId: string,
    schedule: PayoutSchedule
  ): Promise<void> {
    const { error } = await supabase
      .from('seller_payout_schedules')
      .upsert({
        seller_id: sellerId,
        frequency: schedule.frequency,
        minimum_amount: schedule.minimumAmount,
        day_of_week: schedule.dayOfWeek,
        day_of_month: schedule.dayOfMonth,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    await this.completeStep(sellerId, 'payout');
  }

  /**
   * Mark product step as complete
   */
  async completeProductStep(sellerId: string): Promise<void> {
    await this.completeStep(sellerId, 'product');
  }

  /**
   * Complete an onboarding step
   */
  private async completeStep(sellerId: string, stepId: string): Promise<void> {
    await supabase
      .from('onboarding_steps')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('seller_id', sellerId)
      .eq('step_id', stepId);

    // Check if all required steps are complete
    const { data: steps } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('seller_id', sellerId);

    const requiredCompleted = steps
      ?.filter(s => s.is_required)
      .every(s => s.is_completed);

    if (requiredCompleted) {
      await supabase
        .from('sellers')
        .update({
          onboarding_status: 'completed',
          can_sell: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sellerId);
    }
  }

  /**
   * Get available banks for Indonesia
   */
  getAvailableBanks(): Array<{ code: string; name: string }> {
    return [
      { code: 'BCA', name: 'Bank Central Asia (BCA)' },
      { code: 'BNI', name: 'Bank Negara Indonesia (BNI)' },
      { code: 'BRI', name: 'Bank Rakyat Indonesia (BRI)' },
      { code: 'MANDIRI', name: 'Bank Mandiri' },
      { code: 'CIMB', name: 'CIMB Niaga' },
      { code: 'BSI', name: 'Bank Syariah Indonesia' },
      { code: 'PERMATA', name: 'Bank Permata' },
      { code: 'DANAMON', name: 'Bank Danamon' },
      { code: 'BUKOPIN', name: 'Bank Bukopin' },
      { code: 'JAGO', name: 'Bank Jago' },
      { code: 'SEABANK', name: 'SeaBank' },
      { code: 'BLU', name: 'Blu by BCA Digital' },
      { code: 'JENIUS', name: 'Jenius (BTPN)' },
      { code: 'NEO', name: 'Bank Neo Commerce' },
      { code: 'MEGA', name: 'Bank Mega' },
    ];
  }

  /**
   * Get onboarding progress for dashboard
   */
  async getOnboardingProgress(sellerId: string): Promise<{
    percentage: number;
    nextStep: OnboardingStep | null;
    canStartSelling: boolean;
  }> {
    const status = await this.getOnboardingStatus(sellerId);
    
    const completedSteps = status.steps.filter(s => s.isCompleted).length;
    const percentage = Math.round((completedSteps / status.steps.length) * 100);
    
    const nextStep = status.steps.find(s => !s.isCompleted) || null;
    
    const requiredSteps = status.steps.filter(s => s.isRequired);
    const canStartSelling = requiredSteps.every(s => s.isCompleted);

    return {
      percentage,
      nextStep,
      canStartSelling,
    };
  }
}

export default SellerOnboardingService;
