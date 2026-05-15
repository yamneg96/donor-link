import { Hospital, IHospital } from '../models/Hospital';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';

export class HospitalRepository {
  async findById(id: string): Promise<IHospital | null> {
    return Hospital.findOne({ _id: id, isDeleted: false }).populate('organizationId');
  }
  async findByOrgId(orgId: string): Promise<IHospital | null> {
    return Hospital.findOne({ organizationId: orgId, isDeleted: false });
  }
  async findAll(filters: Record<string, unknown>, pagination: PaginationParams) {
    const query = { isDeleted: false, ...filters };
    const [hospitals, total] = await Promise.all([
      Hospital.find(query).populate('organizationId', 'name code type region').sort(buildSortObject(pagination)).skip(getSkip(pagination)).limit(pagination.limit),
      Hospital.countDocuments(query),
    ]);
    return { hospitals, total };
  }
  async create(data: Partial<IHospital>): Promise<IHospital> { return Hospital.create(data); }
  async update(id: string, data: Partial<IHospital>): Promise<IHospital | null> {
    return Hospital.findByIdAndUpdate(id, data, { new: true }).populate('organizationId');
  }
  async softDelete(id: string): Promise<void> { await Hospital.findByIdAndUpdate(id, { isDeleted: true }); }
  async findNearby(coordinates: [number, number], maxDistanceKm: number = 50): Promise<IHospital[]> {
    return Hospital.find({
      isDeleted: false,
      location: { $near: { $geometry: { type: 'Point', coordinates }, $maxDistance: maxDistanceKm * 1000 } },
    }).populate('organizationId', 'name code type').limit(20);
  }
}
