import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['pets'],
    }); // SELECT * FROM user JOIN pets
  }

  async getOneById(id: number): Promise<User> {
    try {
      const user = this.usersRepository.findOneOrFail(id); // SELECT * FROM user WHERE user_id=id;
      return user;
    } catch (err) {
      // handle a error
      throw err;
    }
  }

  createUser(name: string): Promise<User> {
    const newUser = this.usersRepository.create({ name }); // const newUser = new User(); newUser.name = name;

    return this.usersRepository.save(newUser); // INSERT (upsert기능)
  }

  async updateUser(id: number, name: string): Promise<User> {
    const user = await this.getOneById(id);

    user.name = name;

    return this.usersRepository.save(user); // UPDATE
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.getOneById(id);

    return this.usersRepository.remove(user);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
