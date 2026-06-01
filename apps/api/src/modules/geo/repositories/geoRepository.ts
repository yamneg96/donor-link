import { GeoEntity, IGeoEntity } from '../models/GeoEntity';

export class GeoRepository {
  async create(data: Partial<IGeoEntity>): Promise<IGeoEntity> {
    return GeoEntity.create(data);
  }

  async upsertByEntity(entityType: string, entityId: string, data: Partial<IGeoEntity>): Promise<IGeoEntity> {
    return GeoEntity.findOneAndUpdate(
      { entityType, entityId },
      { ...data, entityType, entityId },
      { new: true, upsert: true }
    ) as Promise<IGeoEntity>;
  }

  async findNearby(
    longitude: number,
    latitude: number,
    maxDistanceMeters: number,
    entityType?: string,
  ) {
    const query: Record<string, any> = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: maxDistanceMeters,
        },
      },
      isActive: true,
      isDeleted: false,
    };
    if (entityType) query.entityType = entityType;

    return GeoEntity.find(query).limit(50);
  }

  async findInRadius(
    longitude: number,
    latitude: number,
    radiusKm: number,
    entityType?: string,
  ) {
    const radiusInRadians = radiusKm / 6378.1; // Earth's radius in km
    const query: Record<string, any> = {
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians],
        },
      },
      isActive: true,
      isDeleted: false,
    };
    if (entityType) query.entityType = entityType;

    return GeoEntity.find(query);
  }

  async findByRegion(region: string, entityType?: string) {
    const query: Record<string, any> = { region, isActive: true, isDeleted: false };
    if (entityType) query.entityType = entityType;
    return GeoEntity.find(query);
  }

  async findByEntityId(entityType: string, entityId: string): Promise<IGeoEntity | null> {
    return GeoEntity.findOne({ entityType, entityId, isDeleted: false });
  }

  async updateById(id: string, data: Partial<IGeoEntity>): Promise<IGeoEntity | null> {
    return GeoEntity.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteByEntity(entityType: string, entityId: string): Promise<void> {
    await GeoEntity.findOneAndUpdate({ entityType, entityId }, { isDeleted: true });
  }

  async countByRegionAndType() {
    return GeoEntity.aggregate([
      { $match: { isActive: true, isDeleted: false } },
      { $group: { _id: { region: '$region', entityType: '$entityType' }, count: { $sum: 1 } } },
      { $sort: { '_id.region': 1 } },
    ]);
  }
}
