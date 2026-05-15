import { User, IUser } from '../models/User';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';

export class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return User.findOne({ _id: id, isDeleted: false }).populate('organizationId', 'name code type');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email, isDeleted: false });
  }

  async findAll(filters: Record<string, unknown>, pagination: PaginationParams): Promise<{ users: IUser[]; total: number }> {
    const query = { isDeleted: false, ...filters };
    const [users, total] = await Promise.all([
      User.find(query)
        .populate('organizationId', 'name code type')
        .sort(buildSortObject(pagination))
        .skip(getSkip(pagination))
        .limit(pagination.limit),
      User.countDocuments(query),
    ]);
    return { users, total };
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    return User.create(data);
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true }).populate('organizationId', 'name code type');
  }

  async softDelete(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, { isDeleted: true });
  }

  async findByOrganization(organizationId: string, pagination: PaginationParams): Promise<{ users: IUser[]; total: number }> {
    return this.findAll({ organizationId }, pagination);
  }

  async countByRole(role: string): Promise<number> {
    return User.countDocuments({ role, isDeleted: false });
  }
}
