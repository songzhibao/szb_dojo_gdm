DROP TABLE IF EXISTS gdm_dic_devicetype CASCADE;

CREATE TABLE gdm_dic_devicetype (
    id character varying(50),
    code character varying(50) NOT NULL,
    name character varying(80) NOT NULL,
    "order" numeric(8,0) NOT NULL,
    operator character varying(50) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    create_time bigint NOT NULL,
    update_time bigint NOT NULL,
    memo character varying(500) NOT NULL
);


CREATE UNIQUE INDEX pk_ds_dic_devicetype ON gdm.gdm_dic_devicetype USING btree (id);

COMMENT ON COLUMN gdm_dic_devicetype.id IS 'id';
COMMENT ON COLUMN gdm_dic_devicetype.code IS '分类代码';
COMMENT ON COLUMN gdm_dic_devicetype.name IS '分类名称';
COMMENT ON COLUMN gdm_dic_devicetype.order IS '序号';
COMMENT ON COLUMN gdm_dic_devicetype.operator IS '操作用户';
COMMENT ON COLUMN gdm_dic_devicetype.valid IS '有效性,0-无效,1-有效';
COMMENT ON COLUMN gdm_dic_devicetype.create_time IS '创建时间';
COMMENT ON COLUMN gdm_dic_devicetype.update_time IS '更新时间';
COMMENT ON COLUMN gdm_dic_devicetype.memo IS '备注';

INSERT INTO gdm_dic_devicetype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('5', '5', '巡车', null, null, 1, null, null, null);
INSERT INTO gdm_dic_devicetype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('6', '6', '摩托车', null, null, 1, null, null, null);
INSERT INTO gdm_dic_devicetype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('3', '3', '4G记录仪', null, null, 1, null, null, null);
INSERT INTO gdm_dic_devicetype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('1', '1', '轿车', null, null, 1, null, null, null);
INSERT INTO gdm_dic_devicetype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('4', '4', '掌务通', null, null, 1, null, null, null);
INSERT INTO gdm_dic_devicetype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('2', '2', '全务通', null, null, 1, null, null, null);
INSERT INTO gdm_dic_devicetype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('8', '8', '4G视频车', null, null, 1, null, null, null);
