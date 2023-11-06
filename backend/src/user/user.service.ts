import { Injectable } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { DatabaseService } from '../services/database.service';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {
  }

  async findOne(username: string): Promise<UserDto> {
    const user = await this.databaseService.adm_user.findFirst({
      where: {
        name: username,
      },
      include: {
        adm_group_in_user: {
          select: {
            adm_group: {
              select: {
                adm_role_in_group: {
                  select: {
                    adm_role: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return {
      id: (user.id as unknown as number),
      username: user.name,
      caption: user.caption,
      password: user.hash,
      roles: user.adm_group_in_user
        .reduce((acc, crnt) => {
          acc = [...acc, ...crnt.adm_group.adm_role_in_group.map(r => r.adm_role.name)]
          return acc;
        }, []),
    };
  }
}
