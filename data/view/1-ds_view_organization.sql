DROP VIEW IF EXISTS ds_view_organization CASCADE;

CREATE OR REPLACE VIEW ds_view_organization AS
 SELECT org.id,
    org.code,
    org.name,
    org.level,
    org.pid,
    org.order_number,
    org.lon,
    org.lat,
    org.telphone,
    org.memo,
    org.operator,
    org.valid,
    org.create_time,
    org.update_time,
    ( WITH RECURSIVE org_r AS (
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM gdm.gdm_sys_organization org_t
                  WHERE (((org_t.valid)::numeric = (1)::numeric) AND ((org_t.id)::text = (org.id)::text))
                UNION ALL
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM (gdm.gdm_sys_organization org_t
                     JOIN org_r org_r_1 ON (((org_r_1.pid)::text = (org_t.id)::text)))
                  WHERE ((org_t.valid)::numeric = (1)::numeric)
                )
         SELECT org_r.id
           FROM org_r
          WHERE ((org_r.level)::text = '11001'::text)) AS parent_id_at_11001,
    ( WITH RECURSIVE org_r AS (
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM gdm.gdm_sys_organization org_t
                  WHERE (((org_t.valid)::numeric = (1)::numeric) AND ((org_t.id)::text = (org.id)::text))
                UNION ALL
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM (gdm.gdm_sys_organization org_t
                     JOIN org_r org_r_1 ON (((org_r_1.pid)::text = (org_t.id)::text)))
                  WHERE ((org_t.valid)::numeric = (1)::numeric)
                )
         SELECT org_r.name
           FROM org_r
          WHERE ((org_r.level)::text = '11001'::text)) AS parent_name_at_11001,
    ( WITH RECURSIVE org_r AS (
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM gdm.gdm_sys_organization org_t
                  WHERE (((org_t.valid)::numeric = (1)::numeric) AND ((org_t.id)::text = (org.id)::text))
                UNION ALL
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM (gdm.gdm_sys_organization org_t
                     JOIN org_r org_r_1 ON (((org_r_1.pid)::text = (org_t.id)::text)))
                  WHERE ((org_t.valid)::numeric = (1)::numeric)
                )
         SELECT org_r.id
           FROM org_r
          WHERE ((org_r.level)::text = '11002'::text)) AS parent_id_at_11002,
    ( WITH RECURSIVE org_r AS (
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM gdm.gdm_sys_organization org_t
                  WHERE (((org_t.valid)::numeric = (1)::numeric) AND ((org_t.id)::text = (org.id)::text))
                UNION ALL
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM (gdm.gdm_sys_organization org_t
                     JOIN org_r org_r_1 ON (((org_r_1.pid)::text = (org_t.id)::text)))
                  WHERE ((org_t.valid)::numeric = (1)::numeric)
                )
         SELECT org_r.name
           FROM org_r
          WHERE ((org_r.level)::text = '11002'::text)) AS parent_name_at_11002,
    ( WITH RECURSIVE org_r AS (
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM gdm.gdm_sys_organization org_t
                  WHERE (((org_t.valid)::numeric = (1)::numeric) AND ((org_t.id)::text = (org.id)::text))
                UNION ALL
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM (gdm.gdm_sys_organization org_t
                     JOIN org_r org_r_1 ON (((org_r_1.pid)::text = (org_t.id)::text)))
                  WHERE ((org_t.valid)::numeric = (1)::numeric)
                )
         SELECT org_r.id
           FROM org_r
          WHERE ((org_r.level)::text = '11003'::text)) AS parent_id_at_11003,
    ( WITH RECURSIVE org_r AS (
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM gdm.gdm_sys_organization org_t
                  WHERE (((org_t.valid)::numeric = (1)::numeric) AND ((org_t.id)::text = (org.id)::text))
                UNION ALL
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM (gdm.gdm_sys_organization org_t
                     JOIN org_r org_r_1 ON (((org_r_1.pid)::text = (org_t.id)::text)))
                  WHERE ((org_t.valid)::numeric = (1)::numeric)
                )
         SELECT org_r.name
           FROM org_r
          WHERE ((org_r.level)::text = '11003'::text)) AS parent_name_at_11003,
    ( WITH RECURSIVE org_r AS (
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM gdm.gdm_sys_organization org_t
                  WHERE (((org_t.valid)::numeric = (1)::numeric) AND ((org_t.id)::text = (org.id)::text))
                UNION ALL
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM (gdm.gdm_sys_organization org_t
                     JOIN org_r org_r_1 ON (((org_r_1.pid)::text = (org_t.id)::text)))
                  WHERE ((org_t.valid)::numeric = (1)::numeric)
                )
         SELECT org_r.id
           FROM org_r
          WHERE ((org_r.level)::text = '11004'::text)) AS parent_id_at_11004,
    ( WITH RECURSIVE org_r AS (
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM gdm.gdm_sys_organization org_t
                  WHERE (((org_t.valid)::numeric = (1)::numeric) AND ((org_t.id)::text = (org.id)::text))
                UNION ALL
                 SELECT org_t.id,
                    org_t.pid,
                    org_t.name,
                    org_t.level
                   FROM (gdm.gdm_sys_organization org_t
                     JOIN org_r org_r_1 ON (((org_r_1.pid)::text = (org_t.id)::text)))
                  WHERE ((org_t.valid)::numeric = (1)::numeric)
                )
         SELECT org_r.name
           FROM org_r
          WHERE ((org_r.level)::text = '11004'::text)) AS parent_name_at_11004
   FROM gdm.gdm_sys_organization org;

