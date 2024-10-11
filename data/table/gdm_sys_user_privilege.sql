DROP TABLE IF EXISTS gdm_sys_user_privilege CASCADE;

CREATE TABLE gdm_sys_user_privilege (
    user_id numeric(16,0),
    privilege_id numeric(16,0)
);


CREATE UNIQUE INDEX pk_ds_gis_user_privilege ON gdm.gdm_sys_user_privilege USING btree (user_id, privilege_id);

COMMENT ON COLUMN gdm_sys_user_privilege.user_id IS '用户ID';
COMMENT ON COLUMN gdm_sys_user_privilege.privilege_id IS '权限ID';

