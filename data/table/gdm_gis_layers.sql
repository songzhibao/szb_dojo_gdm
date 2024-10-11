DROP TABLE IF EXISTS gdm_gis_layers CASCADE;

CREATE TABLE gdm_gis_layers (
    id character varying(10),
    layer_title character varying(30) NOT NULL,
    layer_type character varying(10) NOT NULL,
    group_id character varying(10) NOT NULL,
    layer_name character varying(30) NOT NULL,
    display_field character varying(30) NOT NULL,
    field_list character varying(2000) NOT NULL,
    show_url character varying(1500) NOT NULL,
    icon_path character varying(500) NOT NULL,
    is_check character varying(50) NOT NULL,
    showwhere character varying(50) NOT NULL,
    comdition character varying(200) NOT NULL,
    min_resolution character varying(255) NOT NULL,
    max_resolution character varying(255) NOT NULL,
    pop_info character varying(255) NOT NULL,
    buttons character varying(255) NOT NULL,
    order_number character varying(255) NOT NULL
);


CREATE UNIQUE INDEX ds_gis_layers_pkey ON gdm.gdm_gis_layers USING btree (id);

COMMENT ON COLUMN gdm_gis_layers.id IS 'id';
COMMENT ON COLUMN gdm_gis_layers.layer_title IS '显示中文名称';
COMMENT ON COLUMN gdm_gis_layers.layer_type IS '查询类型，包括：PGIS，SDE，DB，WMS';
COMMENT ON COLUMN gdm_gis_layers.group_id IS '父级id';
COMMENT ON COLUMN gdm_gis_layers.layer_name IS '服务中图层名，若果是db类型，就是表名';
COMMENT ON COLUMN gdm_gis_layers.display_field IS '显示字段名';
COMMENT ON COLUMN gdm_gis_layers.field_list IS '字段名';
COMMENT ON COLUMN gdm_gis_layers.show_url IS 'show_url';
COMMENT ON COLUMN gdm_gis_layers.icon_path IS 'icon_path';
COMMENT ON COLUMN gdm_gis_layers.is_check IS 'is_check';
COMMENT ON COLUMN gdm_gis_layers.showwhere IS 'showwhere';
COMMENT ON COLUMN gdm_gis_layers.comdition IS 'comdition';
COMMENT ON COLUMN gdm_gis_layers.min_resolution IS 'min_resolution';
COMMENT ON COLUMN gdm_gis_layers.max_resolution IS 'max_resolution';
COMMENT ON COLUMN gdm_gis_layers.pop_info IS 'pop_info';
COMMENT ON COLUMN gdm_gis_layers.buttons IS 'buttons';
COMMENT ON COLUMN gdm_gis_layers.order_number IS 'order_number';

INSERT INTO gdm_gis_layers ("id", "layer_title", "layer_type", "group_id", "layer_name", "display_field", "field_list", "show_url", "icon_path", "is_check", "showwhere", "comdition", "min_resolution", "max_resolution", "pop_info", "buttons", "order_number") VALUES ('20', '物资存放点', 'POINT', null, 'data_wzcfd', 'name', null, null, '/Content/themes/blue/images/points/data_wzcfd.png', null, null, null, null, null, null, null, null);
INSERT INTO gdm_gis_layers ("id", "layer_title", "layer_type", "group_id", "layer_name", "display_field", "field_list", "show_url", "icon_path", "is_check", "showwhere", "comdition", "min_resolution", "max_resolution", "pop_info", "buttons", "order_number") VALUES ('10', '重点单位', 'POINT', null, 'data_zddw', 'name', null, null, '/Content/themes/blue/images/points/data_zddw.gif', null, null, null, null, null, null, null, null);
