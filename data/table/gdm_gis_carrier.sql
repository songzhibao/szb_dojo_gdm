DROP TABLE IF EXISTS gdm_gis_carrier CASCADE;

CREATE TABLE gdm_gis_carrier (
    id character varying(50),
    car_type character varying(50) NOT NULL,
    car_title character varying(50) NOT NULL,
    org_id character varying(50) NOT NULL,
    license character varying(500) NOT NULL,
    operator character varying(50) NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    create_time bigint NOT NULL,
    update_time bigint NOT NULL,
    mark_type character varying(255) NOT NULL,
    icon_file_path character varying(255) NOT NULL,
    name character varying NOT NULL
);


CREATE UNIQUE INDEX pk_ds_gis_carrier ON gdm.gdm_gis_carrier USING btree (id);

COMMENT ON COLUMN gdm_gis_carrier.id IS 'id';
COMMENT ON COLUMN gdm_gis_carrier.car_type IS '载具类型';
COMMENT ON COLUMN gdm_gis_carrier.car_title IS '显示名称';
COMMENT ON COLUMN gdm_gis_carrier.org_id IS '所属机构id';
COMMENT ON COLUMN gdm_gis_carrier.license IS '车牌号码';
COMMENT ON COLUMN gdm_gis_carrier.operator IS '操作用户';
COMMENT ON COLUMN gdm_gis_carrier.valid IS '有效性,0-无效,1-有效';
COMMENT ON COLUMN gdm_gis_carrier.create_time IS '创建时间';
COMMENT ON COLUMN gdm_gis_carrier.update_time IS '更新时间';
COMMENT ON COLUMN gdm_gis_carrier.mark_type IS '标签分类';
COMMENT ON COLUMN gdm_gis_carrier.icon_file_path IS 'icon_file_path';
COMMENT ON COLUMN gdm_gis_carrier.name IS 'name';

INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('8608213', '1', '某D2722警', '1230023', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('8812489', '1', '某D3311警', '1230044', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('7732006', '1', '某D3852警', '1230025', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('1658373', '1', '某D5501警', '130499150000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('7678710', '1', '某D2982警', '1230038', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('2146029', '1', '某D5997警', '130499170000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('4070713', '1', '某D5152警', '130499130000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('2012654', '1', '某D6129警', '130499140000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('6527161', '1', '某D3929警', '130499080000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('2883402', '1', '某D5331警', '130499140000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('6027590', '1', '某D6386警', '130499200000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('6238479', '1', '某D3269警', '1230035', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('3674333', '1', '某D5116警', '130499130000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('4276215', '1', '某D0262警', '130499090000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('1867026', '1', '某D6301警', '130499090000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('2110105', '1', '某D5299警', '130499100000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('2865408', '1', '某D5978警', '130499110000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('2539821', '1', '某D0103警', '1230041', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('4016419', '1', '某D5068警', '130499110000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('4534092', '1', '某D6159警', '1230043', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('3432205', '1', '某D3850警', '130499080000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('6597379', '1', '某D3853警', '130499090000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('9143212', '1', '某D3266警', '12300431', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('1364119', '1', '某D5981警', '130499170000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('1028669', '1', '某D6119警', '130499090000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('3330348', '1', '某D5620警', '130499150000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('7221364', '1', '某D3870警', '130499110000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('2923936', '1', '某D1828警', '130499080000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('5160318', '1', '某D6778警', '130499180000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('1690774', '1', '某D3292警', '1230036', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('6788227', '1', '某D0051警', '1230034', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('4743016', '1', '某D5129警', '130499110000', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('8938030', '1', '某D0311警', '1230013', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('5289647', '1', '某D2115警', '1230045', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('2757367', '1', '某D2572警', '1230081', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('7891511', '1', '某D1587警', '1230053', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('5974752', '1', '某D5001警', '1230048', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('8626916', '1', '某D3875警', '1230085', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('8029596', '1', '某D3891警', '1230073', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('8605127', '1', '某D5218警', '1230046', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('1384799', '1', '某D5280警', '1230052', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('1128934', '1', '某D5610警', '1230078', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('3816434', '1', '某D5618警', '1230079', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('9521148', '1', '某D5987警', '1230027', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('9751891', '1', '某D6121警', '1230076', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('7287262', '1', '某D6156警', '1230077', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('9658260', '1', '某D6162警', '1230029', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('8845634', '1', '某D6165警', '1230022', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('9685309', '1', '某D6331警', '130499110099', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('9731844', '1', '某D6330警', '1230098', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('9494256', '1', '某D0628警', '1230051', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('7681468', '2', '某D0308警', '1230016', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('7284126', '2', '某D6305警', '1230094', null, null, 1, null, null, null, null, null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('7328238', '2', '某D0605警', '1230093', '{id:"1234567"}]', null, 1, null, null, null, '{id:"1234567"}]', null);
INSERT INTO gdm_gis_carrier ("id", "car_type", "car_title", "org_id", "license", "operator", "valid", "create_time", "update_time", "mark_type", "icon_file_path", "name") VALUES ('5236180', '2', '某D6300警', '130499200000', '', null, 1, null, null, null, '', null);
