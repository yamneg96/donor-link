import { UserRepository } from '../repositories/userRepository';
import { NotFoundError, ConflictError } from '../../../core/errors';
import { hashPassword } from '../../../core/utils';
import { PaginationParams } from '../../../core/types';

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async getAllUsers(filters: Record<string, unknown>, pagination: PaginationParams) {
    return this.userRepo.findAll(filters, pagination);
  }

  async createUser(data: Record<string, unknown>) {
    const existing = await this.userRepo.findByEmail(data.email as string);
    if (existing) throw new ConflictError('User with this email already exists');

    if (data.password) {
      data.password = await hashPassword(data.password as string);
    }
    return this.userRepo.create(data);
  }

  async updateUser(id: string, data: Record<string, unknown>) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('User');

    if (data.password) {
      data.password = await hashPassword(data.password as string);
    }
    return this.userRepo.update(id, data);
  }

  async deleteUser(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('User');
    await this.userRepo.softDelete(id);
    return { message: 'User deleted successfully' };
  }

  async getUsersByOrganization(organizationId: string, pagination: PaginationParams) {
    return this.userRepo.findByOrganization(organizationId, pagination);
  }
}
