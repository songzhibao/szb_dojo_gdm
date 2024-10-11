DROP TABLE IF EXISTS gdm_deduce_task CASCADE;

CREATE TABLE gdm_deduce_task (
    id character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    status numeric(2,0) NOT NULL,
    type character varying(50) NOT NULL,
    begin_time timestamp(6) without time zone NOT NULL,
    end_time timestamp(6) without time zone NOT NULL,
    is_used numeric(1,0) NOT NULL DEFAULT 1,
    is_deleted numeric(1,0) NOT NULL DEFAULT 0,
    create_time timestamp(6) without time zone NOT NULL,
    update_time timestamp(6) without time zone NOT NULL
);



COMMENT ON COLUMN gdm_deduce_task.id IS 'id';
COMMENT ON COLUMN gdm_deduce_task.name IS '填充颜色';
COMMENT ON COLUMN gdm_deduce_task.status IS '0-未启动,1-已启动';
COMMENT ON COLUMN gdm_deduce_task.type IS '类型';
COMMENT ON COLUMN gdm_deduce_task.begin_time IS 'begin_time';
COMMENT ON COLUMN gdm_deduce_task.end_time IS 'end_time';
COMMENT ON COLUMN gdm_deduce_task.is_used IS 'is_used';
COMMENT ON COLUMN gdm_deduce_task.is_deleted IS 'is_deleted';
COMMENT ON COLUMN gdm_deduce_task.create_time IS '生成时间';
COMMENT ON COLUMN gdm_deduce_task.update_time IS '修改时间';

INSERT INTO gdm_deduce_task ("id", "name", "status", "type", "begin_time", "end_time", "is_used", "is_deleted", "create_time", "update_time") VALUES ('2023513083626865', '泥石流推演', null, '30', '2023-05-01 00:00:00', '2023-05-30 00:00:00', 1, 0, null, null);
INSERT INTO gdm_deduce_task ("id", "name", "status", "type", "begin_time", "end_time", "is_used", "is_deleted", "create_time", "update_time") VALUES ('2023611124224937', '终结方案', null, '30', '2023-06-01 00:00:00', '2023-06-30 00:00:00', 1, 0, null, null);
