DROP TABLE IF EXISTS gdm_dic_jobtype CASCADE;

CREATE TABLE gdm_dic_jobtype (
    id character varying(50),
    code character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    "order" numeric(8,0) NOT NULL,
    operator character varying(50) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    create_time bigint NOT NULL,
    update_time bigint NOT NULL,
    memo character varying(500) NOT NULL
);


CREATE UNIQUE INDEX pk_ds_dic_jobtype ON gdm.gdm_dic_jobtype USING btree (id);

COMMENT ON COLUMN gdm_dic_jobtype.id IS 'id';
COMMENT ON COLUMN gdm_dic_jobtype.code IS '分类代码';
COMMENT ON COLUMN gdm_dic_jobtype.name IS '分类名称';
COMMENT ON COLUMN gdm_dic_jobtype.order IS '标签位置 1 3 5';
COMMENT ON COLUMN gdm_dic_jobtype.operator IS '操作用户';
COMMENT ON COLUMN gdm_dic_jobtype.valid IS '有效性,0-无效,1-有效';
COMMENT ON COLUMN gdm_dic_jobtype.create_time IS '创建时间';
COMMENT ON COLUMN gdm_dic_jobtype.update_time IS '更新时间';
COMMENT ON COLUMN gdm_dic_jobtype.memo IS '备注';

INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('1', null, '警力', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('教导员', null, '教导员', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('巡防队员', null, '巡防队员', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('主任', null, '主任', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('秩序股长', null, '秩序股长', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('内勤', null, '内勤', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('值班民警', null, '值班民警', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('办公室主任', null, '办公室主任', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('巡逻辅警', null, '巡逻辅警', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('大队长', null, '大队长', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('5003', null, '5003', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('5004', null, '5004', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('非现场审核', null, '非现场审核', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('民警', null, '民警', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('副中队长', null, '副中队长', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('治安员', null, '治安员', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('非民警', null, '非民警', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('中队长', null, '中队长', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('副大队长', null, '副大队长', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('值班领导', null, '值班领导', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('交通股长', null, '交通股长', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('协警', null, '协警', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('null', null, 'null', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('轮巡员', null, '轮巡员', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('值班接警员', null, '值班接警员', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('支委成员', null, '支委成员', null, null, 1, null, null, null);
INSERT INTO gdm_dic_jobtype ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo") VALUES ('50001', null, '50001', null, null, 1, null, null, null);
