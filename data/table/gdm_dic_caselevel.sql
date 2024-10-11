DROP TABLE IF EXISTS gdm_dic_caselevel CASCADE;

CREATE TABLE gdm_dic_caselevel (
    id numeric(16,0) NOT NULL,
    code character varying(400) NOT NULL,
    name character varying(200) NOT NULL,
    valid integer NOT NULL,
    deleted integer NOT NULL,
    create_time timestamp without time zone NOT NULL,
    update_time timestamp without time zone NOT NULL
);



COMMENT ON COLUMN gdm_dic_caselevel.id IS 'id';
COMMENT ON COLUMN gdm_dic_caselevel.code IS 'code';
COMMENT ON COLUMN gdm_dic_caselevel.name IS 'name';
COMMENT ON COLUMN gdm_dic_caselevel.valid IS 'valid';
COMMENT ON COLUMN gdm_dic_caselevel.deleted IS 'deleted';
COMMENT ON COLUMN gdm_dic_caselevel.create_time IS 'create_time';
COMMENT ON COLUMN gdm_dic_caselevel.update_time IS 'update_time';

INSERT INTO gdm_dic_caselevel ("id", "code", "name", "valid", "deleted", "create_time", "update_time") VALUES (100, '100', '甲级', 1, 0, null, null);
INSERT INTO gdm_dic_caselevel ("id", "code", "name", "valid", "deleted", "create_time", "update_time") VALUES (200, '200', '丙级', 1, 0, null, null);
INSERT INTO gdm_dic_caselevel ("id", "code", "name", "valid", "deleted", "create_time", "update_time") VALUES (300, '300', '乙级', 1, 0, null, null);
