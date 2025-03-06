CREATE SCHEMA IF NOT EXISTS square;

CREATE DOMAIN public.t_boolean AS boolean;
CREATE DOMAIN public.t_caption AS character varying(254);
CREATE DOMAIN public.t_clob AS text;
CREATE DOMAIN public.t_code AS character varying(254);
CREATE DOMAIN public.t_codearray AS character varying(254)[];
CREATE DOMAIN public.t_date AS date;
CREATE DOMAIN public.t_datearray AS date[];
CREATE DOMAIN public.t_datetime AS timestamp without time zone;
CREATE DOMAIN public.t_description AS character varying(4000);
CREATE DOMAIN public.t_float AS numeric;
CREATE DOMAIN public.t_html AS text;
CREATE DOMAIN public.t_id AS numeric(15,0);
CREATE DOMAIN public.t_integer AS bigint;
CREATE DOMAIN public.t_json AS jsonb;
CREATE DOMAIN public.t_longstring AS character varying(4000);
CREATE DOMAIN public.t_money AS numeric(15,4);
CREATE DOMAIN public.t_name AS character varying(30);
CREATE DOMAIN public.t_shortstring AS character varying(254);
CREATE DOMAIN public.t_xml AS xml;

CREATE SEQUENCE seq_adm_group
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE adm_group (
    id public.t_id DEFAULT nextval('seq_adm_group'::regclass) NOT NULL,
    name public.t_name DEFAULT ''::character varying NOT NULL,
    caption public.t_caption,
    description public.t_description
);
COMMENT ON TABLE adm_group IS 'Группы доступа';
COMMENT ON COLUMN adm_group.id IS 'ID';
COMMENT ON COLUMN adm_group.name IS 'Системное имя группы';
COMMENT ON COLUMN adm_group.caption IS 'Наименование группы';
COMMENT ON COLUMN adm_group.description IS 'Описание';


CREATE SEQUENCE seq_adm_group_role
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE adm_group_role (
    id public.t_id DEFAULT nextval('seq_adm_group_role'::regclass) NOT NULL,
    group_id public.t_id NOT NULL,
    role_id public.t_id NOT NULL
);
COMMENT ON TABLE adm_group_role IS 'Роли в группах';
COMMENT ON COLUMN adm_group_role.id IS 'ID';
COMMENT ON COLUMN adm_group_role.group_id IS 'ID Группы';
COMMENT ON COLUMN adm_group_role.role_id IS 'ID Роли';


CREATE SEQUENCE seq_adm_role
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE adm_role (
    id public.t_id DEFAULT nextval('seq_adm_role'::regclass) NOT NULL,
    name public.t_name DEFAULT ''::character varying NOT NULL,
    caption public.t_caption,
    description public.t_description
);
COMMENT ON TABLE adm_role IS 'Роли доступа';
COMMENT ON COLUMN adm_role.id IS 'ID';
COMMENT ON COLUMN adm_role.name IS 'Системное имя роли';
COMMENT ON COLUMN adm_role.caption IS 'Наименование роли';
COMMENT ON COLUMN adm_role.description IS 'Описание';


CREATE SEQUENCE seq_adm_role_menu_item
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE adm_role_menu_item (
    id public.t_id DEFAULT nextval('seq_adm_role_menu_item'::regclass) NOT NULL,
    role_id public.t_id NOT NULL,
    menu_item_id public.t_id NOT NULL
);
COMMENT ON TABLE adm_role_menu_item IS 'Доступ роли к пунктам меню';
COMMENT ON COLUMN adm_role_menu_item.id IS 'ID';
COMMENT ON COLUMN adm_role_menu_item.role_id IS 'ID Роли';
COMMENT ON COLUMN adm_role_menu_item.menu_item_id IS 'ID Пункта меню';


CREATE SEQUENCE seq_adm_user
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE adm_user (
    id public.t_id DEFAULT nextval('seq_adm_user'::regclass) NOT NULL,
    name public.t_name DEFAULT ''::character varying NOT NULL,
    caption public.t_caption,
    hash public.t_shortstring,
    person_id public.t_id
);
COMMENT ON TABLE adm_user IS 'Пользователи площадки';
COMMENT ON COLUMN adm_user.id IS 'ID';
COMMENT ON COLUMN adm_user.name IS 'Системное имя пользователя (email)';
COMMENT ON COLUMN adm_user.caption IS 'Наименование (ФИО/Название организации)';
COMMENT ON COLUMN adm_user.hash IS 'Хэщ пароля';
COMMENT ON COLUMN adm_user.person_id IS 'ID Физ. лица';


CREATE SEQUENCE seq_adm_user_group
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE adm_user_group (
    id public.t_id DEFAULT nextval('seq_adm_user_group'::regclass) NOT NULL,
    user_id public.t_id NOT NULL,
    group_id public.t_id NOT NULL
);
COMMENT ON TABLE adm_user_group IS 'Группы пользователя';
COMMENT ON COLUMN adm_user_group.id IS 'ID';
COMMENT ON COLUMN adm_user_group.user_id IS 'ID Пользователя';
COMMENT ON COLUMN adm_user_group.group_id IS 'ID Группы';


