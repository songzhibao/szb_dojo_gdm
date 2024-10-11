DROP VIEW IF EXISTS ds_view_police CASCADE;

CREATE OR REPLACE VIEW ds_view_police AS
 SELECT tb_member.id AS itemid,
    tb_member.id AS itemcode,
    tb_member.title AS devicename,
    tb_police.name AS policename,
    tb_type.id AS typeid,
    tb_type.code AS typecode,
    tb_type.name AS typename,
    tb_type.order_number AS typeorder,
    tb_status.id AS statusid,
    tb_status.code AS statuscode,
    tb_status.name AS statusname,
    tb_org.id AS orgid,
    tb_org.code AS orgcode,
    tb_org.name AS orgname,
    tb_org.parent_id_at_11002 AS orgid2,
    tb_org.parent_id_at_11002 AS orgcode2,
    tb_org.parent_name_at_11002 AS orgname2,
    tb_org.parent_id_at_11003 AS orgid3,
    tb_org.parent_id_at_11003 AS orgcode3,
    tb_org.parent_name_at_11003 AS orgname3,
    to_char(tb_device.gps_time, 'YYYY-MM-DD hh24:mi:ss'::text) AS gpstime,
    tb_device.lon,
    tb_device.lat,
    tb_member.org_spatial AS orgcodespatial,
    tb_police.carriertype,
    tb_police.vehicletype,
        CASE
            WHEN (tb_device.gps_time >= gdm.getonlinetime()) THEN 'online'::text
            ELSE 'offline'::text
        END AS onlinestatus,
    tb_police.police_number AS policenumber,
    tb_member.keyword,
    tb_police.phone,
    tb_device.code AS maindevicecode,
    tb_groupmember.group_id AS groupid,
    gdm_dic_jobtype.id AS jobid,
    gdm_dic_jobtype.name AS jobname,
    tb_device.geom
   FROM ((((((((gdm.gdm_gis_member tb_member
     LEFT JOIN ( SELECT tb_devicemember_1.member_id,
            tb_devicemember_1.device_id
           FROM ( SELECT m.member_id,
                    max((m.device_id)::text) AS device_id
                   FROM gdm.gdm_gis_device_member m
                  WHERE (m.is_default = true)
                  GROUP BY m.member_id) tb_devicemember_1) tb_devicemember ON (((tb_member.id)::text = (tb_devicemember.member_id)::text)))
     LEFT JOIN gdm.gdm_gis_device tb_device ON (((tb_device.id)::text = tb_devicemember.device_id)))
     LEFT JOIN ( SELECT tb_police_1.id,
            tb_police_1.name,
            tb_police_1.police_number,
            tb_police_1.carriertype,
            tb_police_1.vehicletype,
            tb_police_1.phone
           FROM ( SELECT staff.id,
                    staff.man_title AS name,
                    staff.police_number,
                    '2'::text AS carriertype,
                    staff.man_type AS vehicletype,
                    staff.phone_number AS phone
                   FROM gdm.gdm_gis_staff staff
                UNION ALL
                 SELECT carrier.id,
                    carrier.car_title AS name,
                    ''::character varying AS police_number,
                    '1'::text AS carriertype,
                    carrier.car_type AS vehicletype,
                    ''::character varying AS phone
                   FROM gdm.gdm_gis_carrier carrier) tb_police_1) tb_police ON (((tb_police.id)::text = (tb_member.sub_id)::text)))
     LEFT JOIN gdm.ds_view_organization tb_org ON (((tb_member.org_id)::text = (tb_org.id)::text)))
     LEFT JOIN gdm.gdm_gps_groupmember tb_groupmember ON ((((tb_groupmember.member_id)::text = (tb_member.id)::text) AND (tb_groupmember.is_default = (1)::numeric))))
     LEFT JOIN gdm.gdm_dic_policetype tb_type ON (((tb_type.id)::text = (tb_member.police_type)::text)))
     LEFT JOIN gdm.gdm_dic_status tb_status ON (((tb_status.id)::text = (tb_member.duty_status)::text)))
     LEFT JOIN gdm.gdm_dic_jobtype ON ((((tb_member.job_type)::text = (gdm_dic_jobtype.id)::text) AND (gdm_dic_jobtype.valid = (1)::numeric))))
  WHERE (tb_org.id IS NOT NULL);

