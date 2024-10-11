DROP TABLE IF EXISTS gdm_deduce_region CASCADE;

CREATE TABLE gdm_deduce_region (
    id numeric(16,0),
    task_id character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    stage numeric(2,0) NOT NULL,
    content text NOT NULL,
    bordercolor character varying(50) NOT NULL,
    borderwidth character varying(50) NOT NULL,
    fillcolor character varying(50) NOT NULL,
    opacite numeric(3,2) NOT NULL,
    is_used numeric(1,0) NOT NULL DEFAULT 1,
    is_deleted numeric(1,0) NOT NULL DEFAULT 0,
    create_time date NOT NULL,
    update_time date NOT NULL,
    geom geometry NOT NULL
);



COMMENT ON COLUMN gdm_deduce_region.id IS 'id';
COMMENT ON COLUMN gdm_deduce_region.task_id IS 'task_id';
COMMENT ON COLUMN gdm_deduce_region.name IS 'name';
COMMENT ON COLUMN gdm_deduce_region.stage IS '阶段 10 20 30';
COMMENT ON COLUMN gdm_deduce_region.content IS '图形内容';
COMMENT ON COLUMN gdm_deduce_region.bordercolor IS 'bordercolor';
COMMENT ON COLUMN gdm_deduce_region.borderwidth IS 'borderwidth';
COMMENT ON COLUMN gdm_deduce_region.fillcolor IS '填充颜色';
COMMENT ON COLUMN gdm_deduce_region.opacite IS 'opacite';
COMMENT ON COLUMN gdm_deduce_region.is_used IS 'is_used';
COMMENT ON COLUMN gdm_deduce_region.is_deleted IS 'is_deleted';
COMMENT ON COLUMN gdm_deduce_region.create_time IS '生成时间';
COMMENT ON COLUMN gdm_deduce_region.update_time IS '修改时间';
COMMENT ON COLUMN gdm_deduce_region.geom IS 'geom';

INSERT INTO gdm_deduce_region ("id", "task_id", "name", "stage", "content", "bordercolor", "borderwidth", "fillcolor", "opacite", "is_used", "is_deleted", "create_time", "update_time", "geom") VALUES (20230513182356, '2023513083626865', null, null, 'Circle|121.44824176687011,28.641434104663087,0.014429769985426333', null, null, null, null, 1, 0, null, null, null);
INSERT INTO gdm_deduce_region ("id", "task_id", "name", "stage", "content", "bordercolor", "borderwidth", "fillcolor", "opacite", "is_used", "is_deleted", "create_time", "update_time", "geom") VALUES (20230520152232, '2023513083626865', null, null, 'LineString|118.36233077762775,36.83972895904973,118.50515304325275,36.79303706451848,118.54223190067462,36.74909175201848,118.56557784794025,36.651588089909104,118.57656417606525,36.57056391998723,118.573817594034,36.52661860748723', null, null, null, null, 1, 0, null, null, null);