CREATE SEQUENCE seq_krn_menu_group
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE krn_menu_group (
    id public.t_id DEFAULT nextval('seq_krn_menu_group'::regclass) NOT NULL,
    title public.t_shortstring,
    icon public.t_shortstring
);
COMMENT ON TABLE krn_menu_group IS 'Группы пунктов меню';
COMMENT ON COLUMN krn_menu_group.id IS 'ID';
COMMENT ON COLUMN krn_menu_group.title IS 'Наименование группы';
COMMENT ON COLUMN krn_menu_group.icon IS 'Иконка';


CREATE SEQUENCE seq_krn_menu_item
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE seq_krn_menu_item OWNER TO square;

CREATE TABLE krn_menu_item (
    id public.t_id DEFAULT nextval('seq_krn_menu_item'::regclass) NOT NULL,
    group_id public.t_id NOT NULL,
    title public.t_shortstring,
    url public.t_shortstring,
    icon public.t_shortstring
);
COMMENT ON TABLE krn_menu_item IS 'Пункты меню';
COMMENT ON COLUMN krn_menu_item.id IS 'ID';
COMMENT ON COLUMN krn_menu_item.group_id IS 'ID Группы (по-умолчанию в общией)';
COMMENT ON COLUMN krn_menu_item.title IS 'Наименование пункта меню';
COMMENT ON COLUMN krn_menu_item.url IS 'URL для перехода';
COMMENT ON COLUMN krn_menu_item.icon IS 'Иконка пункта меню';


CREATE SEQUENCE seq_sqr_criteria
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_question
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_question_answer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_role
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_square
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_square_eval_group_user
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_square_eval_team
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_square_module
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_square_role
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_square_team
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_square_timer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE SEQUENCE seq_sqr_square_timer_detail
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE sqr_criteria (
    id public.t_id DEFAULT nextval('seq_sqr_criteria'::regclass) NOT NULL,
    square_id public.t_id NOT NULL,
    criterias json NOT NULL
);
COMMENT ON TABLE sqr_criteria IS 'Критерии оценки на площадке';
COMMENT ON COLUMN sqr_criteria.id IS 'ID';
COMMENT ON COLUMN sqr_criteria.square_id IS 'ID Площадки';
COMMENT ON COLUMN sqr_criteria.criterias IS 'Сериализованное значение критериев';


CREATE TABLE sqr_question (
    id public.t_id DEFAULT nextval('seq_sqr_question'::regclass) NOT NULL,
    square_id public.t_id NOT NULL,
    team_id public.t_id NOT NULL,
    user_id public.t_id NOT NULL,
    question public.t_clob DEFAULT ''::text NOT NULL,
    question_time public.t_datetime DEFAULT (now())::public.t_datetime NOT NULL
);
COMMENT ON TABLE sqr_question IS 'Вопросы';
COMMENT ON COLUMN sqr_question.id IS 'ID';
COMMENT ON COLUMN sqr_question.square_id IS 'ID Площадки';
COMMENT ON COLUMN sqr_question.team_id IS 'ID Команды';
COMMENT ON COLUMN sqr_question.user_id IS 'ID Участника команды';
COMMENT ON COLUMN sqr_question.question IS 'Текст вопроса';
COMMENT ON COLUMN sqr_question.question_time IS 'Дата/Время вопроса';


CREATE TABLE sqr_question_answer (
    id public.t_id DEFAULT nextval('seq_sqr_question_answer'::regclass) NOT NULL,
    question_id public.t_id NOT NULL,
    user_id public.t_id NOT NULL,
    role_id public.t_id NOT NULL,
    answer public.t_clob NOT NULL,
    answer_time public.t_datetime DEFAULT (now())::public.t_datetime NOT NULL
);
COMMENT ON TABLE sqr_question_answer IS 'Ответы на вопросы';
COMMENT ON COLUMN sqr_question_answer.id IS 'ID';
COMMENT ON COLUMN sqr_question_answer.question_id IS 'ID Вопроса';
COMMENT ON COLUMN sqr_question_answer.user_id IS 'ID Пользователя отвечающего';
COMMENT ON COLUMN sqr_question_answer.role_id IS 'ID Роли отвечающего';
COMMENT ON COLUMN sqr_question_answer.answer IS 'Текст ответа';
COMMENT ON COLUMN sqr_question_answer.answer_time IS 'Дата/Время ответа';


