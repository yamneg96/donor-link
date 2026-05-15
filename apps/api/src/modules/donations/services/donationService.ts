import { DonationRepository } from '../repositories/donationRepository';
import { NotFoundError } from '../../../core/errors';
import { PaginationParams } from '../../../core/types';
import { eventBus, EventType } from '../../../core/events';
import { generateBarcode, generateQRCode, calculateExpiryDate } from '../../../core/utils';
import { BloodUnitStatus, InventoryAction } from '../../../core/constants';

// Import inventory models directly to create blood units from donations
import { BloodUnit } from '../../inventory/models/BloodUnit';
import { InventoryLedger } from '../../inventory/models/InventoryLedger';
import { DonorRepository } from '../../donors/repositories/donorRepository';

export class DonationService {
  private donationRepo = new DonationRepository();
  private donorRepo = new DonorRepository();

  async getById(id: string) { const d = await this.donationRepo.findById(id); if (!d) throw new NotFoundError('Donation'); return d; }
  async getAll(filters: Record<string, unknown>, pagination: PaginationParams) { return this.donationRepo.findAll(filters, pagination); }

  async create(data: Record<string, unknown>) {
    const donation = await this.donationRepo.create(data);

    // Update donor's donation count
    await this.donorRepo.incrementDonationCount(data.donorId as string, donation.collectionDate);

    return donation;
  }

  async update(id: string, data: Record<string, unknown>) {
    const d = await this.donationRepo.findById(id);
    if (!d) throw new NotFoundError('Donation');
    return this.donationRepo.update(id, data);
  }

  /**
   * Process a donation: create BloodUnit(s) and InventoryLedger entries.
   * Called after donation is collected and tests pass.
   */
  async processDonation(donationId: string) {
    const donation = await this.donationRepo.findById(donationId);
    if (!donation) throw new NotFoundError('Donation');

    // Create a BloodUnit from the donation
    const expiryDate = calculateExpiryDate(donation.collectionDate, donation.componentType);

    const bloodUnit = await BloodUnit.create({
      donationId: donation._id,
      donorId: donation.donorId,
      bloodType: donation.bloodType,
      componentType: donation.componentType,
      volume: donation.volume,
      collectionDate: donation.collectionDate,
      expiryDate,
      status: BloodUnitStatus.AVAILABLE,
      organizationId: donation.organizationId,
      currentHospitalId: donation.organizationId,
      barcode: generateBarcode(),
      qrCode: generateQRCode(),
      lifecycleHistory: [
        { status: BloodUnitStatus.COLLECTED, timestamp: donation.collectionDate, performedBy: donation.staffId, notes: 'Initial collection' },
        { status: BloodUnitStatus.AVAILABLE, timestamp: new Date(), performedBy: donation.staffId, notes: 'Tests passed, available for use' },
      ],
    });

    // Create immutable ledger entry
    await InventoryLedger.create({
      bloodUnitId: bloodUnit._id,
      action: InventoryAction.COLLECTED,
      organizationId: donation.organizationId,
      performedBy: donation.staffId,
      metadata: { donationId: donation._id, bloodType: donation.bloodType, componentType: donation.componentType },
    });

    // Link blood unit to donation
    await this.donationRepo.addBloodUnitRef(donationId, bloodUnit._id.toString());

    // Emit event
    eventBus.emitEvent(EventType.BLOOD_UNIT_CREATED, {
      unitId: bloodUnit._id.toString(),
      bloodType: donation.bloodType,
      organizationId: donation.organizationId.toString(),
    }, donation.staffId.toString(), donation.organizationId.toString());

    return { donation, bloodUnit };
  }
}
