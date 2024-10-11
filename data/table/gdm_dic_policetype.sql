DROP TABLE IF EXISTS gdm_dic_policetype CASCADE;

CREATE TABLE gdm_dic_policetype (
    id character varying(50),
    code character varying(50) NOT NULL,
    name character varying(80) NOT NULL,
    order_number numeric(8,0) NOT NULL,
    operator character varying(50) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    create_time bigint NOT NULL,
    update_time bigint NOT NULL,
    deleted bigint NOT NULL DEFAULT 0,
    memo character varying(500) NOT NULL
);


CREATE UNIQUE INDEX ds_dic_policetype_copy1_pkey ON gdm.gdm_dic_policetype USING btree (id);

COMMENT ON COLUMN gdm_dic_policetype.id IS 'id';
COMMENT ON COLUMN gdm_dic_policetype.code IS '分类代码';
COMMENT ON COLUMN gdm_dic_policetype.name IS '分类名称';
COMMENT ON COLUMN gdm_dic_policetype.order_number IS '序号';
COMMENT ON COLUMN gdm_dic_policetype.operator IS '操作用户';
COMMENT ON COLUMN gdm_dic_policetype.valid IS '有效性,0-无效,1-有效';
COMMENT ON COLUMN gdm_dic_policetype.create_time IS '创建时间';
COMMENT ON COLUMN gdm_dic_policetype.update_time IS '更新时间';
COMMENT ON COLUMN gdm_dic_policetype.deleted IS '是否删除';
COMMENT ON COLUMN gdm_dic_policetype.memo IS '备注';

INSERT INTO gdm_dic_policetype ("id", "code", "name", "order_number", "operator", "valid", "create_time", "update_time", "deleted", "memo") VALUES ('6', '6', '摩托车', 4, null, 1, null, null, 0, null);
INSERT INTO gdm_dic_policetype ("id", "code", "name", "order_number", "operator", "valid", "create_time", "update_time", "deleted", "memo") VALUES ('1', '1', '巡车', 3, null, 1, null, null, 0, null);
INSERT INTO gdm_dic_policetype ("id", "code", "name", "order_number", "operator", "valid", "create_time", "update_time", "deleted", "memo") VALUES ('4', '4', '管理人员', 1, null, 1, null, null, 0, null);
INSERT INTO gdm_dic_policetype ("id", "code", "name", "order_number", "operator", "valid", "create_time", "update_time", "deleted", "memo") VALUES ('2', '2', '巡检人员', 2, null, 1, null, null, 0, null);
INSERT INTO gdm_dic_policetype ("id", "code", "name", "order_number", "operator", "valid", "create_time", "update_time", "deleted", "memo") VALUES ('8', '8', '4G视频车', 5, null, 1, null, null, 0, null);