CREATE TABLE sqr_role (
    id public.t_id DEFAULT nextval('seq_sqr_role'::regclass) NOT NULL,
    name public.t_name DEFAULT ''::character varying NOT NULL,
    caption public.t_caption,
    description public.t_description,
    group_id public.t_id
);
COMMENT ON TABLE sqr_role IS 'Роли на площадке';
COMMENT ON COLUMN sqr_role.id IS 'ID';
COMMENT ON COLUMN sqr_role.name IS 'Системное имя';
COMMENT ON COLUMN sqr_role.caption IS 'Наименование';
COMMENT ON COLUMN sqr_role.description IS 'Описание';
COMMENT ON COLUMN sqr_role.group_id IS 'ID Связанной группы доступа';


CREATE TABLE sqr_square (
    id public.t_id DEFAULT nextval('seq_sqr_square'::regclass) NOT NULL,
    name public.t_name DEFAULT ''::character varying NOT NULL,
    caption public.t_caption,
    description public.t_description,
    active_modules public.t_shortstring
);
COMMENT ON TABLE sqr_square IS 'Площадки';
COMMENT ON COLUMN sqr_square.id IS 'ID';
COMMENT ON COLUMN sqr_square.name IS 'Системное имя';
COMMENT ON COLUMN sqr_square.caption IS 'Наименование';
COMMENT ON COLUMN sqr_square.description IS 'Описание';
COMMENT ON COLUMN sqr_square.active_modules IS 'Активные для проверки модули';


CREATE TABLE sqr_square_eval_group (
    id public.t_id DEFAULT nextval('seq_sqr_square_eval_team'::regclass) NOT NULL,
    square_id public.t_id NOT NULL,
    caption public.t_caption NOT NULL,
    code public.t_code NOT NULL,
    modules public.t_shortstring
);
COMMENT ON TABLE sqr_square_eval_group IS 'Группы проверки';
COMMENT ON COLUMN sqr_square_eval_group.id IS 'ID';
COMMENT ON COLUMN sqr_square_eval_group.square_id IS 'ID Площадки';
COMMENT ON COLUMN sqr_square_eval_group.caption IS 'Наименование';
COMMENT ON COLUMN sqr_square_eval_group.code IS 'Код команды проверки';
COMMENT ON COLUMN sqr_square_eval_group.modules IS 'Проверяемые модули задания (Список через запятую, например 1,2,3)';


CREATE TABLE sqr_square_eval_group_user (
    id public.t_id DEFAULT nextval('seq_sqr_square_eval_group_user'::regclass) NOT NULL,
    eval_group_id public.t_id NOT NULL,
    user_id public.t_id NOT NULL,
    short_name public.t_shortstring NOT NULL,
    color public.t_shortstring,
    manage_all_rates public.t_boolean DEFAULT true NOT NULL
);
COMMENT ON TABLE sqr_square_eval_group_user IS 'Пользователи в группе проверки';
COMMENT ON COLUMN sqr_square_eval_group_user.id IS 'ID';
COMMENT ON COLUMN sqr_square_eval_group_user.eval_group_id IS 'ID Группы проверки';
COMMENT ON COLUMN sqr_square_eval_group_user.user_id IS 'ID Пользователя на площадке';
COMMENT ON COLUMN sqr_square_eval_group_user.short_name IS 'Короткое имя';
COMMENT ON COLUMN sqr_square_eval_group_user.color IS 'Цвет в интерфейсе оценки';
COMMENT ON COLUMN sqr_square_eval_group_user.manage_all_rates IS 'Возможность редактировать все оценки ( секретарь группы проверки )';


CREATE TABLE sqr_square_team (
    id public.t_id DEFAULT nextval('seq_sqr_square_team'::regclass) NOT NULL,
    square_id public.t_id NOT NULL,
    name public.t_name DEFAULT ''::character varying NOT NULL,
    caption public.t_caption,
    description public.t_description,
    rates json
);
COMMENT ON TABLE sqr_square_team IS 'Команды на площадке';
COMMENT ON COLUMN sqr_square_team.id IS 'ID';
COMMENT ON COLUMN sqr_square_team.square_id IS 'ID Площадки';
COMMENT ON COLUMN sqr_square_team.name IS 'Системное имя';
COMMENT ON COLUMN sqr_square_team.caption IS 'Наименование';
COMMENT ON COLUMN sqr_square_team.description IS 'Описание';
COMMENT ON COLUMN sqr_square_team.rates IS 'Оценки команды';


