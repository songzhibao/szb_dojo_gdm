DROP TABLE IF EXISTS gdm_deduce_point CASCADE;

CREATE TABLE gdm_deduce_point (
    id numeric(16,0),
    task_id character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    type character varying(50) NOT NULL,
    stage numeric(2,0) NOT NULL,
    org_id character varying(50) NOT NULL,
    lon numeric(10,7) NOT NULL,
    lat numeric(10,7) NOT NULL,
    zrld character varying(150) NOT NULL,
    lxdh character varying(150) NOT NULL,
    orgname character varying(50) NOT NULL,
    orgid_l1 character varying(50) NOT NULL,
    orgid_l2 character varying(50) NOT NULL,
    is_used numeric(1,0) NOT NULL DEFAULT 1,
    is_deleted numeric(1,0) NOT NULL DEFAULT 0,
    creator character varying(50) NOT NULL,
    action text NOT NULL,
    memo character varying(4000) NOT NULL,
    create_time timestamp(6) without time zone NOT NULL,
    update_time timestamp(6) without time zone NOT NULL,
    geom geometry NOT NULL
);



COMMENT ON COLUMN gdm_deduce_point.id IS 'id';
COMMENT ON COLUMN gdm_deduce_point.task_id IS 'task_id';
COMMENT ON COLUMN gdm_deduce_point.name IS 'name';
COMMENT ON COLUMN gdm_deduce_point.type IS '类型';
COMMENT ON COLUMN gdm_deduce_point.stage IS '阶段 10 20 30';
COMMENT ON COLUMN gdm_deduce_point.org_id IS 'org_id';
COMMENT ON COLUMN gdm_deduce_point.lon IS 'lon';
COMMENT ON COLUMN gdm_deduce_point.lat IS 'lat';
COMMENT ON COLUMN gdm_deduce_point.zrld IS '责任领导';
COMMENT ON COLUMN gdm_deduce_point.lxdh IS '联系电话';
COMMENT ON COLUMN gdm_deduce_point.orgname IS 'orgname';
COMMENT ON COLUMN gdm_deduce_point.orgid_l1 IS 'orgid_l1';
COMMENT ON COLUMN gdm_deduce_point.orgid_l2 IS 'orgid_l2';
COMMENT ON COLUMN gdm_deduce_point.is_used IS '是否使用';
COMMENT ON COLUMN gdm_deduce_point.is_deleted IS '是否删除';
COMMENT ON COLUMN gdm_deduce_point.creator IS '生成人员ID';
COMMENT ON COLUMN gdm_deduce_point.action IS 'action';
COMMENT ON COLUMN gdm_deduce_point.memo IS 'memo';
COMMENT ON COLUMN gdm_deduce_point.create_time IS '生成时间';
COMMENT ON COLUMN gdm_deduce_point.update_time IS '修改时间';
COMMENT ON COLUMN gdm_deduce_point.geom IS 'geom';

