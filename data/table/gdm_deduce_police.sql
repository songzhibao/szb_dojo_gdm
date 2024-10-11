DROP TABLE IF EXISTS gdm_deduce_police CASCADE;

CREATE TABLE gdm_deduce_police (
    id numeric(16,0) NOT NULL,
    name character varying(50) NOT NULL,
    code character varying(50) NOT NULL,
    job character varying(50) NOT NULL,
    zb character varying(500) NOT NULL,
    zz character varying(500) NOT NULL,
    phone character varying(50) NOT NULL,
    org_id character varying(50) NOT NULL,
    gua_id numeric(16,0) NOT NULL,
    task_id character varying(50) NOT NULL
);



COMMENT ON COLUMN gdm_deduce_police.id IS 'id';
COMMENT ON COLUMN gdm_deduce_police.name IS 'name';
COMMENT ON COLUMN gdm_deduce_police.code IS 'code';
COMMENT ON COLUMN gdm_deduce_police.job IS 'job';
COMMENT ON COLUMN gdm_deduce_police.zb IS 'zb';
COMMENT ON COLUMN gdm_deduce_police.zz IS 'zz';
COMMENT ON COLUMN gdm_deduce_police.phone IS 'phone';
COMMENT ON COLUMN gdm_deduce_police.org_id IS 'org_id';
COMMENT ON COLUMN gdm_deduce_police.gua_id IS 'gua_id';
COMMENT ON COLUMN gdm_deduce_police.task_id IS 'task_id';

INSERT INTO gdm_deduce_police ("id", "name", "code", "job", "zb", "zz", "phone", "org_id", "gua_id", "task_id") VALUES (20230520166310, '某红英', 'FJ2906', '轮巡员', null, null, null, null, 20230520166309, '2023513083626865');
INSERT INTO gdm_deduce_police ("id", "name", "code", "job", "zb", "zz", "phone", "org_id", "gua_id", "task_id") VALUES (20230520166311, '某世德', 'FJ1180', '轮巡员', null, null, null, null, 20230520166309, '2023513083626865');
INSERT INTO gdm_deduce_police ("id", "name", "code", "job", "zb", "zz", "phone", "org_id", "gua_id", "task_id") VALUES (20230520166312, '某圆圆', 'FJ1153', '轮巡员', null, null, null, null, 20230520166309, '2023513083626865');
INSERT INTO gdm_deduce_police ("id", "name", "code", "job", "zb", "zz", "phone", "org_id", "gua_id", "task_id") VALUES (20230611125945, '某佳琪', 'FJ2907', '轮巡员', null, null, null, null, 20230611125944, '2023611124224937');
INSERT INTO gdm_deduce_police ("id", "name", "code", "job", "zb", "zz", "phone", "org_id", "gua_id", "task_id") VALUES (20230611125946, '某岱峰', 'FJ1384', '轮巡员', null, null, null, null, 20230611125944, '2023611124224937');