CREATE TABLE sqr_square_timer (
    id public.t_id DEFAULT nextval('seq_sqr_square_timer'::regclass) NOT NULL,
    square_id public.t_id NOT NULL,
    team_id public.t_id,
    caption public.t_caption,
    count public.t_integer DEFAULT 0,
    begin_time public.t_datetime,
    pause_time public.t_datetime,
    continue_time public.t_datetime,
    stop_time public.t_datetime,
    state public.t_shortstring DEFAULT 'READY'::character varying
);
COMMENT ON TABLE sqr_square_timer IS 'Таймеры площалки';
COMMENT ON COLUMN sqr_square_timer.id IS 'ID';
COMMENT ON COLUMN sqr_square_timer.square_id IS 'ID Площадки';
COMMENT ON COLUMN sqr_square_timer.team_id IS 'ID Команды';
COMMENT ON COLUMN sqr_square_timer.caption IS 'Наименование таймера';
COMMENT ON COLUMN sqr_square_timer.count IS 'Количество секунд';
COMMENT ON COLUMN sqr_square_timer.begin_time IS 'Дата/Время запуска таймера';
COMMENT ON COLUMN sqr_square_timer.pause_time IS 'Дата/Время последней приостановки таймера';
COMMENT ON COLUMN sqr_square_timer.continue_time IS 'Дата/Время последнего возобновления таймера';
COMMENT ON COLUMN sqr_square_timer.stop_time IS 'Дата/Время останова таймера';
COMMENT ON COLUMN sqr_square_timer.state IS 'Состояние таймера (по-умолчанию READY)';


CREATE TABLE sqr_square_timer_detail (
    id public.t_id DEFAULT nextval('seq_sqr_square_timer_detail'::regclass) NOT NULL,
    timer_id public.t_id NOT NULL,
    state public.t_shortstring,
    "time" public.t_datetime,
    count public.t_integer,
    description public.t_clob
);
COMMENT ON TABLE sqr_square_timer_detail IS 'Расширенная информация по таймерам команд';
COMMENT ON COLUMN sqr_square_timer_detail.id IS 'ID';
COMMENT ON COLUMN sqr_square_timer_detail.timer_id IS 'ID Таймера';
COMMENT ON COLUMN sqr_square_timer_detail.state IS 'Состояние';
COMMENT ON COLUMN sqr_square_timer_detail."time" IS 'Дата/Время перевода в состояние';
COMMENT ON COLUMN sqr_square_timer_detail.count IS 'Количество секунд в состоянии';
COMMENT ON COLUMN sqr_square_timer_detail.description IS 'Дополнительная информация';


CREATE TABLE sqr_square_user (
    id public.t_id DEFAULT nextval('seq_sqr_square_role'::regclass) NOT NULL,
    square_id public.t_id NOT NULL,
    user_id public.t_id NOT NULL,
    role_id public.t_id NOT NULL,
    team_id public.t_id
);
COMMENT ON TABLE sqr_square_user IS 'Роли на площадке';
COMMENT ON COLUMN sqr_square_user.id IS 'ID';
COMMENT ON COLUMN sqr_square_user.square_id IS 'ID Площадки';
COMMENT ON COLUMN sqr_square_user.user_id IS 'ID Пользователя';
COMMENT ON COLUMN sqr_square_user.role_id IS 'ID Роли на площадке';
COMMENT ON COLUMN sqr_square_user.team_id IS 'ID Команды';


insert into krn_menu_group (id, title, icon) values(1, 'Нераспределенные', 'lni lni-rain');
insert into krn_menu_group (id, title, icon) values(2, 'Конфигурация и администрирование', 'lni lni-cogs');
insert into krn_menu_group (id, title, icon) values(3, 'Конфигурация площадок', 'lni lni-frame-expand');
insert into krn_menu_group (id, title, icon) values(4, 'Участникам и экспертам', 'lni lni-users');


insert into krn_menu_item (id, group_id, title, url, icon) values(1, 2, 'Управление ролями', 'roles', 'lni lni-coral');
insert into krn_menu_item (id, group_id, title, url, icon) values(2, 2, 'Управление группами', 'groups', 'lni lni-consulting');
insert into krn_menu_item (id, group_id, title, url, icon) values(3, 2, 'Управление пользователями', 'users', 'lni lni-users');
insert into krn_menu_item (id, group_id, title, url, icon) values(4, 3, 'Управление площадками', 'squares', 'lni lni-frame-expand');
insert into krn_menu_item (id, group_id, title, url, icon) values(5, 3, 'Управление ролями площадок', 'square-roles', 'lni lni-suspect');
insert into krn_menu_item (id, group_id, title, url, icon) values(6, 4, 'Просмотр таймеров', 'timers', 'lni lni-timer');
insert into krn_menu_item (id, group_id, title, url, icon) values(7, 4, 'Управление критериями', 'manage-criteria', 'lni lni-layers');
insert into krn_menu_item (id, group_id, title, url, icon) values(8, 4, 'Заведение оценок', 'manage-rate', 'lni lni-graph');
insert into krn_menu_item (id, group_id, title, url, icon) values(9, 4, 'Справка по системе', 'help', 'lni lni-help');
insert into krn_menu_item (id, group_id, title, url, icon) values(10, 4, 'Вопросы и ответы', 'question-answer', 'lni lni-wechat');