INSERT INTO gdm_deduce_point ("id", "task_id", "name", "type", "stage", "org_id", "lon", "lat", "zrld", "lxdh", "orgname", "orgid_l1", "orgid_l2", "is_used", "is_deleted", "creator", "action", "memo", "create_time", "update_time", "geom") VALUES (20230513103148, null, '666', 'MutiPolice', null, null, 121.3979450, 28.6467556, null, null, null, '202305042030', '202305042031', 1, 0, null, null, '6666', null, null, null);
INSERT INTO gdm_deduce_point ("id", "task_id", "name", "type", "stage", "org_id", "lon", "lat", "zrld", "lxdh", "orgname", "orgid_l1", "orgid_l2", "is_used", "is_deleted", "creator", "action", "memo", "create_time", "update_time", "geom") VALUES (20230513135012, '2023513083626865', '6677', 'SafePoint', null, null, 121.4154544, 28.6513046, null, null, null, '202305042030', '202305042031', 1, 0, null, null, '66777', null, null, null);
INSERT INTO gdm_deduce_point ("id", "task_id", "name", "type", "stage", "org_id", "lon", "lat", "zrld", "lxdh", "orgname", "orgid_l1", "orgid_l2", "is_used", "is_deleted", "creator", "action", "memo", "create_time", "update_time", "geom") VALUES (20230513111502, '2023513083626865', '777', 'SafePoint', 10, null, 121.3952842, 28.6571411, null, null, null, '202305042030', '202305042031', 1, 0, null, '121.39635708360598,28.656239877771,121.40056278734133,28.656154047082524,121.40622761278078,28.655896555017094,121.41034748582766,28.655639062951664', '77777', null, null, null);
INSERT INTO gdm_deduce_point ("id", "task_id", "name", "type", "stage", "org_id", "lon", "lat", "zrld", "lxdh", "orgname", "orgid_l1", "orgid_l2", "is_used", "is_deleted", "creator", "action", "memo", "create_time", "update_time", "geom") VALUES (20230513103530, '2023513083626865', '777', 'MutiPolice', 20, null, 121.4032665, 28.6584286, null, null, null, '202305042030', '202305042031', 1, 0, null, '', '77777', null, null, null);
INSERT INTO gdm_deduce_point ("id", "task_id", "name", "type", "stage", "org_id", "lon", "lat", "zrld", "lxdh", "orgname", "orgid_l1", "orgid_l2", "is_used", "is_deleted", "creator", "action", "memo", "create_time", "update_time", "geom") VALUES (20230513146743, '2023513083626865', '333', 'OnePolice', null, null, 121.4382854, 28.6616901, null, null, null, '202305042030', '202305042031', 1, 0, null, null, '3333', null, null, null);
INSERT INTO gdm_deduce_point ("id", "task_id", "name", "type", "stage", "org_id", "lon", "lat", "zrld", "lxdh", "orgname", "orgid_l1", "orgid_l2", "is_used", "is_deleted", "creator", "action", "memo", "create_time", "update_time", "geom") VALUES (20230520146636, '2023513083626865', '保障点', 'SafePoint', null, null, 118.0794328, 36.8507153, null, null, null, '202305042030', '202305042031', 1, 0, null, null, '你好', null, null, null);
INSERT INTO gdm_deduce_point ("id", "task_id", "name", "type", "stage", "org_id", "lon", "lat", "zrld", "lxdh", "orgname", "orgid_l1", "orgid_l2", "is_used", "is_deleted", "creator", "action", "memo", "create_time", "update_time", "geom") VALUES (20230520152329, '2023513083626865', '你好', 'OnePolice', null, null, 118.3073991, 36.8232495, null, null, null, '202305042030', '202305042031', 1, 0, null, null, '你好，注意安全', null, null, null);
INSERT INTO gdm_deduce_point ("id", "task_id", "name", "type", "stage", "org_id", "lon", "lat", "zrld", "lxdh", "orgname", "orgid_l1", "orgid_l2", "is_used", "is_deleted", "creator", "action", "memo", "create_time", "update_time", "geom") VALUES (20230520152515, '2023513083626865', '巡逻起点', 'MutiPolice', null, null, 117.8789323, 36.8369824, null, null, null, '202305042030', '202305042031', 1, 0, null, null, '注意安全', null, null, null);
INSERT INTO gdm_deduce_point ("id", "task_id", "name", "type", "stage", "org_id", "lon", "lat", "zrld", "lxdh", "orgname", "orgid_l1", "orgid_l2", "is_used", "is_deleted", "creator", "action", "memo", "create_time", "update_time", "geom") VALUES (20230520166309, '2023513083626865', '巡检人员', 'OnePolice', null, null, 118.5916704, 36.7930371, '某树朋', '13126638674', null, '202305042030', '202305042031', 1, 0, null, null, '', null, null, null);
INSERT INTO gdm_deduce_point ("id", "task_id", "name", "type", "stage", "org_id", "lon", "lat", "zrld", "lxdh", "orgname", "orgid_l1", "orgid_l2", "is_used", "is_deleted", "creator", "action", "memo", "create_time", "update_time", "geom") VALUES (20230611125944, '2023611124224937', '4555', 'MutiPolice', 0, null, 118.2442278, 36.8465954, '某记洲', '555', null, '202305042030', '202305042031', 1, 0, null, '118.19066945039063,36.8520885640625,118.05059376679688,36.86582147421875,117.88170954454273,36.88434561659583,117.8144182847771,36.86786612440833,117.71966120469898,36.885718907611455,117.64825007188648,36.90082510878333', '6677', null, null, null);
