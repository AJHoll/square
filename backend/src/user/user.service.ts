import {Injectable} from '@nestjs/common';
import {UserDto} from '../dtos/user.dto';
import {DatabaseService} from '../services/database.service';

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
        adm_user_group: {
          select: {
            adm_group: {
              select: {
                adm_group_role: {
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
    if (!user) {
      return null;
    }
    return {
      id: (user.id as unknown as number),
      username: user.name,
      caption: user.caption,
      password: user.hash,
      roles: user.adm_user_group
        .reduce((acc, crnt) => {
          acc = [...acc, ...crnt.adm_group.adm_group_role.map(r => r.adm_role.name)]
          return acc;
        }, []),
    };
  }
}