insert into adm_role (id, name, caption, description) values(1, 'admin', 'Роль суперадмина', 'Роль суперадмина, используется для доступа ко всему');
insert into adm_role (id, name, caption, description) values(8, 'squareManage', 'Управление площадками', 'Дает доступ до пункта меню "Управление площадками"');
insert into adm_role (id, name, caption, description) values(9, 'timerViewer', 'Просмотр  таймеров', 'Дает доступ до пункта меню "Просмотр  таймеров"');
insert into adm_role (id, name, caption, description) values(10, 'criteriaManager', 'Управление критериями', 'Дает доступ к пункту меню "Управление критериями"');
insert into adm_role (id, name, caption, description) values(11, 'rateManager', 'Заведение оценок', 'Дает доступ к пункту меню "Заведение оценок"');
insert into adm_role (id, name, caption, description) values(12, 'allRateViewer', 'Просмотр всех оценок', 'Просмотр всех оценок без нахождения в группах проверки');
insert into adm_role (id, name, caption, description) values(13, 'rateExporter', 'Экспорт оценок', 'Доступ к экспорту заведённых оценок');
insert into adm_role (id, name, caption, description) values(14, 'userManager', 'Управление пользователями', 'Доступ к пункту меню "Управление пользователями"');
insert into adm_role (id, name, caption, description) values(15, 'timerManage', 'Управление таймерами', 'Доступ к управлению таймерами на площадке');


insert into adm_role_menu_item (id, role_id, menu_item_id) values(1,1,1);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(11,1,2);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(12,1,3);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(18,1,4);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(19,1,5);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(20,8,4);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(21,1,6);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(22,9,6);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(23,10,7);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(24,1,7);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(25,1,8);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(26,11,8);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(27,14,3);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(28,1,9);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(29,15,4);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(30,15,9);
insert into adm_role_menu_item (id, role_id, menu_item_id) values(32,1,10);


insert into adm_group (id, name, caption, description) values(1, 'admin', 'Администраторы', 'Группа администраторов');
insert into adm_group (id, name, caption, description) values(5, 'chiefExpert', 'Главный эксперт', 'Главный эксперт компетенции');
insert into adm_group (id, name, caption, description) values(6, 'deputyChiefExpert', 'Заместитель главного эксперта', 'Заместитель главного эксперта компетенции');
insert into adm_group (id, name, caption, description) values(7, 'technicalExpert', 'Технический эксперт', 'Технический эксперт компетенции');
insert into adm_group (id, name, caption, description) values(8, 'teamExpert', 'Эксперт-компатриот', 'Эксперт-компатриот участника или команды');
insert into adm_group (id, name, caption, description) values(9, 'evaluationExpert', 'Эксперт по оценке', 'Эксперт по оценке конкурсного задания');
insert into adm_group (id, name, caption, description) values(10, 'participant', 'Участник', 'Участник мероприятия');
insert into adm_group (id, name, caption, description) values(14, 'viewer', 'Обозреватель', 'Системная роль площадки для доступа к публичным данным площадки');
insert into adm_group (id, name, caption, description) values(15, 'timerExpert', 'Эксперт по управлению временем', 'Эксперт отвечающий за тайминги на площадке');


insert into adm_group_role (id, group_id, role_id) values (1,1,1);
insert into adm_group_role (id, group_id, role_id) values (8,5,8);
insert into adm_group_role (id, group_id, role_id) values (9, 5, 9);
insert into adm_group_role (id, group_id, role_id) values (10, 6, 9);
insert into adm_group_role (id, group_id, role_id) values (11, 6, 8);
insert into adm_group_role (id, group_id, role_id) values (12, 7, 9);
insert into adm_group_role (id, group_id, role_id) values (13, 8, 9);
insert into adm_group_role (id, group_id, role_id) values (14, 9, 9);
insert into adm_group_role (id, group_id, role_id) values (15, 10, 9);
insert into adm_group_role (id, group_id, role_id) values (16, 9, 10);
insert into adm_group_role (id, group_id, role_id) values (17, 9, 11);
insert into adm_group_role (id, group_id, role_id) values (18, 5, 12);
insert into adm_group_role (id, group_id, role_id) values (19, 5, 10);
insert into adm_group_role (id, group_id, role_id) values (20, 5, 11);
insert into adm_group_role (id, group_id, role_id) values (21, 6, 10);
insert into adm_group_role (id, group_id, role_id) values (22, 6, 11);
insert into adm_group_role (id, group_id, role_id) values (23, 6, 12);
insert into adm_group_role (id, group_id, role_id) values (24, 8, 11);
insert into adm_group_role (id, group_id, role_id) values (25, 5, 13);
insert into adm_group_role (id, group_id, role_id) values (26, 6, 13);
insert into adm_group_role (id, group_id, role_id) values (27, 5, 14);
insert into adm_group_role (id, group_id, role_id) values (28, 6, 14);
insert into adm_group_role (id, group_id, role_id) values (29, 7, 14);
insert into adm_group_role (id, group_id, role_id) values (31, 14, 9);
insert into adm_group_role (id, group_id, role_id) values (32, 15, 15);
insert into adm_group_role (id, group_id, role_id) values (33, 15, 9);


