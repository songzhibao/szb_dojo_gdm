DROP TABLE IF EXISTS gdm_sys_organization CASCADE;

CREATE TABLE gdm_sys_organization (
    id character varying(50) NOT NULL,
    type_id numeric(16,0) NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    level character varying(50) NOT NULL,
    pid character varying(50) NOT NULL,
    order_number numeric(10,0) NOT NULL,
    lon character varying(40) NOT NULL,
    lat character varying(40) NOT NULL,
    telphone character varying(50) NOT NULL,
    memo character varying(50) NOT NULL,
    operator character varying(50) NOT NULL,
    valid integer NOT NULL,
    update_time double precision NOT NULL,
    create_time double precision NOT NULL
);



COMMENT ON COLUMN gdm_sys_organization.id IS 'id';
COMMENT ON COLUMN gdm_sys_organization.type_id IS 'type_id';
COMMENT ON COLUMN gdm_sys_organization.code IS 'code';
COMMENT ON COLUMN gdm_sys_organization.name IS 'name';
COMMENT ON COLUMN gdm_sys_organization.level IS 'level';
COMMENT ON COLUMN gdm_sys_organization.pid IS 'pid';
COMMENT ON COLUMN gdm_sys_organization.order_number IS 'order_number';
COMMENT ON COLUMN gdm_sys_organization.lon IS 'lon';
COMMENT ON COLUMN gdm_sys_organization.lat IS 'lat';
COMMENT ON COLUMN gdm_sys_organization.telphone IS 'telphone';
COMMENT ON COLUMN gdm_sys_organization.memo IS 'memo';
COMMENT ON COLUMN gdm_sys_organization.operator IS 'operator';
COMMENT ON COLUMN gdm_sys_organization.valid IS 'valid';
COMMENT ON COLUMN gdm_sys_organization.update_time IS 'update_time';
COMMENT ON COLUMN gdm_sys_organization.create_time IS 'create_time';

INSERT INTO gdm_sys_organization ("id", "type_id", "code", "name", "level", "pid", "order_number", "lon", "lat", "telphone", "memo", "operator", "valid", "update_time", "create_time") VALUES ('202305042030', 30, '1000', '山东省自然资源局', '1', null, 100, null, null, '13124881766', '省局', null, 1, null, null);
INSERT INTO gdm_sys_organization ("id", "type_id", "code", "name", "level", "pid", "order_number", "lon", "lat", "telphone", "memo", "operator", "valid", "update_time", "create_time") VALUES ('202305042031', 30, '100010', '青岛市自然资源局', '1', '202305042030', 100, null, null, '13124881766', '市局', null, 1, null, null);
INSERT INTO gdm_sys_organization ("id", "type_id", "code", "name", "level", "pid", "order_number", "lon", "lat", "telphone", "memo", "operator", "valid", "update_time", "create_time") VALUES ('120421110012', 30, '10001010', '崂山区自然资源局', '3', '202305042031', 10010, null, null, '13124881766', '', '', 1, 946702020000.0, 946702020000.0);
INSERT INTO gdm_sys_organization ("id", "type_id", "code", "name", "level", "pid", "order_number", "lon", "lat", "telphone", "memo", "operator", "valid", "update_time", "create_time") VALUES ('130499100000', 30, '10001020', '市北区自然资源局', '3', '202305042031', 10020, null, null, '13124881766', '', '', 1, 946702020000.0, 946701910000.0);
