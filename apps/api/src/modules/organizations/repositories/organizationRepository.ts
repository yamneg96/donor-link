import { Organization, IOrganization } from '../models/Organization';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';

export class OrganizationRepository {
  async findById(id: string): Promise<IOrganization | null> {
    return Organization.findOne({ _id: id, isDeleted: false }).populate('parentOrganizationId', 'name code type');
  }

  async findByCode(code: string): Promise<IOrganization | null> {
    return Organization.findOne({ code, isDeleted: false });
  }

  async findAll(filters: Record<string, unknown>, pagination: PaginationParams): Promise<{ organizations: IOrganization[]; total: number }> {
    const query = { isDeleted: false, ...filters };
    const [organizations, total] = await Promise.all([
      Organization.find(query).populate('parentOrganizationId', 'name code type').sort(buildSortObject(pagination)).skip(getSkip(pagination)).limit(pagination.limit),
      Organization.countDocuments(query),
    ]);
    return { organizations, total };
  }

  async create(data: Partial<IOrganization>): Promise<IOrganization> {
    return Organization.create(data);
  }

  async update(id: string, data: Partial<IOrganization>): Promise<IOrganization | null> {
    return Organization.findByIdAndUpdate(id, data, { new: true });
  }

  async softDelete(id: string): Promise<void> {
    await Organization.findByIdAndUpdate(id, { isDeleted: true });
  }

  async findChildren(parentId: string): Promise<IOrganization[]> {
    return Organization.find({ parentOrganizationId: parentId, isDeleted: false });
  }

  async findByRegion(region: string): Promise<IOrganization[]> {
    return Organization.find({ region, isDeleted: false });
  }

  async findNearby(coordinates: [number, number], maxDistanceKm: number = 50): Promise<IOrganization[]> {
    return Organization.find({
      isDeleted: false,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates },
          $maxDistance: maxDistanceKm * 1000,
        },
      },
    }).limit(20);
  }

  async countByType(): Promise<Record<string, number>> {
    const result = await Organization.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);
    const counts: Record<string, number> = {};
    result.forEach((r: { _id: string; count: number }) => { counts[r._id] = r.count; });
    return counts;
  }
}
