import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase, logger } from '../config';
import { User } from '../modules/users/models/User';
import { Organization } from '../modules/organizations/models/Organization';
import { Hospital } from '../modules/hospitals/models/Hospital';
import { Donor } from '../modules/donors/models/Donor';
import { hashPassword, generateBarcode, generateQRCode, calculateExpiryDate } from '../core/utils';
import { Role, UserStatus, OrganizationType, OrganizationStatus, BloodType, ComponentType, BloodUnitStatus } from '../core/constants';
import { BloodUnit } from '../modules/inventory/models/BloodUnit';
import { InventoryLedger } from '../modules/inventory/models/InventoryLedger';

async function seed() {
  try {
    await connectDatabase();
    logger.info('🌱 Starting database seed...');

    // Clear existing data (dropping collections to remove stale indexes)
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      for (const collection of collections) {
        await mongoose.connection.db.dropCollection(collection.name);
        logger.info(`Dropped collection: ${collection.name}`);
      }
    }

    // --- Organizations ---
    const nationalOrg = await Organization.create({
      name: 'Ethiopian National Blood Bank Service', code: 'ENBB-NAT-001', type: OrganizationType.NATIONAL_BLOOD_BANK,
      region: 'Addis Ababa', status: OrganizationStatus.ACTIVE,
      address: { street: 'Bole Rd', city: 'Addis Ababa', state: 'Addis Ababa', country: 'Ethiopia' },
      contact: { phone: '+251111234567', email: 'admin@enbb.gov.et' },
      location: { type: 'Point', coordinates: [38.7578, 9.0054] },
    });

    const addisCenter = await Organization.create({
      name: 'Addis Ababa Regional Blood Center', code: 'REG-ADD-001', type: OrganizationType.REGIONAL_CENTER,
      region: 'Addis Ababa', status: OrganizationStatus.ACTIVE, parentOrganizationId: nationalOrg._id,
      location: { type: 'Point', coordinates: [38.7468, 9.0192] },
      contact: { phone: '+251111234568', email: 'addis@enbb.gov.et' },
    });

    const tikurAnbessa = await Organization.create({
      name: 'Tikur Anbessa Specialized Hospital', code: 'HOS-TAH-001', type: OrganizationType.HOSPITAL,
      region: 'Addis Ababa', status: OrganizationStatus.ACTIVE, parentOrganizationId: addisCenter._id,
      location: { type: 'Point', coordinates: [38.7631, 9.0356] },
      contact: { phone: '+251111234569', email: 'tash@hospital.gov.et' },
    });

    const stPauls = await Organization.create({
      name: 'St. Paul\'s Hospital Millennium Medical College', code: 'HOS-SPM-001', type: OrganizationType.HOSPITAL,
      region: 'Addis Ababa', status: OrganizationStatus.ACTIVE, parentOrganizationId: addisCenter._id,
      location: { type: 'Point', coordinates: [38.7494, 9.0478] },
      contact: { phone: '+251111234570', email: 'stpauls@hospital.gov.et' },
    });

    // --- Hospitals ---
    await Hospital.create([
      { organizationId: tikurAnbessa._id, name: 'Tikur Anbessa Specialized Hospital', beds: 700, departments: ['Emergency', 'Surgery', 'ICU', 'Pediatrics', 'Oncology'], bloodBankCapacity: 2000, hasBloodBank: true, location: { type: 'Point', coordinates: [38.7631, 9.0356] }, contactPerson: { name: 'Dr. Abebe Teshome', phone: '+251912345678' } },
      { organizationId: stPauls._id, name: 'St. Paul\'s Hospital', beds: 500, departments: ['Emergency', 'Surgery', 'ICU', 'Maternity'], bloodBankCapacity: 1000, hasBloodBank: true, location: { type: 'Point', coordinates: [38.7494, 9.0478] }, contactPerson: { name: 'Dr. Meron Hailemichael', phone: '+251912345679' } },
    ]);

    // --- Users ---
    const hashedPwd = await hashPassword('DonorLink2024!');

    const superAdmin = await User.create({
      firstName: 'System', lastName: 'Administrator', email: 'admin@donorlink.et',
      password: hashedPwd, role: Role.SUPER_ADMIN, status: UserStatus.ACTIVE, phone: '+251911000001',
    });

    const nationalAdmin = await User.create({
      firstName: 'Dawit', lastName: 'Gebre', email: 'dawit@enbb.gov.et',
      password: hashedPwd, role: Role.NATIONAL_ADMIN, status: UserStatus.ACTIVE, organizationId: nationalOrg._id, phone: '+251911000002',
    });

    const hospitalAdmin = await User.create({
      firstName: 'Sara', lastName: 'Alem', email: 'sara@tash.gov.et',
      password: hashedPwd, role: Role.HOSPITAL_ADMIN, status: UserStatus.ACTIVE, organizationId: tikurAnbessa._id, phone: '+251911000003',
    });

    const labStaff = await User.create({
      firstName: 'Kebede', lastName: 'Tadesse', email: 'kebede@tash.gov.et',
      password: hashedPwd, role: Role.LAB_STAFF, status: UserStatus.ACTIVE, organizationId: tikurAnbessa._id, phone: '+251911000004',
    });

    const donorUser = await User.create({
      firstName: 'Tigist', lastName: 'Bekele', email: 'tigist@gmail.com',
      password: hashedPwd, role: Role.DONOR, status: UserStatus.ACTIVE, phone: '+251911000005',
    });

    // --- Donors ---
    const donor1 = await Donor.create({
      userId: donorUser._id, bloodType: BloodType.O_POSITIVE, dateOfBirth: new Date('1990-03-15'),
      gender: 'female', weight: 65, height: 165, isEligible: true, totalDonations: 5,
      location: { type: 'Point', coordinates: [38.7548, 9.0120] },
    });

    // --- Blood Units (seed inventory) ---
    const bloodTypes = [BloodType.A_POSITIVE, BloodType.B_POSITIVE, BloodType.O_POSITIVE, BloodType.AB_POSITIVE, BloodType.A_NEGATIVE, BloodType.O_NEGATIVE];
    const units = [];

    for (const bt of bloodTypes) {
      const count = bt.includes('O') ? 8 : 4;
      for (let i = 0; i < count; i++) {
        const collectionDate = new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000);
        const org = i % 2 === 0 ? tikurAnbessa : stPauls;
        units.push({
          donationId: new mongoose.Types.ObjectId(), donorId: donor1._id,
          bloodType: bt, componentType: ComponentType.WHOLE_BLOOD,
          volume: 450, collectionDate, expiryDate: calculateExpiryDate(collectionDate, ComponentType.WHOLE_BLOOD),
          status: BloodUnitStatus.AVAILABLE, organizationId: org._id, currentHospitalId: org._id,
          barcode: generateBarcode(), qrCode: generateQRCode(),
          lifecycleHistory: [{ status: BloodUnitStatus.AVAILABLE, timestamp: collectionDate, performedBy: labStaff._id, notes: 'Seeded' }],
        });
      }
    }
    await BloodUnit.insertMany(units);

    logger.info(`✅ Seed complete:
      Organizations: 4
      Hospitals: 2
      Users: 5
      Donors: 1
      Blood Units: ${units.length}
    `);

    logger.info(`📋 Login credentials:
      Super Admin: admin@donorlink.et / DonorLink2024!
      National Admin: dawit@enbb.gov.et / DonorLink2024!
      Hospital Admin: sara@tash.gov.et / DonorLink2024!
    `);

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
