DROP TABLE IF EXISTS gdm_gis_layershow CASCADE;

CREATE TABLE gdm_gis_layershow (
    id character varying(50) DEFAULT nextval('seq_layerid'::regclass),
    code character varying(100) NOT NULL,
    dispname character varying(100) NOT NULL,
    layername character varying(50) NOT NULL,
    layertype character varying(50) NOT NULL,
    lon numeric(10,6) NOT NULL,
    lat numeric(10,6) NOT NULL,
    linestr character varying NOT NULL,
    lineattr character varying NOT NULL,
    geom geometry NOT NULL,
    valid numeric(1,0) DEFAULT 1,
    deleted numeric(1,0) DEFAULT 0,
    create_time timestamp(6) without time zone NOT NULL,
    update_time timestamp(6) without time zone NOT NULL
);


CREATE INDEX idx_ds_gis_layershow_id ON gdm.gdm_gis_layershow USING btree (id);
CREATE INDEX idx_layershow_dispname ON gdm.gdm_gis_layershow USING btree (dispname);
CREATE INDEX idx_layershow_layername ON gdm.gdm_gis_layershow USING btree (layername);
CREATE UNIQUE INDEX ds_gis_layershow_pkey ON gdm.gdm_gis_layershow USING btree (id);

COMMENT ON COLUMN gdm_gis_layershow.id IS 'id';
COMMENT ON COLUMN gdm_gis_layershow.code IS 'code';
COMMENT ON COLUMN gdm_gis_layershow.dispname IS 'dispname';
COMMENT ON COLUMN gdm_gis_layershow.layername IS 'layername';
COMMENT ON COLUMN gdm_gis_layershow.layertype IS 'layertype';
COMMENT ON COLUMN gdm_gis_layershow.lon IS 'lon';
COMMENT ON COLUMN gdm_gis_layershow.lat IS 'lat';
COMMENT ON COLUMN gdm_gis_layershow.linestr IS 'linestr';
COMMENT ON COLUMN gdm_gis_layershow.lineattr IS 'lineattr';
COMMENT ON COLUMN gdm_gis_layershow.geom IS 'geom';
COMMENT ON COLUMN gdm_gis_layershow.valid IS '有效性，0-无效 1-有效';
COMMENT ON COLUMN gdm_gis_layershow.deleted IS '删除标识，0-未删除，1-已删除';
COMMENT ON COLUMN gdm_gis_layershow.create_time IS '创建时间';
COMMENT ON COLUMN gdm_gis_layershow.update_time IS '更新时间';

INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90010', null, '大名县实验小学', 'data_zddw', 'POINT', 116.678374, 36.594481, 'POINT(116.678373840215 36.594480711602)', null, '0101000000BD8B1C7A6A2B5D407837A7F1174C4240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90020', null, '河北冶金建设集团有限公司第三工程分公司', 'data_zddw', 'POINT', 116.903903, 36.747045, 'POINT(116.903903455717 36.7470448632655)', null, '0101000000FB42E18DD9395D40622F842A9F5F4240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90030', null, '书香佳苑', 'data_zddw', 'POINT', 117.096267, 36.574581, 'POINT(117.096266951293 36.5745810396459)', null, '010100000046DFDB3C29465D4022171BDF8B494240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90040', null, '龙山宾馆', 'data_zddw', 'POINT', 117.182499, 36.223020, 'POINT(117.182498863103 36.2230201684212)', null, '01010000005625B60FAE4B5D40D9DBC4EC8B1C4240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90050', null, '新顺意物流', 'data_zddw', 'POINT', 117.043201, 35.533165, 'POINT(117.04320115941 35.5331648739427)', null, '010100000028B4CBCEC3425D40D67A20BF3EC44140', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90060', null, '临漳县香菜营中学', 'data_zddw', 'POINT', 117.825922, 35.393867, 'POINT(117.825921589684 35.3938671702499)', null, '01010000001E303AE6DB745D407B984B3D6AB24140', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90070', null, '广平县靳庄医院', 'data_zddw', 'POINT', 117.354963, 34.704012, 'POINT(117.354962686722 34.7040118757713)', null, '010100000077B16AB5B7565D407837A70F1D5A4140', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90080', null, '四中家属院', 'data_zddw', 'POINT', 118.323413, 35.135171, 'POINT(118.323413388587 35.1351714348204)', null, '010100000054C411CEB2945D401AF42D4C4D914140', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90090', null, '河北省邱县高第学校', 'data_zddw', 'POINT', 118.661708, 35.433667, 'POINT(118.66170781184 35.4336665141621)', null, '010100000030D7B86B59AA5D4027D9636282B74140', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90100', null, '圣水湖畔', 'data_zddw', 'POINT', 119.397996, 36.010757, 'POINT(119.397995674217 36.0107570008894)', null, '01010000006C2DD9C278D95D40EC82437C60014240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90110', null, '邯郸县食品药品监督管理局', 'data_zddw', 'POINT', 119.404629, 35.393867, 'POINT(119.404628898202 35.3938671702499)', null, '0101000000D0329B70E5D95D407B984B3D6AB24140', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90120', null, '南湖花园', 'data_zddw', 'POINT', 120.101117, 36.037290, 'POINT(120.101117416666 36.0372898968308)', null, '0101000000B5682FB578065E400AAE53EAC5044240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90130', null, '滏河桥供电院', 'data_zddw', 'POINT', 120.598609, 36.349051, 'POINT(120.598609215569 36.3490514241433)', null, '0101000000EAFC069D4F265E40A6A891B7AD2C4240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90140', null, '河北工程大学新校区', 'data_zddw', 'POINT', 120.193983, 36.382218, 'POINT(120.193982552461 36.3822175440701)', null, '010100000028B4CB356A0C5E408BDE2581EC304240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90150', null, '锦辉小区', 'data_zddw', 'POINT', 120.664941, 36.866443, 'POINT(120.664941455422 36.8664428950022)', null, '0101000000D0329B668E2A5E4068F1CC99E76E4240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90160', null, '河北美图制药有限责任公司', 'data_zddw', 'POINT', 121.407863, 37.377201, 'POINT(121.407862541784 37.3772011418757)', null, '01010000006E8E7D6B1A5A5E40622F842048B04240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90170', null, '永年化肥厂家属院(永化小区)', 'data_zddw', 'POINT', 119.457695, 36.727145, 'POINT(119.457694690085 36.7271451913094)', null, '0101000000ED5DABDE4ADD5D400C0FF817135D4240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90180', null, '河北冠科金属制品有限公司', 'data_zddw', 'POINT', 119.079601, 36.793477, 'POINT(119.079600922919 36.7934774311631)', null, '0101000000BA2A782E18C55D40D67A20AB90654240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90190', null, '春晖小区', 'data_zddw', 'POINT', 118.217282, 36.992474, 'POINT(118.217281804821 36.9924741507242)', null, '0101000000186EF1F1E78D5D4035BE9964097F4240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90200', null, '邯郸市贝特佳玩具有限公司', 'data_zddw', 'POINT', 118.641808, 37.615997, 'POINT(118.641808139884 37.6159972053491)', null, '010100000005C7726213A95D406DB315FFD8CE4240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90210', null, '润泽小区', 'data_zddw', 'POINT', 118.018285, 37.350668, 'POINT(118.018285085259 37.3506682459343)', null, '010100000069CC34952B815D40450474B2E2AC4240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('10002', null, '和家大院', 'data_zddw', 'POINT', 117.414662, 36.773578, 'POINT(117.414661702591 36.773577759207)', null, '0101000000F8E13CD1895A5D40805A949804634240', 1, 0, '2023-05-18 15:32:14.024225', '2023-05-18 15:32:14.024225');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90220', null, '物资存放点', 'data_wzcfd', 'POINT', 121.686458, 37.231270, 'POINT(121.68645794917 37.2312702141976)', null, '0101000000CA7052EDEE6B5E4040422B439A9D4240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90230', null, '物资存放点', 'data_wzcfd', 'POINT', 121.421129, 36.912875, 'POINT(121.421128989755 36.9128754628998)', null, '0101000000359901C7F35A5E40DC3C691AD9744240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90240', null, '物资存放点', 'data_wzcfd', 'POINT', 121.215499, 36.740412, 'POINT(121.215499046208 36.7404116392802)', null, '010100000022F282BCCA4D5E409C2400CFC55E4240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90250', null, '物资存放点', 'data_wzcfd', 'POINT', 120.611876, 36.209754, 'POINT(120.611875663539 36.2097537204505)', null, '0101000000B1078BF828275E404BC6BC35D91A4240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90260', null, '物资存放点', 'data_wzcfd', 'POINT', 121.314997, 37.470066, 'POINT(121.314997405989 37.4700662776709)', null, '0101000000FA42E1EA28545E404BC6BC212BBC4240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90270', null, '物资存放点', 'data_wzcfd', 'POINT', 120.552177, 36.906242, 'POINT(120.552176647671 36.9062422389144)', null, '010100000030D7B8DC56235E401532E5BEFF734240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90280', null, '物资存放点', 'data_wzcfd', 'POINT', 120.439412, 36.189854, 'POINT(120.43941183992 36.1898540484944)', null, '0101000000917BD6521F1C5E40F5A530234D184240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90290', null, '物资存放点', 'data_wzcfd', 'POINT', 120.074585, 35.957691, 'POINT(120.074584520724 35.9576912090064)', null, '0101000000255327FEC5045E40B12C23A095FA4140', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90300', null, '物资存放点', 'data_wzcfd', 'POINT', 119.378096, 36.707246, 'POINT(119.37809600226 36.7072455193533)', null, '0101000000401D93B932D85D40B7EE6B05875A4240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90310', null, '物资存放点', 'data_wzcfd', 'POINT', 118.170849, 36.826644, 'POINT(118.170849236923 36.82664355109)', null, '01010000005E48A331EF8A5D40BCB0B474CF694240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90320', null, '物资存放点', 'data_wzcfd', 'POINT', 117.242198, 36.660813, 'POINT(117.242197878971 36.6608129514557)', null, '0101000000D755882B804F5D4043A3CF8495544240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90330', null, '物资存放点', 'data_wzcfd', 'POINT', 116.970236, 36.528148, 'POINT(116.970235695571 36.5281484717483)', null, '0101000000DF787557183E5D40AECB7E5E9A434240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90340', null, '物资存放点', 'data_wzcfd', 'POINT', 117.806022, 36.262820, 'POINT(117.806021917728 36.2628195123335)', null, '0101000000F21FF4DC95735D40861CDD11A4214240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90350', null, '物资存放点', 'data_wzcfd', 'POINT', 118.369846, 36.136788, 'POINT(118.369845956484 36.1367882566114)', null, '01010000000DEA5F8EAB975D40B94F104782114240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90360', null, '物资存放点', 'data_wzcfd', 'POINT', 118.515777, 35.208137, 'POINT(118.515776884162 35.2081368986595)', null, '01010000009E600C7D02A15D40AC6ADA3AA49A4140', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90370', null, '物资存放点', 'data_wzcfd', 'POINT', 117.653458, 35.466833, 'POINT(117.653457766064 35.466832634089)', null, '0101000000FDA38540D2695D400D0FF82BC1BB4140', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90380', null, '物资存放点', 'data_wzcfd', 'POINT', 118.635175, 35.320902, 'POINT(118.635174915899 35.3209017064108)', null, '0101000000A1C1B0B4A6A85D40EA219F4E13A94140', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90390', null, '物资存放点', 'data_wzcfd', 'POINT', 117.056468, 35.141805, 'POINT(117.056467607381 35.1418046588058)', null, '0101000000EFBE4F2A9D435D40E2FEB1A726924140', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90400', null, '物资存放点', 'data_wzcfd', 'POINT', 117.122800, 35.811760, 'POINT(117.122799847234 35.8117602813282)', null, '0101000000D4F4E3F3DB475D408E3FCAC2E7E74140', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90410', null, '物资存放点', 'data_wzcfd', 'POINT', 119.895487, 36.501616, 'POINT(119.895487473119 36.5016155758068)', null, '0101000000A1C1B0AA4FF95D4091A06EF034404240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
INSERT INTO gdm_gis_layershow ("id", "code", "dispname", "layername", "layertype", "lon", "lat", "linestr", "lineattr", "geom", "valid", "deleted", "create_time", "update_time") VALUES ('90420', null, '物资存放点', 'data_wzcfd', 'POINT', 120.140917, 36.223020, 'POINT(120.140916760578 36.2230201684212)', null, '01010000000A89BBC704095E40DADBC4EC8B1C4240', 1, 0, '2023-05-18 15:31:11.904916', '2023-05-18 15:31:11.904916');
