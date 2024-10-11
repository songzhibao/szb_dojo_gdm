DROP TABLE IF EXISTS gdm_dic_status CASCADE;

CREATE TABLE gdm_dic_status (
    id character varying(50),
    code character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    "order" numeric(8,0) NOT NULL,
    operator character varying(50) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    create_time bigint NOT NULL,
    update_time bigint NOT NULL,
    memo character varying(500) NOT NULL,
    duty_type smallint NOT NULL
);


CREATE UNIQUE INDEX ppk_ds_dic_status ON gdm.gdm_dic_status USING btree (id);

COMMENT ON COLUMN gdm_dic_status.id IS 'id';
COMMENT ON COLUMN gdm_dic_status.code IS '分类代码';
COMMENT ON COLUMN gdm_dic_status.name IS '分类名称';
COMMENT ON COLUMN gdm_dic_status.order IS '序号';
COMMENT ON COLUMN gdm_dic_status.operator IS '操作用户';
COMMENT ON COLUMN gdm_dic_status.valid IS '有效性,0-无效,1-有效';
COMMENT ON COLUMN gdm_dic_status.create_time IS '创建时间';
COMMENT ON COLUMN gdm_dic_status.update_time IS '更新时间';
COMMENT ON COLUMN gdm_dic_status.memo IS '备注';
COMMENT ON COLUMN gdm_dic_status.duty_type IS '勤务类型（1-临时，2排班）';

INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('4', '4', '上厕所', 4, '1', 1, null, null, '终端触发，需要审核', 1);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('2', '2', '路段巡逻', 2, null, 1, null, null, '终端触发，需要审核', 2);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('5', '5', '分批就餐', 5, '1', 1, 1573786234045, 1573786234045, '终端触发，需要审核', 2);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('14', '14', '车辆维修', 14, '1', 1, null, null, '终端触发，需要审核', 1);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('7', '7', '临时勤务', 7, '1', 1, null, null, '终端触发，需要审核', 1);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('15', '15', '派警', 15, '1', 1, null, null, '服务端派警触发', 1);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('9', '9', '到场', 9, '1', 1, null, null, '终端触发，不需要审核', 1);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('8', '8', '签收', 8, '1', 1, null, null, '终端触发，不需要审核', 1);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('17', '17', '集中停靠', 17, null, 1, null, null, '终端触发，需要审核', 2);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('10', '10', '集中盘查', 10, null, 1, null, null, '终端触发，需要审核', 2);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('6', '6', '加油加气（临）', 6, '1', 1, null, null, '终端触发，需要审核', 1);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('16', '16', '加油加气', 16, '1', 1, null, null, '终端触发，需要审核', 2);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('13', '13', '交接班', 13, null, 1, null, null, null, 2);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('3', '3', '下岗', 3, null, 1, 1573786234045, 1573786234045, '终端触发，不需要审核', 0);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('18', '18', '撤离', 18, null, 1, null, null, '终端触发，不需要审核', 0);
INSERT INTO gdm_dic_status ("id", "code", "name", "order", "operator", "valid", "create_time", "update_time", "memo", "duty_type") VALUES ('1', '1', '上岗', 1, null, 1, 1573786234045, 1573786234045, '终端触发，不需要审核', 0);
