DROP TABLE IF EXISTS gdm_sys_user_role CASCADE;

CREATE TABLE gdm_sys_user_role (
    user_id numeric(16,0),
    role_id numeric(16,0)
);


CREATE UNIQUE INDEX pk_ds_sys_user_role ON gdm.gdm_sys_user_role USING btree (user_id, role_id);

COMMENT ON COLUMN gdm_sys_user_role.user_id IS '用户ID';
COMMENT ON COLUMN gdm_sys_user_role.role_id IS '角色ID';