INSERT INTO adm_user(id, name, caption, hash, person_id) VALUES(1, 'admin', 'Администратор', '$2b$10$rOIDlWPrDw.Om505F5DKZ.7YJGsb5yQbpRvApJpSJkVOG1v2LkVbO', NULL);
INSERT INTO adm_user(id, name, caption, hash, person_id) VALUES(93, 'viewer', 'Обозреватель', '$2b$10$.jCyOtZZRtmFApwOIZ5V4.bGLNO2brtUimPQ/NsU5I1C7pigFgw96', NULL);

insert into adm_user_group (id, user_id, group_id) values(1,1,1);
insert into adm_user_group (id, user_id, group_id) values(87,93,14);


INSERT INTO sqr_role(id, name, caption, description, group_id) VALUES(1, 'chiefExpert', 'Главный эксперт', 'Главный эксперт компетенции', 5);
INSERT INTO sqr_role(id, name, caption, description, group_id) VALUES(3, 'deputyChiefExpert', 'Заместитель главного эксперта', 'Заместитель главного эксперта компетенции', 6);
INSERT INTO sqr_role(id, name, caption, description, group_id) VALUES(4, 'technicalExpert', 'Технический эксперт', 'Технический эксперт компетенции', 7);
INSERT INTO sqr_role(id, name, caption, description, group_id) VALUES(5, 'teamExpert', 'Эксперт-компатриот', 'Эксперт-компатриот участника или команды', 8);
INSERT INTO sqr_role(id, name, caption, description, group_id) VALUES(6, 'evaluationExpert', 'Эксперт по оценке', 'Эксперт по оценке конкурсного задания', 9);
INSERT INTO sqr_role(id, name, caption, description, group_id) VALUES(7, 'participant', 'Участник', 'Участник мероприятия', 10);
INSERT INTO sqr_role(id, name, caption, description, group_id) VALUES(9, 'viewer', 'Обозреватель', 'Системная роль площадки для доступа к публичным данным площадки', 14);
INSERT INTO sqr_role(id, name, caption, description, group_id) VALUES(10, 'timerExpert', 'Эксперт по управлению временем', 'Эксперт отвечающий за тайминги на площадке', 15);


SELECT pg_catalog.setval('seq_adm_group', 1000, true);
SELECT pg_catalog.setval('seq_adm_group_role', 1000, true);
SELECT pg_catalog.setval('seq_adm_role', 1000, true);
SELECT pg_catalog.setval('seq_adm_role_menu_item', 1000, true);
SELECT pg_catalog.setval('seq_adm_user', 1000, true);
SELECT pg_catalog.setval('seq_adm_user_group', 1000, true);
SELECT pg_catalog.setval('seq_krn_menu_group', 1000, true);
SELECT pg_catalog.setval('seq_krn_menu_item', 1000, true);
SELECT pg_catalog.setval('seq_sqr_criteria', 1000, true);
SELECT pg_catalog.setval('seq_sqr_question', 1000, true);
SELECT pg_catalog.setval('seq_sqr_question_answer', 1000, true);
SELECT pg_catalog.setval('seq_sqr_role', 1000, true);
SELECT pg_catalog.setval('seq_sqr_square', 1000, true);
SELECT pg_catalog.setval('seq_sqr_square_eval_group_user', 1000, true);
SELECT pg_catalog.setval('seq_sqr_square_eval_team', 1000, true);
SELECT pg_catalog.setval('seq_sqr_square_module', 1000, false);
SELECT pg_catalog.setval('seq_sqr_square_role', 1000, true);
SELECT pg_catalog.setval('seq_sqr_square_team', 1000, true);
SELECT pg_catalog.setval('seq_sqr_square_timer', 1000, true);
SELECT pg_catalog.setval('seq_sqr_square_timer_detail', 1000, true);


CREATE UNIQUE INDEX udx_adm_group_in_user_user_id ON adm_user_group USING btree (user_id, group_id);
CREATE UNIQUE INDEX udx_adm_role_in_group_group_role_id ON adm_group_role USING btree (group_id, role_id);
CREATE UNIQUE INDEX udx_adm_role_menu_item_role_id_menu_item_id ON adm_role_menu_item USING btree (role_id, menu_item_id);
CREATE UNIQUE INDEX udx_krn_menu_item_group_id_title ON krn_menu_item USING btree (group_id, title);
CREATE UNIQUE INDEX udx_sqr_square_eval_group_square_id_code ON sqr_square_eval_group USING btree (square_id, code);
CREATE UNIQUE INDEX udx_sqr_square_eval_group_user_eval_group_id_user_id ON sqr_square_eval_group_user USING btree (eval_group_id, user_id);
CREATE UNIQUE INDEX udx_sqr_square_team_square_id_name_caption ON sqr_square_team USING btree (square_id, caption, name);
CREATE UNIQUE INDEX udx_sqr_square_timer_square_id_team_id ON sqr_square_timer USING btree (square_id, team_id);
CREATE UNIQUE INDEX udx_sqr_square_user_square_id_user_id_role_id ON sqr_square_user USING btree (square_id, user_id, role_id);


