insert into square.krn_menu_group(id, title, icon)
values(nextval('seq_krn_menu_group'), 'Нераспределенные', 'lni lni-rain');

insert into square.krn_menu_group(id, title, icon)
values(nextval('seq_krn_menu_group'), 'Конфигурация и администрирование', 'lni lni-cogs');


insert into square.krn_menu_item(id, group_id, title, url, icon)
values(nextval('seq_krn_menu_item')
      ,(select mg.id from krn_menu_group mg where mg.title = 'Конфигурация и администрирование')
      ,'Управление ролями'
      ,'roles'
      ,'lni lni-coral');
      
insert into square.krn_menu_item(id, group_id, title, url, icon)
values(nextval('seq_krn_menu_item')
      ,(select mg.id from krn_menu_group mg where mg.title = 'Конфигурация и администрирование')
      ,'Управление группами'
      ,'groups'
      ,'lni lni-consulting');
      
insert into square.krn_menu_item(id, group_id, title, url, icon)
values(nextval('seq_krn_menu_item')
      ,(select mg.id from krn_menu_group mg where mg.title = 'Конфигурация и администрирование')
      ,'Управление пользователями'
      ,'users'
      ,'lni lni-users');
      
do $$
declare
  curv_item record;
begin
  for curv_item in
  (
    select kmi.id
    from krn_menu_item kmi
    where not exists (select 1
                      from adm_role_menu_item armi
                      where armi.role_id = (select rle.id 
                                            from adm_role rle 
                                            where rle.name = 'admin')
                        and armi.menu_item_id = kmi.id)
  )
  loop
    insert into adm_role_menu_item(id, role_id, menu_item_id)
    values(nextval('seq_adm_role_menu_item')
          ,(select rle.id from adm_role rle where rle.name = 'admin')
          ,curv_item.id);
  end loop;
end;
$$;