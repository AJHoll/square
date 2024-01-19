import { Injectable } from '@nestjs/common';
import { KrnMenuItemDto } from '../dtos/krn-menu-item.dto';
import { AdmRoleDto } from '../dtos/adm-role.dto';
import { DatabaseService } from '../services/database.service';

@Injectable()
export class KrnMenuService {
  constructor(private databaseService: DatabaseService) {
  }

  async getMenuItemsExcludeRole(roleId: AdmRoleDto['id']): Promise<KrnMenuItemDto[]> {
    const dbResult = await this.databaseService.krn_menu_item.findMany({
      where: { NOT: { adm_role_menu_item: { some: { role_id: roleId } } } },
      include: { krn_menu_group: true },
    })
    return dbResult.map(dbRes => ({
      id: dbRes.id.toNumber(),
      group: {
        id: dbRes.krn_menu_group.id.toNumber(),
        title: dbRes.krn_menu_group.title,
        icon: dbRes.krn_menu_group.icon,
      },
      url: dbRes.url,
      icon: dbRes.icon,
      title: dbRes.title,
    }));
  }
}
