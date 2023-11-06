insert into adm_role(id, name, caption, description)
values(nextval('seq_adm_role'), 'admin', 'Роль суперадмина', 'Роль суперадмина, используется для доступа ко всему');

insert into adm_group(id, name, caption, description)
values(nextval('seq_adm_group'), 'admin', 'Администраторы', 'Группа администраторов');

insert into adm_role_in_group(id, group_id, role_id)
values(nextval('seq_adm_role_in_group')
      ,(select id from adm_group where name = 'admin')
      ,(select id from adm_role where name = 'admin'));
      
insert into adm_user(id, name, caption)
values(nextval('seq_adm_user'), 'admin', 'Администратор');

insert into adm_group_in_user(id, user_id, group_id)
values(nextval('seq_adm_group_in_user')
      ,(select id from adm_user where name = 'admin')
      ,(select id from adm_group where name = 'admin'));