ALTER TABLE ONLY adm_group ADD CONSTRAINT pk_adm_group PRIMARY KEY (id);
ALTER TABLE ONLY adm_user_group ADD CONSTRAINT pk_adm_group_in_user PRIMARY KEY (id);
ALTER TABLE ONLY adm_role ADD CONSTRAINT pk_adm_role PRIMARY KEY (id);
ALTER TABLE ONLY adm_group_role ADD CONSTRAINT pk_adm_role_in_group PRIMARY KEY (id);
ALTER TABLE ONLY adm_role_menu_item ADD CONSTRAINT pk_adm_role_menu_item PRIMARY KEY (id);
ALTER TABLE ONLY adm_user ADD CONSTRAINT pk_adm_user PRIMARY KEY (id);
ALTER TABLE ONLY krn_menu_group ADD CONSTRAINT pk_krn_manu_group PRIMARY KEY (id);
ALTER TABLE ONLY krn_menu_item ADD CONSTRAINT pk_krn_menu_item PRIMARY KEY (id);
ALTER TABLE ONLY sqr_criteria ADD CONSTRAINT pk_sqr_criteria PRIMARY KEY (id);
ALTER TABLE ONLY sqr_question ADD CONSTRAINT pk_sqr_question PRIMARY KEY (id);
ALTER TABLE ONLY sqr_question_answer ADD CONSTRAINT pk_sqr_question_answer PRIMARY KEY (id);
ALTER TABLE ONLY sqr_role ADD CONSTRAINT pk_sqr_role PRIMARY KEY (id);
ALTER TABLE ONLY sqr_square ADD CONSTRAINT pk_sqr_square PRIMARY KEY (id);
ALTER TABLE ONLY sqr_square_eval_group ADD CONSTRAINT pk_sqr_square_eval_group PRIMARY KEY (id);
ALTER TABLE ONLY sqr_square_eval_group_user ADD CONSTRAINT pk_sqr_square_eval_group_user PRIMARY KEY (id);
ALTER TABLE ONLY sqr_square_team ADD CONSTRAINT pk_sqr_square_team PRIMARY KEY (id);
ALTER TABLE ONLY sqr_square_timer ADD CONSTRAINT pk_sqr_square_timer PRIMARY KEY (id);
ALTER TABLE ONLY sqr_square_timer_detail ADD CONSTRAINT pk_sqr_square_timer_detail PRIMARY KEY (id);
ALTER TABLE ONLY sqr_square_user ADD CONSTRAINT pk_sqr_square_user PRIMARY KEY (id);


CREATE INDEX idx_adm_user_person_id ON adm_user USING btree (person_id);
CREATE INDEX idx_krn_menu_item_group_id ON krn_menu_item USING btree (group_id);
CREATE INDEX idx_krn_menu_item_title ON krn_menu_item USING btree (title);
CREATE INDEX idx_sqr_question_answer_question_id ON sqr_question_answer USING btree (question_id);
CREATE INDEX idx_sqr_question_answer_role_id ON sqr_question_answer USING btree (role_id);
CREATE INDEX idx_sqr_question_answer_user_id ON sqr_question_answer USING btree (user_id);
CREATE INDEX idx_sqr_question_square_id ON sqr_question USING btree (square_id);
CREATE INDEX idx_sqr_question_team_id ON sqr_question USING btree (team_id);
CREATE INDEX idx_sqr_question_user_id ON sqr_question USING btree (user_id);
CREATE INDEX idx_sqr_role_caption ON sqr_role USING btree (caption);
CREATE INDEX idx_sqr_role_group_id ON sqr_role USING btree (group_id);
CREATE INDEX idx_sqr_square_caption ON sqr_square USING btree (caption);
CREATE INDEX idx_sqr_square_eval_group_square_id ON sqr_square_eval_group USING btree (square_id);
CREATE INDEX idx_sqr_square_team_square_id ON sqr_square_team USING btree (square_id);
CREATE INDEX idx_sqr_square_timer_detail_timer_id ON sqr_square_timer_detail USING btree (timer_id);
CREATE INDEX idx_sqr_square_user_team_id ON sqr_square_user USING btree (team_id);
CREATE UNIQUE INDEX udx_adm_group_name ON adm_group USING btree (name);
CREATE UNIQUE INDEX udx_adm_role_name ON adm_role USING btree (name);
CREATE UNIQUE INDEX udx_adm_user_name ON adm_user USING btree (name);
CREATE UNIQUE INDEX udx_krn_manu_group_title ON krn_menu_group USING btree (title);
CREATE UNIQUE INDEX udx_sqr_criteria_square_id ON sqr_criteria USING btree (square_id);
CREATE UNIQUE INDEX udx_sqr_role_name ON sqr_role USING btree (name);
CREATE UNIQUE INDEX udx_sqr_square_name ON sqr_square USING btree (name);


