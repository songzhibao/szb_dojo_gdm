DROP TABLE IF EXISTS gdm_sys_user CASCADE;

CREATE TABLE gdm_sys_user (
    id numeric(16,0),
    code character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    user_type numeric(1,0) NOT NULL,
    org_id character varying(50) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    deleted numeric(1,0) DEFAULT 0,
    memo character varying(50) NOT NULL,
    phone character varying(50) NOT NULL,
    photo character varying(255) NOT NULL,
    create_time timestamp(6) without time zone NOT NULL,
    update_time timestamp(6) without time zone NOT NULL
);



COMMENT ON COLUMN gdm_sys_user.id IS 'id';
COMMENT ON COLUMN gdm_sys_user.code IS '登录名';
COMMENT ON COLUMN gdm_sys_user.name IS '用户昵称';
COMMENT ON COLUMN gdm_sys_user.password IS '密码';
COMMENT ON COLUMN gdm_sys_user.user_type IS '用户类型，0 超级管理员，1 一般用户';
COMMENT ON COLUMN gdm_sys_user.org_id IS '机构ID';
COMMENT ON COLUMN gdm_sys_user.valid IS '有效性，0 无效 1 有效';
COMMENT ON COLUMN gdm_sys_user.deleted IS '删除标识，0 未删除 1 已删除
';
COMMENT ON COLUMN gdm_sys_user.memo IS '备注';
COMMENT ON COLUMN gdm_sys_user.phone IS '手机';
COMMENT ON COLUMN gdm_sys_user.photo IS '照片路径';
COMMENT ON COLUMN gdm_sys_user.create_time IS '创建时间';
COMMENT ON COLUMN gdm_sys_user.update_time IS '更新时间';

INSERT INTO gdm_sys_user ("id", "code", "name", "password", "user_type", "org_id", "valid", "deleted", "memo", "phone", "photo", "create_time", "update_time") VALUES (10, 'admin', '系统管理员', '123456', null, null, 1, 0, null, null, null, null, null);
