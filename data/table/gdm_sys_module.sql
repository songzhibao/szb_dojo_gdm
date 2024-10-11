DROP TABLE IF EXISTS gdm_sys_module CASCADE;

CREATE TABLE gdm_sys_module (
    id numeric(16,0),
    code character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    ordernumber numeric(8,0) NOT NULL,
    create_time timestamp(6) without time zone NOT NULL,
    update_time timestamp(6) without time zone NOT NULL
);


CREATE UNIQUE INDEX pk_ds_sys_module ON gdm.gdm_sys_module USING btree (id);

COMMENT ON COLUMN gdm_sys_module.id IS '模块ID';
COMMENT ON COLUMN gdm_sys_module.code IS '代码';
COMMENT ON COLUMN gdm_sys_module.name IS '名称';
COMMENT ON COLUMN gdm_sys_module.ordernumber IS '序号';
COMMENT ON COLUMN gdm_sys_module.create_time IS '创建时间';
COMMENT ON COLUMN gdm_sys_module.update_time IS '更新时间';

