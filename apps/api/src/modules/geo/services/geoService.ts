import { GeoRepository } from '../repositories/geoRepository';
import { NotFoundError } from '../../../core/errors';

export class GeoService {
  private repo = new GeoRepository();

  async registerLocation(data: Record<string, any>) {
    return this.repo.upsertByEntity(data.entityType, data.entityId, {
      name: data.name,
      location: {
        type: 'Point',
        coordinates: [data.longitude, data.latitude],
      },
      address: data.address,
      city: data.city,
      region: data.region,
      operatingHours: data.operatingHours,
      contactPhone: data.contactPhone,
      services: data.services || [],
      metadata: data.metadata || {},
      isActive: true,
    });
  }

  async findNearbyHospitals(longitude: number, latitude: number, maxDistanceKm: number = 50) {
    return this.repo.findNearby(longitude, latitude, maxDistanceKm * 1000, 'hospital');
  }

  async findNearbyBloodBanks(longitude: number, latitude: number, maxDistanceKm: number = 50) {
    return this.repo.findNearby(longitude, latitude, maxDistanceKm * 1000, 'blood_bank');
  }

  async findNearbyDonationCenters(longitude: number, latitude: number, maxDistanceKm: number = 50) {
    return this.repo.findNearby(longitude, latitude, maxDistanceKm * 1000, 'donation_center');
  }

  async findNearbyBloodDrives(longitude: number, latitude: number, maxDistanceKm: number = 50) {
    return this.repo.findNearby(longitude, latitude, maxDistanceKm * 1000, 'blood_drive');
  }

  async findNearbyAll(longitude: number, latitude: number, maxDistanceKm: number = 50) {
    return this.repo.findNearby(longitude, latitude, maxDistanceKm * 1000);
  }

  async findInEmergencyRadius(longitude: number, latitude: number, radiusKm: number) {
    return this.repo.findInRadius(longitude, latitude, radiusKm);
  }

  async getByRegion(region: string, entityType?: string) {
    return this.repo.findByRegion(region, entityType);
  }

  async getEntityLocation(entityType: string, entityId: string) {
    const entity = await this.repo.findByEntityId(entityType, entityId);
    if (!entity) throw new NotFoundError('Geo Location');
    return entity;
  }

  async updateLocation(entityType: string, entityId: string, data: Record<string, any>) {
    const entity = await this.repo.findByEntityId(entityType, entityId);
    if (!entity) throw new NotFoundError('Geo Location');

    const updateData: Record<string, any> = {};
    if (data.longitude !== undefined && data.latitude !== undefined) {
      updateData.location = { type: 'Point', coordinates: [data.longitude, data.latitude] };
    }
    if (data.address) updateData.address = data.address;
    if (data.city) updateData.city = data.city;
    if (data.region) updateData.region = data.region;
    if (data.operatingHours) updateData.operatingHours = data.operatingHours;
    if (data.contactPhone) updateData.contactPhone = data.contactPhone;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return this.repo.updateById(entity._id.toString(), updateData);
  }

  async getRegionStats() {
    return this.repo.countByRegionAndType();
  }
}
