DROP TABLE IF EXISTS gdm_sys_role CASCADE;

CREATE TABLE gdm_sys_role (
    id numeric(16,0),
    code character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    memo character varying(200) NOT NULL,
    create_time timestamp(6) without time zone NOT NULL,
    update_time timestamp(6) without time zone NOT NULL
);


CREATE UNIQUE INDEX pk_ds_sys_role ON gdm.gdm_sys_role USING btree (id);

COMMENT ON COLUMN gdm_sys_role.id IS 'id';
COMMENT ON COLUMN gdm_sys_role.code IS '角色编号';
COMMENT ON COLUMN gdm_sys_role.name IS '角色名称';
COMMENT ON COLUMN gdm_sys_role.valid IS '有效性，0 无效 1 有效';
COMMENT ON COLUMN gdm_sys_role.memo IS '备注';
COMMENT ON COLUMN gdm_sys_role.create_time IS '创建时间';
COMMENT ON COLUMN gdm_sys_role.update_time IS '更新时间';

INSERT INTO gdm_sys_role ("id", "code", "name", "valid", "memo", "create_time", "update_time") VALUES (20230504221504, null, '系统分析员', 1, '', null, null);
INSERT INTO gdm_sys_role ("id", "code", "name", "valid", "memo", "create_time", "update_time") VALUES (20230504226733, null, '数据采集员', 1, '', null, null);
