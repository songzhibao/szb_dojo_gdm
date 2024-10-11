DROP TABLE IF EXISTS gdm_action_requestlog CASCADE;

CREATE TABLE gdm_action_requestlog (
    id numeric(16,0),
    actiontype character varying(50),
    actionkey character varying(50) NOT NULL,
    actionexplain character varying(50),
    eventpath character varying(50),
    eventid character varying(50) NOT NULL,
    eventname character varying(50) NOT NULL,
    paramobject character varying(4000) NOT NULL,
    userid numeric(16,0) NOT NULL,
    username character varying(50) NOT NULL,
    userip character varying(50) NOT NULL,
    usergroup character varying(150) NOT NULL,
    create_time timestamp(6) without time zone NOT NULL
);


CREATE INDEX idx_action_actype ON gdm.gdm_action_requestlog USING btree (actiontype);
CREATE UNIQUE INDEX id_requestlog ON gdm.gdm_action_requestlog USING btree (id);

COMMENT ON COLUMN gdm_action_requestlog.id IS '主键ID(GUID)';
COMMENT ON COLUMN gdm_action_requestlog.actiontype IS '操作类型';
COMMENT ON COLUMN gdm_action_requestlog.actionkey IS 'actionkey';
COMMENT ON COLUMN gdm_action_requestlog.actionexplain IS '操作说明';
COMMENT ON COLUMN gdm_action_requestlog.eventpath IS '事件地址';
COMMENT ON COLUMN gdm_action_requestlog.eventid IS '事件ID';
COMMENT ON COLUMN gdm_action_requestlog.eventname IS '事件名词';
COMMENT ON COLUMN gdm_action_requestlog.paramobject IS '请求参数';
COMMENT ON COLUMN gdm_action_requestlog.userid IS 'userid';
COMMENT ON COLUMN gdm_action_requestlog.username IS 'username';
COMMENT ON COLUMN gdm_action_requestlog.userip IS 'userip';
COMMENT ON COLUMN gdm_action_requestlog.usergroup IS 'usergroup';
COMMENT ON COLUMN gdm_action_requestlog.create_time IS '创建时间';

