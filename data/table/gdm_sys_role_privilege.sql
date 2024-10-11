DROP TABLE IF EXISTS gdm_sys_role_privilege CASCADE;

CREATE TABLE gdm_sys_role_privilege (
    role_id numeric(16,0),
    privilege_id numeric(16,0)
);


CREATE UNIQUE INDEX pk_ds_sys_role_privilege ON gdm.gdm_sys_role_privilege USING btree (role_id, privilege_id);

COMMENT ON COLUMN gdm_sys_role_privilege.role_id IS '角色ID';
COMMENT ON COLUMN gdm_sys_role_privilege.privilege_id IS '权限ID';