ALTER TABLE ONLY adm_user_group ADD CONSTRAINT fk_adm_group_in_user_group_id FOREIGN KEY (group_id) REFERENCES adm_group(id) ON DELETE CASCADE;
ALTER TABLE ONLY adm_user_group ADD CONSTRAINT fk_adm_group_in_user_user_id FOREIGN KEY (user_id) REFERENCES adm_user(id) ON DELETE CASCADE;
ALTER TABLE ONLY adm_group_role ADD CONSTRAINT fk_adm_role_in_group_group FOREIGN KEY (group_id) REFERENCES adm_group(id) ON DELETE CASCADE;
ALTER TABLE ONLY adm_group_role ADD CONSTRAINT fk_adm_role_in_group_role FOREIGN KEY (role_id) REFERENCES adm_role(id) ON DELETE CASCADE;
ALTER TABLE ONLY adm_role_menu_item ADD CONSTRAINT fk_adm_role_menu_item_menu_item_id FOREIGN KEY (menu_item_id) REFERENCES krn_menu_item(id) ON DELETE CASCADE;
ALTER TABLE ONLY adm_role_menu_item ADD CONSTRAINT fk_adm_role_menu_item_role_id FOREIGN KEY (role_id) REFERENCES adm_role(id) ON DELETE CASCADE;
ALTER TABLE ONLY krn_menu_item ADD CONSTRAINT fk_krn_menu_item_group_id FOREIGN KEY (group_id) REFERENCES krn_menu_group(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_criteria ADD CONSTRAINT fk_sqr_criteria_square_id FOREIGN KEY (square_id) REFERENCES sqr_square(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_question_answer ADD CONSTRAINT fk_sqr_question_answer_question_id FOREIGN KEY (question_id) REFERENCES sqr_question(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_question_answer ADD CONSTRAINT fk_sqr_question_answer_role_id FOREIGN KEY (role_id) REFERENCES sqr_role(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_question_answer ADD CONSTRAINT fk_sqr_question_answer_user_id FOREIGN KEY (user_id) REFERENCES adm_user(id);
ALTER TABLE ONLY sqr_question ADD CONSTRAINT fk_sqr_question_square_id FOREIGN KEY (square_id) REFERENCES sqr_square(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_question ADD CONSTRAINT fk_sqr_question_team_id FOREIGN KEY (team_id) REFERENCES sqr_square_team(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_question ADD CONSTRAINT fk_sqr_question_user_id FOREIGN KEY (user_id) REFERENCES adm_user(id);
ALTER TABLE ONLY sqr_role ADD CONSTRAINT fk_sqr_role_adm_group_id FOREIGN KEY (group_id) REFERENCES adm_group(id);
ALTER TABLE ONLY sqr_square_eval_group ADD CONSTRAINT fk_sqr_square_eval_group_square_id FOREIGN KEY (square_id) REFERENCES sqr_square(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_square_eval_group_user ADD CONSTRAINT fk_sqr_square_eval_group_user_eval_group_id FOREIGN KEY (eval_group_id) REFERENCES sqr_square_eval_group(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_square_eval_group_user ADD CONSTRAINT fk_sqr_square_eval_group_user_user_id FOREIGN KEY (user_id) REFERENCES sqr_square_user(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_square_team ADD CONSTRAINT fk_sqr_square_team_square_id FOREIGN KEY (square_id) REFERENCES sqr_square(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_square_timer_detail ADD CONSTRAINT fk_sqr_square_timer_detail_timer_id FOREIGN KEY (timer_id) REFERENCES sqr_square_timer(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_square_timer ADD CONSTRAINT fk_sqr_square_timer_square_id FOREIGN KEY (square_id) REFERENCES sqr_square(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_square_timer ADD CONSTRAINT fk_sqr_square_timer_team_id FOREIGN KEY (team_id) REFERENCES sqr_square_team(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_square_user ADD CONSTRAINT fk_sqr_square_user_role_id FOREIGN KEY (role_id) REFERENCES sqr_role(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_square_user ADD CONSTRAINT fk_sqr_square_user_square_id FOREIGN KEY (square_id) REFERENCES sqr_square(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_square_user ADD CONSTRAINT fk_sqr_square_user_team_id FOREIGN KEY (team_id) REFERENCES sqr_square_team(id) ON DELETE CASCADE;
ALTER TABLE ONLY sqr_square_user ADD CONSTRAINT fk_sqr_square_user_user_id FOREIGN KEY (user_id) REFERENCES adm_user(id) ON DELETE CASCADE;
