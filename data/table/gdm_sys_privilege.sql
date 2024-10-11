DROP TABLE IF EXISTS gdm_sys_privilege CASCADE;

CREATE TABLE gdm_sys_privilege (
    id numeric(16,0),
    code character varying(30),
    name character varying(255) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    module_id numeric(16,0) NOT NULL,
    ordernumber numeric(8,0) NOT NULL,
    memo character varying(255) NOT NULL,
    create_time timestamp(6) without time zone NOT NULL,
    update_time timestamp(6) without time zone NOT NULL
);


CREATE UNIQUE INDEX uq_ds_sys_privilege_code ON gdm.gdm_sys_privilege USING btree (code);
CREATE UNIQUE INDEX pk_ds_sys_privilege ON gdm.gdm_sys_privilege USING btree (id);

COMMENT ON COLUMN gdm_sys_privilege.id IS 'id';
COMMENT ON COLUMN gdm_sys_privilege.code IS '权限代码';
COMMENT ON COLUMN gdm_sys_privilege.name IS '名称';
COMMENT ON COLUMN gdm_sys_privilege.valid IS '有效性，0－无效，1－有效';
COMMENT ON COLUMN gdm_sys_privilege.module_id IS '模块ID';
COMMENT ON COLUMN gdm_sys_privilege.ordernumber IS '序号';
COMMENT ON COLUMN gdm_sys_privilege.memo IS '备注';
COMMENT ON COLUMN gdm_sys_privilege.create_time IS '创建时间';
COMMENT ON COLUMN gdm_sys_privilege.update_time IS '更新时间';

