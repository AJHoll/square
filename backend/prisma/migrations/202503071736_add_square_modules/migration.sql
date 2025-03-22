create sequence if not exists seq_sqr_square_module
start with 1000
    increment by 1
    no minvalue
    no maxvalue
    cache 1;

CREATE TABLE sqr_square_module (
	id public.t_id DEFAULT nextval('seq_sqr_square_module'::regclass) NOT NULL,
	square_id public.t_id NULL,
	code public.t_code NULL,
	caption public.t_caption NULL,
	evaluating public.t_boolean DEFAULT false NOT NULL,
	CONSTRAINT pk_sqr_square_module PRIMARY KEY (id),
	CONSTRAINT fk_sqr_square_module_square_id FOREIGN KEY (square_id) REFERENCES sqr_square(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX udx_sqr_square_module_square_id_code ON sqr_square_module (square_id,code);
CREATE INDEX idx_sqr_square_module_square_id ON sqr_square_module (square_id);

COMMENT ON TABLE sqr_square_module IS 'Модули задания на плозадке';
COMMENT ON COLUMN sqr_square_module.id IS 'ID';
COMMENT ON COLUMN sqr_square_module.square_id IS 'ID площадки';
COMMENT ON COLUMN sqr_square_module.code IS 'Код (короткое именование)';
COMMENT ON COLUMN sqr_square_module.caption IS 'Наименование';
COMMENT ON COLUMN sqr_square_module.evaluating IS 'Доступен для проверки (по-умолчанию нет)';
