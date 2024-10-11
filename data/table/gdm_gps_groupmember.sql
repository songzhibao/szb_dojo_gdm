DROP TABLE IF EXISTS gdm_gps_groupmember CASCADE;

CREATE TABLE gdm_gps_groupmember (
    id character varying(50),
    group_id character varying(50) NOT NULL,
    member_id character varying(50),
    is_leader numeric(1,0) NOT NULL,
    operator character varying(50) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    create_time bigint NOT NULL,
    update_time bigint NOT NULL,
    is_default numeric(255,0) NOT NULL DEFAULT 1
);


CREATE UNIQUE INDEX ds_gps_groupmember_copy1_pkey ON gdm.gdm_gps_groupmember USING btree (id);

COMMENT ON COLUMN gdm_gps_groupmember.id IS 'id';
COMMENT ON COLUMN gdm_gps_groupmember.group_id IS '所属组id';
COMMENT ON COLUMN gdm_gps_groupmember.member_id IS '成员id';
COMMENT ON COLUMN gdm_gps_groupmember.is_leader IS '是否为领队';
COMMENT ON COLUMN gdm_gps_groupmember.operator IS '操作用户';
COMMENT ON COLUMN gdm_gps_groupmember.valid IS '有效性,0-无效,1-有效';
COMMENT ON COLUMN gdm_gps_groupmember.create_time IS '创建时间';
COMMENT ON COLUMN gdm_gps_groupmember.update_time IS '更新时间';
COMMENT ON COLUMN gdm_gps_groupmember.is_default IS '是否默认';

