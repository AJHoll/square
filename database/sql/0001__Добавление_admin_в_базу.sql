insert into adm_role(id, name, caption, description)
values(nextval('seq_adm_role'), 'admin', 'Роль суперадмина', 'Роль суперадмина, используется для доступа ко всему');

insert into adm_group(id, name, caption, description)
values(nextval('seq_adm_group'), 'admin', 'Администраторы', 'Группа администраторов');

insert into adm_group_role(id, group_id, role_id)
values(nextval('seq_adm_group_role')
      ,(select id from adm_group where name = 'admin')
      ,(select id from adm_role where name = 'admin'));
      
insert into adm_user(id, name, caption)
values(nextval('seq_adm_user'), 'admin', 'Администратор');

insert into adm_user_group(id, user_id, group_id)
values(nextval('seq_adm_user_group')
      ,(select id from adm_user where name = 'admin')
      ,(select id from adm_group where name = 'admin'));