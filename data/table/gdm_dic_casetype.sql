DROP TABLE IF EXISTS gdm_dic_casetype CASCADE;

CREATE TABLE gdm_dic_casetype (
    id numeric(16,0),
    code character varying(12) NOT NULL,
    police_type character varying(16) NOT NULL,
    name character varying(80) NOT NULL,
    full_name character varying(400) NOT NULL,
    parent_id numeric(16,0) NOT NULL,
    casetype_level numeric(18,0) NOT NULL,
    order_number numeric(8,0) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    deleted numeric(1,0) DEFAULT 0,
    create_time timestamp(6) without time zone NOT NULL,
    update_time timestamp(6) without time zone NOT NULL
);


CREATE UNIQUE INDEX pk_ds_dic_casetype ON gdm.gdm_dic_casetype USING btree (id);

COMMENT ON COLUMN gdm_dic_casetype.id IS '案由编号';
COMMENT ON COLUMN gdm_dic_casetype.code IS '案由代码';
COMMENT ON COLUMN gdm_dic_casetype.police_type IS '警种编号';
COMMENT ON COLUMN gdm_dic_casetype.name IS '案由名称';
COMMENT ON COLUMN gdm_dic_casetype.full_name IS '案由全称';
COMMENT ON COLUMN gdm_dic_casetype.parent_id IS '上级案由编号';
COMMENT ON COLUMN gdm_dic_casetype.casetype_level IS '案由级别，1-类别，2-类型，3-细类';
COMMENT ON COLUMN gdm_dic_casetype.order_number IS '序号';
COMMENT ON COLUMN gdm_dic_casetype.valid IS '有效性，0-无效 1-有效';
COMMENT ON COLUMN gdm_dic_casetype.deleted IS '删除标识，0-未删除，1-已删除';
COMMENT ON COLUMN gdm_dic_casetype.create_time IS '创建时间';
COMMENT ON COLUMN gdm_dic_casetype.update_time IS '更新时间';

INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (1, '1', null, '地壳活动灾害', null, null, 1, 1, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (10, '10', null, '地震', null, 1, 1, 10, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (11, '11', null, '火山喷发', null, 1, 1, 11, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (12, '12', null, '断层错动', null, 1, 1, 12, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (2, '2', null, '斜破岩土体运动灾害', null, null, 2, 1, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (30, '30', null, '滑坡', null, 2, 1, 30, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (40, '40', null, '岩溶塌陷', null, 2, 1, 40, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (20, '20', null, '泥石流', null, 2, 1, 20, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (3, '3', null, '地面变形灾害', null, null, 3, 1, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (50, '50', null, '地面塌陷', null, 3, 1, 50, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (51, '51', null, '地面沉降', null, 3, 2, 50, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (52, '52', null, '地面开裂', null, 3, 2, 50, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (4, '4', null, '城市地质灾害', null, null, 4, 1, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (60, '60', null, '建筑地基', null, 4, 1, 50, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (61, '61', null, '基坑变形', null, 4, 1, 50, 1, 0, null, null);
INSERT INTO gdm_dic_casetype ("id", "code", "police_type", "name", "full_name", "parent_id", "casetype_level", "order_number", "valid", "deleted", "create_time", "update_time") VALUES (62, '62', null, '垃圾堆积', null, 4, 1, 50, 1, 0, null, null);
