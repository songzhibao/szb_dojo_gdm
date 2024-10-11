DROP TABLE IF EXISTS gdm_dic_orgtype CASCADE;

CREATE TABLE gdm_dic_orgtype (
    id numeric(16,0),
    code character varying(16) NOT NULL,
    name character varying(50) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    deleted numeric(1,0) DEFAULT 0,
    create_time timestamp(6) without time zone NOT NULL,
    update_time timestamp(6) without time zone NOT NULL
);


CREATE UNIQUE INDEX pk_ds_dic_orgtype ON gdm.gdm_dic_orgtype USING btree (id);

COMMENT ON COLUMN gdm_dic_orgtype.id IS 'id';
COMMENT ON COLUMN gdm_dic_orgtype.code IS '代码';
COMMENT ON COLUMN gdm_dic_orgtype.name IS '名称';
COMMENT ON COLUMN gdm_dic_orgtype.valid IS '有效性，0-无效 1-有效';
COMMENT ON COLUMN gdm_dic_orgtype.deleted IS '删除标识，0-未删除，1-已删除';
COMMENT ON COLUMN gdm_dic_orgtype.create_time IS '创建时间';
COMMENT ON COLUMN gdm_dic_orgtype.update_time IS '更新时间';

INSERT INTO gdm_dic_orgtype ("id", "code", "name", "valid", "deleted", "create_time", "update_time") VALUES (10, '10', '工程勘查', 1, 0, null, null);
INSERT INTO gdm_dic_orgtype ("id", "code", "name", "valid", "deleted", "create_time", "update_time") VALUES (20, '20', '治理施工', 1, 0, null, null);
INSERT INTO gdm_dic_orgtype ("id", "code", "name", "valid", "deleted", "create_time", "update_time") VALUES (30, '30', '治理设计', 1, 0, null, null);
INSERT INTO gdm_dic_orgtype ("id", "code", "name", "valid", "deleted", "create_time", "update_time") VALUES (40, '40', '工程监理', 1, 0, null, null);
INSERT INTO gdm_dic_orgtype ("id", "code", "name", "valid", "deleted", "create_time", "update_time") VALUES (50, '50', '危险评估', 1, 0, null, null);
