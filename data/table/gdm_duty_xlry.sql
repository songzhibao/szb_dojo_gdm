DROP TABLE IF EXISTS gdm_duty_xlry CASCADE;

CREATE TABLE gdm_duty_xlry (
    id numeric(16,0),
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    job character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    duty_id numeric(16,0) NOT NULL
);


CREATE UNIQUE INDEX ds_duty_xlry_pkey ON gdm.gdm_duty_xlry USING btree (id);

COMMENT ON COLUMN gdm_duty_xlry.id IS 'id';
COMMENT ON COLUMN gdm_duty_xlry.code IS 'code';
COMMENT ON COLUMN gdm_duty_xlry.name IS 'name';
COMMENT ON COLUMN gdm_duty_xlry.job IS 'job';
COMMENT ON COLUMN gdm_duty_xlry.phone IS 'phone';
COMMENT ON COLUMN gdm_duty_xlry.duty_id IS 'duty_id';

INSERT INTO gdm_duty_xlry ("id", "code", "name", "job", "phone", "duty_id") VALUES (20230520142747, 'FJ1384', '某岱峰', '轮巡员', null, 20230520142736);
INSERT INTO gdm_duty_xlry ("id", "code", "name", "job", "phone", "duty_id") VALUES (20230520142752, 'FJ0999', '某统', '轮巡员', null, 20230520142736);
INSERT INTO gdm_duty_xlry ("id", "code", "name", "job", "phone", "duty_id") VALUES (20230520142914, 'FJ2165', '某泽鹏', '轮巡员', null, 20230520142913);
INSERT INTO gdm_duty_xlry ("id", "code", "name", "job", "phone", "duty_id") VALUES (20230520142915, 'FJ2971', '某鑫', '轮巡员', null, 20230520142913);
INSERT INTO gdm_duty_xlry ("id", "code", "name", "job", "phone", "duty_id") VALUES (20230520142916, 'FJ3392', '某鹏帅', '轮巡员', null, 20230520142913);
INSERT INTO gdm_duty_xlry ("id", "code", "name", "job", "phone", "duty_id") VALUES (20230611123526, 'FJ1384', '某岱峰', '轮巡员', null, 20230611123525);
