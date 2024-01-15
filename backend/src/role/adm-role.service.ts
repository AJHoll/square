import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { AdmRoleDto } from '../dtos/adm-role.dto';
import { AdmRoleMenuDto } from '../dtos/adm-role-menu.dto';

@Injectable()
export class AdmRoleService {

  constructor(private databaseService: DatabaseService) {
  }

  async getRoles(): Promise<AdmRoleDto[]> {
    const dbData = await this.databaseService.adm_role.findMany();
    return dbData.map<AdmRoleDto>(d => ({
      id: d.id.toNumber(),
      name: d.name,
      caption: d.caption,
      description: d.description,
    }));
  }

  async getRole(id: AdmRoleDto['id']): Promise<AdmRoleDto> {
    const dbData = await this.databaseService.adm_role.findFirst({ where: { id } });
    return {
      id: dbData.id.toNumber(),
      name: dbData.name,
      caption: dbData.caption,
      description: dbData.description,
    };
  }

  async createRole(admRole: AdmRoleDto): Promise<AdmRoleDto> {
    const dbResult = await this.databaseService.adm_role.create({
      data: {
        name: admRole.name,
        caption: admRole.caption,
        description: admRole.description,
      },
    });
    return {
      id: dbResult.id.toNumber(),
      name: dbResult.name,
      caption: dbResult.caption,
      description: dbResult.description,
    };
  }

  async editRole(id: AdmRoleDto['id'], admRole: AdmRoleDto): Promise<AdmRoleDto> {
    const dbResult = await this.databaseService.adm_role.update({
      data: {
        name: admRole.name,
        caption: admRole.caption,
        description: admRole.description,
      },
      where: { id, AND: { name: { not: { equals: 'admin' } } } },
    });
    return {
      id: dbResult.id.toNumber(),
      name: dbResult.name,
      caption: dbResult.caption,
      description: dbResult.description,
    };
  }

  async deleteRoles(ids: AdmRoleDto['id'][]): Promise<void> {
    await this.databaseService.adm_role.deleteMany({
      where: {
        id: { in: ids },
        AND: {
          name: { not: { equals: 'admin' } },
        },
      },
    })
  }

  async getRoleMenuItems(roleId: AdmRoleDto['id']): Promise<AdmRoleMenuDto[]> {
    const dbResult = await this.databaseService.adm_role_menu_item.findMany({
      where: {
        role_id: roleId,
      },
      include: {
        adm_role: true,
        krn_menu_item: {
          include: {
            krn_menu_group: true,
          },
        },
      },
    });
    return dbResult.map(res => ({
      id: res.id.toNumber(),
      role: {
        id: res.adm_role.id.toNumber(),
        name: res.adm_role.name,
        caption: res.adm_role.caption,
        description: res.adm_role.description,
      },
      menuItem: {
        id: res.krn_menu_item.id.toNumber(),
        group: {
          id: res.krn_menu_item.krn_menu_group.id.toNumber(),
          title: res.krn_menu_item.krn_menu_group.title,
          icon: res.krn_menu_item.krn_menu_group.icon,
        },
        title: res.krn_menu_item.title,
        icon: res.krn_menu_item.icon,
        url: res.krn_menu_item.url,
      },
    }));
  }
}
